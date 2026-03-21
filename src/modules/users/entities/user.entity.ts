import {
    Entity,
    PrimaryGeneratedColumn,
    Column,
    CreateDateColumn,
    UpdateDateColumn,
    OneToMany,
    ManyToOne,
    JoinColumn,
} from 'typeorm';
import { UserRole } from '../../../shared/enums';
import { Listing } from '../../listings/entities/listing.entity';
import { Favorite } from '../../favorites/entities/favorite.entity';
import { Notification as NotificationEntity } from '../../notifications/entities/notification.entity';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ type: 'varchar', length: 255, unique: true })
    email: string;

    @Column({ type: 'varchar', length: 255, select: false })
    password_hash: string;

    @Column({ type: 'varchar', length: 100 })
    full_name: string;

    @Column({ type: 'varchar', length: 20 })
    phone: string;

    @Column({ type: 'varchar', length: 20, nullable: true })
    whatsapp: string;

    @Column({ type: 'enum', enum: UserRole, default: UserRole.USER })
    role: UserRole;

    @Column({ type: 'text', nullable: true })
    avatar_url: string;

    @Column({ type: 'int', nullable: true })
    city_id: number;

    @Column({ type: 'boolean', default: true })
    is_active: boolean;

    @Column({ type: 'boolean', default: false })
    is_verified: boolean;

    @Column({ type: 'varchar', length: 255, nullable: true })
    fcm_token: string;

    @CreateDateColumn({ type: 'timestamptz' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamptz' })
    updated_at: Date;

    @OneToMany('Listing', 'user')
    listings: Listing[];

    @OneToMany('Favorite', 'user')
    favorites: Favorite[];

    @OneToMany('Notification', 'user')
    notifications: NotificationEntity[];
}
