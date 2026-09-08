import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
} from '@nestjs/common';
import { CreateRecursoDto } from './dto/create-recurso.dto.js';
import { UpdateRecursoDto } from './dto/update-recurso.dto.js';
import { RecursosService } from './recursos.service.js';

@Controller('recursos')
export class RecursosController {
  constructor(private readonly recursosService: RecursosService) {}

  @Post()
  create(@Body() createRecursoDto: CreateRecursoDto) {
    return this.recursosService.create(createRecursoDto);
  }

  @Get()
  findAll() {
    return this.recursosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.recursosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateRecursoDto: UpdateRecursoDto,
  ) {
    return this.recursosService.update(id, updateRecursoDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.recursosService.remove(id);
  }
}
