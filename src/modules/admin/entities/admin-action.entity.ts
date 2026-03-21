import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity('admin_actions')
export class AdminAction {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'uuid' })
    admin_id: string;

    @Column({ type: 'varchar', length: 50 })
    action_type: string;

    @Column({ type: 'varchar', length: 50 })
    target_type: string;

    @Column({ type: 'uuid' })
    target_id: string;

    @Column({ type: 'text', nullable: true })
    reason: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @ManyToOne(() => User)
    @JoinColumn({ name: 'admin_id' })
    admin: User;
}
