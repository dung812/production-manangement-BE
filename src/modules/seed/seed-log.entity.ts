import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, Unique } from 'typeorm';

@Entity({ name: 'seed_log' })
@Unique(['name'])
export class SeedLog {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string; // e.g., 'products-initialized'

  @CreateDateColumn({ type: 'timestamptz' })
  createdAt: Date;
}
