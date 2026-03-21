import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('notifications')
export class Notification {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    user_id: string;

    @Column({ type: 'varchar', length: 50 })
    type: string;

    @Column({ type: 'varchar', length: 200 })
    title: string;

    @Column({ type: 'text', nullable: true })
    body: string;

    @Column({ type: 'jsonb', nullable: true })
    data: any;

    @Column({ type: 'boolean', default: false })
    is_read: boolean;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @ManyToOne('User', 'notifications', { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'user_id' })
    user: User;
}
