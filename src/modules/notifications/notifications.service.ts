import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Notification, NotificationType } from './entities/notification.entity';

@Injectable()
export class NotificationsService {
    constructor(
        @InjectRepository(Notification)
        private notificationRepo: Repository<Notification>,
    ) { }

    async create(userId: string, title: string, message: string, type: NotificationType, relatedId?: string) {
        const notification = this.notificationRepo.create({
            user_id: userId,
            title,
            message,
            type,
            related_id: relatedId,
        });
        return this.notificationRepo.save(notification);
    }

    async getMyNotifications(userId: string) {
        return this.notificationRepo.find({
            where: { user_id: userId },
            order: { created_at: 'DESC' },
            take: 20,
        });
    }

    async markAsRead(id: string, userId: string) {
        return this.notificationRepo.update({ id, user_id: userId }, { is_read: true });
    }

    async markAllAsRead(userId: string) {
        return this.notificationRepo.update({ user_id: userId }, { is_read: true });
    }
}
