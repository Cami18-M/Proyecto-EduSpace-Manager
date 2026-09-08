import { PartialType } from '@nestjs/mapped-types';
import { CreateRecursoDto } from './create-recurso.dto.js';

export class UpdateRecursoDto extends PartialType(CreateRecursoDto) {}
