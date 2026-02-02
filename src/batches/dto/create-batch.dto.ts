import { Type } from 'class-transformer';
import {
  IsDate,
  IsInt,
  IsPositive,
  IsString,
  IsUUID,
  MinDate,
  MinLength,
} from 'class-validator';

export class CreateBatchDto {
  @IsUUID()
  productId: string;

  @IsString()
  @MinLength(1, { message: 'Code must be at least 1 character long' })
  code: string;

  @Type(() => Date)
  @IsDate()
  @MinDate(new Date())
  expirationDate: Date;

  @IsInt()
  @IsPositive()
  quantity: number;
}
