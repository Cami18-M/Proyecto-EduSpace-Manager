import { PartialType } from '@nestjs/mapped-types';
import { CreateEspacioDto } from './create-espacio.dto.js';

export class UpdateEspacioDto extends PartialType(CreateEspacioDto) {}
