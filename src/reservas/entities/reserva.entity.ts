import {
  Column,
  Entity,
  JoinColumn,
  JoinTable,
  ManyToMany,
  ManyToOne,
  PrimaryGeneratedColumn,
} from 'typeorm';
import { Docente } from '../../docentes/entities/docente.entity.js';
import { Espacio } from '../../espacios/entities/espacio.entity.js';
import { Recurso } from '../../recursos/entities/recurso.entity.js';

@Entity({ name: 'reservas' })
export class Reserva {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'date' })
  fecha: string;

  @Column({ type: 'int', unsigned: true })
  cantidadPersonas: number;

  @ManyToOne(() => Docente, (docente) => docente.reservas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'docente_id' })
  docente: Docente;

  @ManyToOne(() => Espacio, (espacio) => espacio.reservas, {
    nullable: false,
    onDelete: 'RESTRICT',
  })
  @JoinColumn({ name: 'espacio_id' })
  espacio: Espacio;

  @ManyToMany(() => Recurso)
  @JoinTable({
    name: 'reserva_recursos',
    joinColumn: { name: 'reserva_id', referencedColumnName: 'id' },
    inverseJoinColumn: { name: 'recurso_id', referencedColumnName: 'id' },
  })
  recursos: Recurso[];
}
