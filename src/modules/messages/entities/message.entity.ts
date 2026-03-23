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

@Entity('messages')
export class Message {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: true })
    conversation_id: string;

    @ManyToOne(() => Listing, { nullable: true })
    @JoinColumn({ name: 'listing_id' })
    listing: Listing;

    @Column({ name: 'listing_id', nullable: true })
    listing_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'sender_id' })
    sender: User;

    @Column({ name: 'sender_id' })
    sender_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'receiver_id' })
    receiver: User;

    @Column({ name: 'receiver_id' })
    receiver_id: string;

    @Column({ type: 'text' })
    content: string;

    @Column({ default: false })
    is_read: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;
}
