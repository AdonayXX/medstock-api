import {
  IsDate,
  IsNumber,
  IsString,
  IsUUID,
  Min,
  MinLength,
} from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBatchEntryDto {
  @IsUUID()
  @IsString()
  productId: string;
  @IsString()
  @MinLength(1)
  code: string;
  @Type(() => Date)
  @IsDate()
  expirationDate: Date;
  @IsNumber()
  @Min(1)
  quantity: number;
}
