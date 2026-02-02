import { Module } from '@nestjs/common';
import { InventoryService } from './inventory.service';
import { InventoryController } from './inventory.controller';
import { BatchesModule } from '../batches/batches.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ConfigModule } from '@nestjs/config';
import { Inventories } from './entities/inventory.entity';
import { AuthModule } from '../auth/auth.module';
import { ProductsModule } from '../products/products.module';

@Module({
  imports: [
    BatchesModule,
    TypeOrmModule.forFeature([Inventories]),
    ConfigModule,
    AuthModule,
    ProductsModule,
  ],
  controllers: [InventoryController],
  providers: [InventoryService],
  exports: [TypeOrmModule],
})
export class InventoryModule {}
