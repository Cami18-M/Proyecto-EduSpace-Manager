import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Recurso } from './entities/recurso.entity.js';
import { RecursosController } from './recursos.controller.js';
import { RecursosService } from './recursos.service.js';

@Module({
  imports: [TypeOrmModule.forFeature([Recurso])],
  controllers: [RecursosController],
  providers: [RecursosService],
})
export class RecursosModule {}
