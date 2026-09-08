import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';

@Entity({ name: 'recursos' })
export class Recurso {
  @PrimaryGeneratedColumn({ type: 'int', unsigned: true })
  id: number;

  @Column({ type: 'varchar', length: 100, unique: true })
  nombre: string;
}
