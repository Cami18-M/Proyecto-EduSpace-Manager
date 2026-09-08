import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Docente } from '../docentes/entities/docente.entity.js';
import { Espacio } from '../espacios/entities/espacio.entity.js';
import { Recurso } from '../recursos/entities/recurso.entity.js';
import { CreateReservaDto } from './dto/create-reserva.dto.js';
import { UpdateReservaDto } from './dto/update-reserva.dto.js';
import { Reserva } from './entities/reserva.entity.js';

@Injectable()
export class ReservasService {
  constructor(
    @InjectRepository(Reserva)
    private readonly reservaRepository: Repository<Reserva>,
    @InjectRepository(Docente)
    private readonly docenteRepository: Repository<Docente>,
    @InjectRepository(Espacio)
    private readonly espacioRepository: Repository<Espacio>,
    @InjectRepository(Recurso)
    private readonly recursoRepository: Repository<Recurso>,
  ) {}

  async create(createReservaDto: CreateReservaDto): Promise<Reserva> {
    const { docenteId, espacioId, recursoIds, ...datos } = createReservaDto;

    const docente = await this.docenteRepository.findOneBy({ id: docenteId });
    if (!docente) {
      throw new NotFoundException(`No se encontró el docente con id ${docenteId}`);
    }

    const espacio = await this.espacioRepository.findOneBy({ id: espacioId });
    if (!espacio) {
      throw new NotFoundException(`No se encontró el espacio con id ${espacioId}`);
    }

    this.validarCapacidad(espacio, datos.cantidadPersonas);

    const recursos = await this.findRecursosByIds(recursoIds ?? []);

    const reserva = this.reservaRepository.create({
      ...datos,
      docente,
      espacio,
      recursos,
    });
    const guardado = await this.reservaRepository.save(reserva);
    return this.findOne(guardado.id);
  }

  findAll(): Promise<Reserva[]> {
    return this.reservaRepository.find({
      relations: {
        docente: { facultad: true },
        espacio: { facultad: true },
        recursos: true,
      },
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Reserva> {
    const reserva = await this.reservaRepository.findOne({
      where: { id },
      relations: {
        docente: { facultad: true },
        espacio: { facultad: true },
        recursos: true,
      },
    });
    if (!reserva) {
      throw new NotFoundException(`No se encontró la reserva con id ${id}`);
    }
    return reserva;
  }

  async update(
    id: number,
    updateReservaDto: UpdateReservaDto,
  ): Promise<Reserva> {
    const reserva = await this.findOne(id);
    const { docenteId, espacioId, recursoIds, ...datos } = updateReservaDto;

    if (docenteId !== undefined) {
      const docente = await this.docenteRepository.findOneBy({ id: docenteId });
      if (!docente) {
        throw new NotFoundException(
          `No se encontró el docente con id ${docenteId}`,
        );
      }
      reserva.docente = docente;
    }

    if (espacioId !== undefined) {
      const espacio = await this.espacioRepository.findOneBy({ id: espacioId });
      if (!espacio) {
        throw new NotFoundException(
          `No se encontró el espacio con id ${espacioId}`,
        );
      }
      reserva.espacio = espacio;
    }

    const cantidadPersonas = datos.cantidadPersonas ?? reserva.cantidadPersonas;
    this.validarCapacidad(reserva.espacio, cantidadPersonas);

    if (recursoIds !== undefined) {
      reserva.recursos = await this.findRecursosByIds(recursoIds);
    }

    Object.assign(reserva, datos);
    return this.reservaRepository.save(reserva);
  }

  async remove(id: number): Promise<void> {
    await this.findOne(id);
    await this.reservaRepository.delete(id);
  }

  private validarCapacidad(espacio: Espacio, cantidadPersonas: number): void {
    if (cantidadPersonas > espacio.capacidad) {
      throw new BadRequestException(
        `La cantidad de personas (${cantidadPersonas}) supera la capacidad máxima del espacio (${espacio.capacidad})`,
      );
    }
  }

  private async findRecursosByIds(ids: number[]): Promise<Recurso[]> {
    if (ids.length === 0) {
      return [];
    }

    const recursos = await this.recursoRepository.findBy({ id: In(ids) });
    if (recursos.length !== ids.length) {
      const encontrados = new Set(recursos.map((recurso) => recurso.id));
      const faltantes = ids.filter((id) => !encontrados.has(id));
      throw new NotFoundException(
        `No se encontraron los recursos con id ${faltantes.join(', ')}`,
      );
    }

    return recursos;
  }
}
