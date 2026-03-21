import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notifRepo: Repository<Notification>,
    ) { }

    async create(userId: string, type: string, title: string, body?: string, data?: any) {
        const notif = this.notifRepo.create({ user_id: userId, type, title, body, data });
        return this.notifRepo.save(notif);
    }

    async findByUser(userId: string, page = 1, limit = 20) {
        const [data, total] = await this.notifRepo.findAndCount({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, meta: { total, page, limit, total_pages: Math.ceil(total / limit) } };
    }

    async markAsRead(id: string, userId: string) {
        await this.notifRepo.update({ id, user_id: userId }, { is_read: true });
        return { read: true };
    }

    async markAllAsRead(userId: string) {
        await this.notifRepo.update({ user_id: userId, is_read: false }, { is_read: true });
        return { read_all: true };
    }

    async getUnreadCount(userId: string) {
        const count = await this.notifRepo.count({ where: { user_id: userId, is_read: false } });
        return { unread_count: count };
    }
}
