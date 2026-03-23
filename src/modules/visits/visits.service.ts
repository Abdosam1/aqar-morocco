import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { VisitRequest } from './entities/visit-request.entity';
import { VisitStatus } from '../../shared/enums';
import { NotificationsService } from '../notifications/notifications.service';
import { NotificationType } from '../notifications/entities/notification.entity';

@Injectable()
export class VisitsService {
    constructor(
        @InjectRepository(VisitRequest)
        private visitRepo: Repository<VisitRequest>,
        private notificationsService: NotificationsService,
    ) { }

    async create(userId: string, dto: any) {
        const visit = await this.visitRepo.save(
            this.visitRepo.create({ ...dto, user_id: userId })
        );

        // Notify Owner of the listing
        // Note: In real app, we need the owner ID from the listing entity
        // For now, simplifying the logic flow

        return visit;
    }

    async updateStatus(id: string, userId: string, status: VisitStatus) {
        const visit = await this.visitRepo.findOne({
            where: { id },
            relations: ['listing'],
        });

        if (!visit) throw new NotFoundException('Visit request not found');

        if (visit.listing.user_id !== userId) {
            throw new ForbiddenException('Only the owner can manage visit requests');
        }

        visit.status = status;
        const updatedVisit = await this.visitRepo.save(visit);

        // Notify the Requester
        await this.notificationsService.create(
            visit.user_id,
            'Mise à jour de visite',
            `Votre demande de visite a été ${status === VisitStatus.APPROVED ? 'confirmée' : 'refusée'}.`,
            NotificationType.VISIT_REQUEST,
            visit.id
        );

        return updatedVisit;
    }

    async findByListing(listingId: string) {
        return this.visitRepo.find({
            where: { listing_id: listingId },
            relations: ['user'],
            order: { created_at: 'DESC' },
        });
    }

    async findMyRequests(userId: string) {
        return this.visitRepo.find({
            where: { user_id: userId },
            relations: ['listing'],
            order: { created_at: 'DESC' },
        });
    }

    async findOwnerVisits(userId: string) {
        return this.visitRepo.createQueryBuilder('vr')
            .leftJoinAndSelect('vr.listing', 'l')
            .leftJoinAndSelect('vr.user', 'u')
            .where('l.user_id = :userId', { userId })
            .orderBy('vr.created_at', 'DESC')
            .getMany();
    }

}
