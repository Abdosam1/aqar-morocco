import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    OneToMany,
} from 'typeorm';
import { Neighborhood } from './neighborhood.entity';

@Entity('cities')
export class City {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 100, unique: true })
    name_fr: string;

    @Column({ type: 'varchar', length: 100 })
    name_ar: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    name_en: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    region: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @OneToMany(() => Neighborhood, (n) => n.city)
    neighborhoods: Neighborhood[];
}
