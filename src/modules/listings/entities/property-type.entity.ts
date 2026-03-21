import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('property_types')
export class PropertyType {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'varchar', length: 50 })
    name_fr: string;

    @Column({ type: 'varchar', length: 50 })
    name_ar: string;

    @Column({ type: 'varchar', length: 50, nullable: true })
    name_en: string;

    @Column({ type: 'varchar', length: 50, unique: true })
    slug: string;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;
}
