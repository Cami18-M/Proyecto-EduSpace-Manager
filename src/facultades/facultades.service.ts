import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateFacultadDto } from './dto/create-facultad.dto.js';
import { UpdateFacultadDto } from './dto/update-facultad.dto.js';
import { Facultad } from './entities/facultad.entity.js';

@Injectable()
export class FacultadesService {
  constructor(
    @InjectRepository(Facultad)
    private readonly facultadRepository: Repository<Facultad>,
  ) {}

  async create(createFacultadDto: CreateFacultadDto): Promise<Facultad> {
    const existente = await this.facultadRepository.findOneBy({
      nombre: createFacultadDto.nombre,
    });
    if (existente) {
      throw new ConflictException('Ya existe una facultad con ese nombre');
    }

    const facultad = this.facultadRepository.create(createFacultadDto);
    return this.facultadRepository.save(facultad);
  }

  findAll(): Promise<Facultad[]> {
    return this.facultadRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Facultad> {
    const facultad = await this.facultadRepository.findOneBy({ id });
    if (!facultad) {
      throw new NotFoundException(`No se encontró la facultad con id ${id}`);
    }
    return facultad;
  }

  async update(
    id: number,
    updateFacultadDto: UpdateFacultadDto,
  ): Promise<Facultad> {
    const facultad = await this.findOne(id);

    if (
      updateFacultadDto.nombre !== undefined &&
      updateFacultadDto.nombre !== facultad.nombre
    ) {
      const existente = await this.facultadRepository.findOneBy({
        nombre: updateFacultadDto.nombre,
      });
      if (existente) {
        throw new ConflictException('Ya existe una facultad con ese nombre');
      }
    }

    Object.assign(facultad, updateFacultadDto);
    return this.facultadRepository.save(facultad);
  }

  async remove(id: number): Promise<void> {
    const facultad = await this.findOne(id);
    await this.facultadRepository.remove(facultad);
  }
}
