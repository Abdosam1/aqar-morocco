import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Message } from './entities/message.entity';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class MessagesService {
    constructor(
        @InjectRepository(Message)
        private messageRepo: Repository<Message>,
        private notificationsService: NotificationsService,
    ) { }

    async sendMessage(senderId: string, dto: any) {
        const message = await this.messageRepo.save(
            this.messageRepo.create({ ...dto, sender_id: senderId })
        );

        // Notify Receiver
        await this.notificationsService.create(
            dto.receiver_id,
            'Nouveau message',
            `Vous avez reçu un nouveau message.`,
            NotificationType.MESSAGE,
            (message as any).id
        );

        return message;
    }

    async getConversation(userId: string, otherUserId: string, listingId?: string) {
        const query = this.messageRepo.createQueryBuilder('m')
            .where('(m.sender_id = :userId AND m.receiver_id = :otherUserId) OR (m.sender_id = :otherUserId AND m.receiver_id = :userId)', { userId, otherUserId });

        if (listingId) {
            query.andWhere('m.listing_id = :listingId', { listingId });
        }

        return query.orderBy('m.created_at', 'ASC').getMany();
    }

    async getMyConversations(userId: string) {
        // Simple logic to get recent unique partners
        return this.messageRepo.createQueryBuilder('m')
            .leftJoinAndSelect('m.listing', 'l')
            .leftJoinAndSelect('m.sender', 's')
            .leftJoinAndSelect('m.receiver', 'r')
            .where('m.sender_id = :userId OR m.receiver_id = :userId', { userId })
            .select([
                'DISTINCT ON (CASE WHEN m.sender_id = :userId THEN m.receiver_id ELSE m.sender_id END) m.id',
                'm.*', 'l.*', 's.full_name', 'r.full_name'
            ])
            .setParameters({ userId })
            .orderBy('CASE WHEN m.sender_id = :userId THEN m.receiver_id ELSE m.sender_id END')
            .addOrderBy('m.created_at', 'DESC')
            .getRawMany();
        // Note: Simplification for demo, real DISTINC ON would prefer more robust query or aggregate view
    }

    async markAsRead(messageId: string, userId: string) {
        return this.messageRepo.update(
            { id: messageId, receiver_id: userId },
            { is_read: true }
        );
    }
}
