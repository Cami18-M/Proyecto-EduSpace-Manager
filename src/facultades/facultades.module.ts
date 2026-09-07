import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Facultad } from './entities/facultad.entity.js';
import { FacultadesController } from './facultades.controller.js';
import { FacultadesService } from './facultades.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Facultad])],
  controllers: [FacultadesController],
  providers: [FacultadesService],
})
export class FacultadesModule {}
