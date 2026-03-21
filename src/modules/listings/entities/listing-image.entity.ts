import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { Listing } from './listing.entity';

@Entity('listing_images')
export class ListingImage {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    listing_id: string;

    @Column({ type: 'text' })
    image_url: string;

    @Column({ type: 'text', nullable: true })
    thumbnail_url: string;

    @Column({ type: 'boolean', default: false })
    is_primary: boolean;

    @Column({ type: 'smallint', default: 0 })
    sort_order: number;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @ManyToOne(() => Listing, (listing) => listing.images, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'listing_id' })
    listing: Listing;
}
