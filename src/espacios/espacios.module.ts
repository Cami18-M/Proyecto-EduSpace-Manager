import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facultad } from '../facultades/entities/facultad.entity.js';
import { EspaciosController } from './espacios.controller.js';
import { EspaciosService } from './espacios.service.js';
import { Espacio } from './entities/espacio.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Espacio, Facultad])],
  controllers: [EspaciosController],
  providers: [EspaciosService],
})
export class EspaciosModule {}
