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
import { CreateEspacioDto } from './dto/create-espacio.dto.js';
import { UpdateEspacioDto } from './dto/update-espacio.dto.js';
import { EspaciosService } from './espacios.service.js';

@Controller('espacios')
export class EspaciosController {
  constructor(private readonly espaciosService: EspaciosService) {}

  @Post()
  create(@Body() createEspacioDto: CreateEspacioDto) {
    return this.espaciosService.create(createEspacioDto);
  }

  @Get()
  findAll() {
    return this.espaciosService.findAll();
  }

  @Get(':id')
  findOne(@Param('id', ParseIntPipe) id: number) {
    return this.espaciosService.findOne(id);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateEspacioDto: UpdateEspacioDto,
  ) {
    return this.espaciosService.update(id, updateEspacioDto);
  }

  @Delete(':id')
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.espaciosService.remove(id);
  }
}
