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
import { ReportReason, ReportStatus } from '../../../shared/enums';

@Entity('reports')
export class Report {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    listing_id: string;

    @Column({ type: 'uuid' })
    reporter_id: string;

    @Column({ type: 'enum', enum: ReportReason })
    reason: ReportReason;

    @Column({ type: 'text', nullable: true })
    details: string;

    @Column({ type: 'enum', enum: ReportStatus, default: ReportStatus.PENDING })
    status: ReportStatus;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @ManyToOne('Listing')
    @JoinColumn({ name: 'listing_id' })
    listing: Listing;

    @ManyToOne('User')
    @JoinColumn({ name: 'reporter_id' })
    reporter: User;
}
