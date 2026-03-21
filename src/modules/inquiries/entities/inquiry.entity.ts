import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';
import { ContactMethod } from '../../../shared/enums';

@Entity('inquiries')
export class Inquiry {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    listing_id: string;

    @Column({ type: 'uuid' })
    sender_id: string;

    @Column({ type: 'uuid' })
    owner_id: string;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({ type: 'enum', enum: ContactMethod })
    contact_method: ContactMethod;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @ManyToOne('Listing')
    @JoinColumn({ name: 'listing_id' })
    listing: Listing;

    @ManyToOne('User')
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @ManyToOne('User')
    @JoinColumn({ name: 'owner_id' })
    owner: User;
}
