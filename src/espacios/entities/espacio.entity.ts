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

@Entity({ name: 'espacios' })
export class Espacio {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100 })
  nombre: string;

  @Column({ type: 'int', unsigned: true })
  capacidad: number;

  @ManyToOne(() => Facultad, (facultad) => facultad.espacios, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'facultad_id' })
  facultad: Facultad;

  @OneToMany('Reserva', 'espacio')
  reservas: Reserva[];
}
