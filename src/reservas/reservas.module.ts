import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Docente } from '../docentes/entities/docente.entity.js';
import { Espacio } from '../espacios/entities/espacio.entity.js';
import { Recurso } from '../recursos/entities/recurso.entity.js';
import { Reserva } from './entities/reserva.entity.js';
import { ReservasController } from './reservas.controller.js';
import { ReservasService } from './reservas.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Reserva, Docente, Espacio, Recurso])],
  controllers: [ReservasController],
  providers: [ReservasService],
})
export class ReservasModule {}
