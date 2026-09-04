import { IsNotEmpty, IsString, MaxLength } from 'class-validator';

export class CreateFacultadDto {
  @IsString({ message: 'El nombre debe ser una cadena de texto' })
  @IsNotEmpty({ message: 'El nombre es obligatorio' })
  @MaxLength(100, { message: 'El nombre no debe superar los 100 caracteres' })
  nombre: string;
}
