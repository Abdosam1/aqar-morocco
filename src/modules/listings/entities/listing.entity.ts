import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    OneToMany,
    JoinColumn,
} from 'typeorm';
import { ListingType, ListingStatus } from '../../../shared/enums';
import { User } from '../../users/entities/user.entity';
import { City } from '../../cities/entities/city.entity';
import { Neighborhood } from '../../cities/entities/neighborhood.entity';
import { PropertyType } from './property-type.entity';
import { ListingImage } from './listing-image.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';

@Entity('listings')
export class Listing {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'int' })
    property_type_id: number;

    @Column({ type: 'enum', enum: ListingType })
    listing_type: ListingType;

    @Column({ type: 'varchar', length: 200 })
    title: string;

    @Column({ type: 'text' })
    description: string;

    @Column({ type: 'decimal', precision: 12, scale: 2 })
    price: number;

    @Column({ type: 'varchar', length: 3, default: 'MAD' })
    currency: string;

    @Column({ type: 'int' })
    city_id: number;

    @Column({ type: 'int', nullable: true })
    neighborhood_id: number;

    @Column({ type: 'text', nullable: true })
    address: string;

    @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
    latitude: number;

    @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
    longitude: number;

    @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
    area_m2: number;

    @Column({ type: 'smallint', nullable: true })
    bedrooms: number;

    @Column({ type: 'smallint', nullable: true })
    bathrooms: number;

    @Column({ type: 'boolean', default: false })
    is_furnished: boolean;

    @Column({ type: 'boolean', default: false })
    has_parking: boolean;

    @Column({ type: 'smallint', nullable: true })
    floor: number;

    @Column({ type: 'varchar', length: 20 })
    phone_contact: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    whatsapp_contact: string;

    @Column({ type: 'enum', enum: ListingStatus, default: ListingStatus.DRAFT })
    status: ListingStatus;

    @Column({ type: 'text', nullable: true })
    rejection_reason: string;

    @Column({ type: 'varchar', length: 100, nullable: true })
    commercial_type: string;

    @Column({ type: 'boolean', nullable: true })
    has_storefront: boolean;

    @Column({ type: 'int', default: 0 })
    views_count: number;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    // Relations
    @ManyToOne('User', 'listings', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;

    @ManyToOne(() => PropertyType)
    @JoinColumn({ name: 'property_type_id' })
    property_type: PropertyType;

    @ManyToOne(() => City)
    @JoinColumn({ name: 'city_id' })
    city: City;

    @ManyToOne(() => Neighborhood)
    @JoinColumn({ name: 'neighborhood_id' })
    neighborhood: Neighborhood;

    @OneToMany('ListingImage', 'listing', { cascade: true })
    images: ListingImage[];

    @OneToMany('Favorite', 'listing')
    favorites: Favorite[];
}
