import { IsInt, IsPositive, IsString, IsUUID, Min } from 'class-validator';

export class ConsumeDto {
  @IsUUID()
  @IsString()
  productId: string;
  @IsInt()
  @Min(1)
  @IsPositive()
  quantity: number;
}
