import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Facultad } from '../../facultades/entities/facultad.entity.js';

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
}
