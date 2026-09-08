import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateRecursoDto } from './dto/create-recurso.dto.js';
import { UpdateRecursoDto } from './dto/update-recurso.dto.js';
import { Recurso } from './entities/recurso.entity.js';

@Injectable()
export class RecursosService {
  constructor(
    @InjectRepository(Recurso)
    private readonly recursoRepository: Repository<Recurso>,
  ) {}

  async create(createRecursoDto: CreateRecursoDto): Promise<Recurso> {
    const existente = await this.recursoRepository.findOneBy({
      nombre: createRecursoDto.nombre,
    });
    if (existente) {
      throw new ConflictException('Ya existe un recurso con ese nombre');
    }

    const recurso = this.recursoRepository.create(createRecursoDto);
    return this.recursoRepository.save(recurso);
  }

  findAll(): Promise<Recurso[]> {
    return this.recursoRepository.find({ order: { nombre: 'ASC' } });
  }

  async findOne(id: number): Promise<Recurso> {
    const recurso = await this.recursoRepository.findOneBy({ id });
    if (!recurso) {
      throw new NotFoundException(`No se encontró el recurso con id ${id}`);
    }
    return recurso;
  }

  async update(
    id: number,
    updateRecursoDto: UpdateRecursoDto,
  ): Promise<Recurso> {
    const recurso = await this.findOne(id);

    if (
      updateRecursoDto.nombre !== undefined &&
      updateRecursoDto.nombre !== recurso.nombre
    ) {
      const existente = await this.recursoRepository.findOneBy({
        nombre: updateRecursoDto.nombre,
      });
      if (existente) {
        throw new ConflictException('Ya existe un recurso con ese nombre');
      }
    }

    Object.assign(recurso, updateRecursoDto);
    return this.recursoRepository.save(recurso);
  }

  async remove(id: number): Promise<void> {
    const recurso = await this.findOne(id);
    await this.recursoRepository.remove(recurso);
  }
}
