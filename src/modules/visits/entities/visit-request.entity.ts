import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Listing } from '../../listings/entities/listing.entity';
import { VisitStatus } from '../../../shared/enums';

@Entity('visit_requests')
export class VisitRequest {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @ManyToOne(() => Listing)
    @JoinColumn({ name: 'listing_id' })
    listing: Listing;

    @Column({ name: 'listing_id' })
    listing_id: string;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'user_id' })
    user: User;

    @Column({ name: 'user_id' })
    user_id: string;

    @Column({ type: 'date' })
    preferred_date: Date;

    @Column({ type: 'varchar', length: 50 })
    preferred_time: string;

    @Column({ type: 'varchar', length: 100 })
    name: string;

    @Column({ type: 'varchar', length: 20 })
    phone: string;

    @Column({ type: 'text', nullable: true })
    message: string;

    @Column({ type: 'enum', enum: VisitStatus, default: VisitStatus.PENDING })
    status: VisitStatus;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;
}
