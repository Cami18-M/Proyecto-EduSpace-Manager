import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facultad } from '../facultades/entities/facultad.entity.js';
import { CreateDocenteDto } from './dto/create-docente.dto.js';
import { UpdateDocenteDto } from './dto/update-docente.dto.js';
import { Docente } from './entities/docente.entity.js';

@Injectable()
export class DocentesService {
  constructor(
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
    @InjectRepository(Facultad)
    private readonly facultadRepository: Repository<Facultad>,
  ) {}

  async create(createDocenteDto: CreateDocenteDto): Promise<Docente> {
    const { facultadId, ...datos } = createDocenteDto;

    const facultad = await this.facultadRepository.findOneBy({ id: facultadId });
    if (!facultad) {
      throw new NotFoundException(
        `No se encontró la facultad con id ${facultadId}`,
      );
    }

    const existente = await this.docenteRepository.findOneBy({
      email: datos.email,
    });
    if (existente) {
      throw new ConflictException('Ya existe un docente con ese correo');
    }

    const docente = this.docenteRepository.create({ ...datos, facultad });
    const guardado = await this.docenteRepository.save(docente);
    return this.findOne(guardado.id);
  }

  findAll(): Promise<Docente[]> {
    return this.docenteRepository.find({
      relations: { facultad: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Docente> {
    const docente = await this.docenteRepository.findOne({
      where: { id },
      relations: { facultad: true },
    });
    if (!docente) {
      throw new NotFoundException(`No se encontró el docente con id ${id}`);
    }
    return docente;
  }

  async update(
    id: number,
    updateDocenteDto: UpdateDocenteDto,
  ): Promise<Docente> {
    const docente = await this.findOne(id);
    const { facultadId, ...datos } = updateDocenteDto;

    if (datos.email !== undefined && datos.email !== docente.email) {
      const existente = await this.docenteRepository.findOneBy({
        email: datos.email,
      });
      if (existente) {
        throw new ConflictException('Ya existe un docente con ese correo');
      }
    }

    if (facultadId !== undefined) {
      const facultad = await this.facultadRepository.findOneBy({
        id: facultadId,
      });
      if (!facultad) {
        throw new NotFoundException(
          `No se encontró la facultad con id ${facultadId}`,
        );
      }
      docente.facultad = facultad;
    }

    Object.assign(docente, datos);
    return this.docenteRepository.save(docente);
  }

  async remove(id: number): Promise<void> {
    const docente = await this.findOne(id);
    await this.docenteRepository.remove(docente);
  }
}
