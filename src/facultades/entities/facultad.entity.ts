import { Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';
import type { Docente } from '../../docentes/entities/docente.entity.js';
import type { Espacio } from '../../espacios/entities/espacio.entity.js';

@Entity({ name: 'facultades' })
export class Facultad {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;

  @OneToMany('Docente', 'facultad')
  docentes: Docente[];

  @OneToMany('Espacio', 'facultad')
  espacios: Espacio[];
}
