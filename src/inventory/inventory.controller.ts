/* eslint-disable @typescript-eslint/no-unsafe-call */
import { Controller, Post, Body, Patch } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { Auth } from '../auth/decorators/auth.decorators';
import { GetUser } from '../auth/decorators/get-user.decorators';
import { CreateBatchEntryDto } from './dto/create-batch-entry.dto';
import { ConsumeDto } from './dto/consume.dto';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';

@Controller('inventory')
@ApiTags('inventory')
@ApiBearerAuth()
export class InventoryController {
  constructor(private readonly inventoryService: InventoryService) {}

  @Post('batch')
  @Auth()
  @ApiOperation({ summary: 'Registrar entrada de lote y movimiento IN' })
  registerBatch(
    @Body() createBatchEntryDto: CreateBatchEntryDto,
    @GetUser('id') userId: string,
  ) {
    return this.inventoryService.registerBatch(createBatchEntryDto, userId);
  }
  @Patch('consume')
  @Auth()
  @ApiOperation({
    summary: 'Consumir stock con prioridad FEFO y registrar OUT',
  })
  consumeFEFO(@Body() consumeDto: ConsumeDto, @GetUser('id') userId: string) {
    return this.inventoryService.consumeFEFO(consumeDto, userId);
  }
}
