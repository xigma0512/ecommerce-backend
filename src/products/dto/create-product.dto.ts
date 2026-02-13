import { IsString, IsNumber, Min, IsInt, IsNotEmpty } from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  title: string;

  @IsNumber()
  @Min(0, { message: 'Price must be greater than or equal to 0' })
  price: number;

  @IsInt()
  @Min(0)
  stock: number;
}
