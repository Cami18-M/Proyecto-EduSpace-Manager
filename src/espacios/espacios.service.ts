import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Facultad } from '../facultades/entities/facultad.entity.js';
import { CreateEspacioDto } from './dto/create-espacio.dto.js';
import { UpdateEspacioDto } from './dto/update-espacio.dto.js';
import { Espacio } from './entities/espacio.entity.js';

@Injectable()
export class EspaciosService {
  constructor(
    @InjectRepository(Espacio)
    private readonly espacioRepository: Repository<Espacio>,
    @InjectRepository(Facultad)
    private readonly facultadRepository: Repository<Facultad>,
  ) {}

  async create(createEspacioDto: CreateEspacioDto): Promise<Espacio> {
    const { facultadId, ...datos } = createEspacioDto;

    const facultad = await this.facultadRepository.findOneBy({ id: facultadId });
    if (!facultad) {
      throw new NotFoundException(
        `No se encontró la facultad con id ${facultadId}`,
      );
    }

    const espacio = this.espacioRepository.create({ ...datos, facultad });
    const guardado = await this.espacioRepository.save(espacio);
    return this.findOne(guardado.id);
  }

  findAll(): Promise<Espacio[]> {
    return this.espacioRepository.find({
      relations: { facultad: true },
      order: { nombre: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Espacio> {
    const espacio = await this.espacioRepository.findOne({
      where: { id },
      relations: { facultad: true },
    });
    if (!espacio) {
      throw new NotFoundException(`No se encontró el espacio con id ${id}`);
    }
    return espacio;
  }

  async update(
    id: number,
    updateEspacioDto: UpdateEspacioDto,
  ): Promise<Espacio> {
    const espacio = await this.findOne(id);
    const { facultadId, ...datos } = updateEspacioDto;

    if (facultadId !== undefined) {
      const facultad = await this.facultadRepository.findOneBy({
        id: facultadId,
      });
      if (!facultad) {
        throw new NotFoundException(
          `No se encontró la facultad con id ${facultadId}`,
        );
      }
      espacio.facultad = facultad;
    }

    Object.assign(espacio, datos);
    return this.espacioRepository.save(espacio);
  }

  async remove(id: number): Promise<void> {
    const espacio = await this.findOne(id);
    await this.espacioRepository.remove(espacio);
  }
}
