import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { City } from './city.entity';

@Entity('neighborhoods')
export class Neighborhood {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'int' })
    city_id: number;

    @Column({ type: 'varchar', length: 100 })
    name_fr: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    name_ar: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    name_en: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @ManyToOne(() => City, (city) => city.neighborhoods, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'city_id' })
    city: City;
}
