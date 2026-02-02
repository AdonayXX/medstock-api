import { IsOptional, IsString, MinLength } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @MinLength(1, { message: 'Name must be at least 1 character long' })
  name: string;

  @IsString()
  @MinLength(3, { message: 'SKU must be at least 3 characters long' })
  sku: string;

  @IsString()
  @IsOptional()
  description?: string;
}
