import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facultad } from '../facultades/entities/facultad.entity.js';
import { DocentesController } from './docentes.controller.js';
import { DocentesService } from './docentes.service.js';
import { Docente } from './entities/docente.entity.js';

@Module({
  imports: [TypeOrmModule.forFeature([Docente, Facultad])],
  controllers: [DocentesController],
  providers: [DocentesService],
})
export class DocentesModule {}
