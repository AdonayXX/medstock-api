import { IsEnum, IsInt, IsOptional, IsUUID, Min } from 'class-validator';
import { MovementType } from '../entities/inventory.entity';

export class CreateInventoryDto {
  @IsEnum(MovementType)
  type: MovementType;
  @IsUUID()
  productId: string;
  @IsInt()
  @Min(1)
  quantity: number;
  @IsUUID()
  userId: string;
  @IsUUID()
  @IsOptional()
  batchId?: string;
}
