import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Facultad } from '../../facultades/entities/facultad.entity.js';
import type { Reserva } from '../../reservas/entities/reserva.entity.js';

@Entity({ name: 'docentes' })
export class Docente {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'varchar', length: 150, unique: true })
  email: string;

  @ManyToOne(() => Facultad, (facultad) => facultad.docentes, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'facultad_id' })
  facultad: Facultad;

  @OneToMany('Reserva', 'docente')
  reservas: Reserva[];
}
