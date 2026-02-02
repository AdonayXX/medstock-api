import { Module } from '@nestjs/common';
import { BatchesService } from './batches.service';
import { BatchesController } from './batches.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Batches } from './entities/batch.entity';
import { ConfigModule } from '@nestjs/config';
import { Inventories } from '../inventory/entities/inventory.entity';
import { AuthModule } from '../auth/auth.module';

@Module({
  controllers: [BatchesController],
  providers: [BatchesService],
  imports: [
    TypeOrmModule.forFeature([Batches, Inventories]),
    ConfigModule,
    AuthModule,
  ],
  exports: [BatchesService],
})
export class BatchesModule {}
