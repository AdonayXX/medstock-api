import { BadRequestException, Injectable } from '@nestjs/common';
import { DataSource } from 'typeorm';
import { BatchesService } from '../batches/batches.service';
import { Products } from '../products/entities/product.entity';
import { Inventories, MovementType } from './entities/inventory.entity';
import { CreateBatchEntryDto } from './dto/create-batch-entry.dto';
import { ConsumeDto } from './dto/consume.dto';

@Injectable()
export class InventoryService {
  constructor(
    private readonly dataSource: DataSource,
    private readonly batchesService: BatchesService,
  ) {}
  async registerBatch(dto: CreateBatchEntryDto, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      // 1) Validar producto
      const product = await manager.getRepository(Products).findOne({
        where: { id: dto.productId },
      });

      if (!product) {
        throw new BadRequestException('El producto no existe.');
      }

      // 2) Crear el lote (Batch)
      const batch = await this.batchesService.create(
        {
          productId: dto.productId,
          code: dto.code,
          expirationDate: new Date(dto.expirationDate),
          quantity: dto.quantity,
        } as any,
        manager,
      );

      // 3) Registrar movimiento IN (historial)
      const movementRepo = manager.getRepository(Inventories);

      const movement = movementRepo.create({
        type: MovementType.IN,
        productId: dto.productId,
        batchId: batch.id,
        quantity: dto.quantity,
        userId,
      });

      await movementRepo.save(movement);

      return {
        batch,
        movement,
      };
    });
  }

  async consumeFEFO(dto: ConsumeDto, userId: string) {
    return this.dataSource.transaction(async (manager) => {
      const batches = await this.batchesService.findByProductFEFO(
        dto.productId,
        manager,
      );

      // 2) Si no hay lotes
      if (!batches || batches.length === 0) {
        throw new BadRequestException(
          'El producto no tiene lotes registrados.',
        );
      }

      // 3) Validar stock total
      const totalStock = batches.reduce((acc, b) => acc + (b.quantity || 0), 0);
      if (dto.quantity > totalStock) {
        throw new BadRequestException(
          `Stock insuficiente. Disponible: ${totalStock}, solicitado: ${dto.quantity}.`,
        );
      }

      // Repositorio de movimientos dentro de la transacción
      const inventoryRepo = manager.getRepository(Inventories);

      // 4) Descontar lote por lote (FEFO)
      let remaining = dto.quantity;
      const details: Array<{ batchId: string; taken: number }> = [];

      for (const batch of batches) {
        if (remaining === 0) break;
        if (batch.quantity <= 0) continue;

        const taken = Math.min(batch.quantity, remaining);

        batch.quantity -= taken;
        remaining -= taken;

        // Guardar el lote modificado dentro de la transacción
        await this.batchesService.save(batch, manager);

        // 5) Registrar movimiento OUT por cada lote tocado
        const movement = inventoryRepo.create({
          type: MovementType.OUT,
          productId: dto.productId,
          batchId: batch.id,
          quantity: taken,
          userId,
        });

        await inventoryRepo.save(movement);

        details.push({ batchId: batch.id, taken });
      }

      return {
        success: true,
        consumed: dto.quantity,
        details,
      };
    });
  }
}
