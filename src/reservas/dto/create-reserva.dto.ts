import {
  ArrayUnique,
  IsArray,
  IsDateString,
  IsInt,
  IsOptional,
  IsPositive,
} from 'class-validator';

export class CreateReservaDto {
  @IsDateString({}, { message: 'La fecha debe ser una fecha válida' })
  fecha: string;

  @IsInt({ message: 'La cantidad de personas debe ser un número entero' })
  @IsPositive({ message: 'La cantidad de personas debe ser un número positivo' })
  cantidadPersonas: number;

  @IsInt({ message: 'El id del docente debe ser un número entero' })
  @IsPositive({ message: 'El id del docente debe ser un número positivo' })
  docenteId: number;

  @IsInt({ message: 'El id del espacio debe ser un número entero' })
  @IsPositive({ message: 'El id del espacio debe ser un número positivo' })
  espacioId: number;

  @IsOptional()
  @IsArray({ message: 'Los recursos deben ser una lista de ids' })
  @ArrayUnique({ message: 'Los ids de recursos no deben repetirse' })
  @IsInt({
    each: true,
    message: 'Cada id de recurso debe ser un número entero',
  })
  @IsPositive({
    each: true,
    message: 'Cada id de recurso debe ser un número positivo',
  })
  recursoIds?: number[];
}
