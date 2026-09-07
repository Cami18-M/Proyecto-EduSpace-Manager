import {
  IsInt,
  IsNotEmpty,
  IsPositive,
  IsString,
  MaxLength,
} from 'class-validator';

export class CreateEspacioDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no debe superar los 100 caracteres' })
  nombre: string;

  @IsInt({ message: 'La capacidad debe ser un número entero' })
  @IsPositive({ message: 'La capacidad debe ser un número positivo' })
  capacidad: number;

  @IsInt({ message: 'El id de la facultad debe ser un número entero' })
  @IsPositive({ message: 'El id de la facultad debe ser un número positivo' })
  facultadId: number;
}
