import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from '../listings/entities/listing.entity';
import { AdminAction } from './entities/admin-action.entity';
import { User } from '../users/entities/user.entity';
import { Report } from '../reports/entities/report.entity';
import { ListingStatus, ReportStatus } from '../../shared/enums';

@Injectable()
export class AdminService {
    constructor(
        @InjectRepository(Listing)
        private listingRepo: Repository<Listing>,
        @InjectRepository(AdminAction)
        private actionRepo: Repository<AdminAction>,
        @InjectRepository(User)
        private userRepo: Repository<User>,
        @InjectRepository(Report)
        private reportRepo: Repository<Report>,
    ) { }

    async getPendingListings(page = 1, limit = 20) {
        const [data, total] = await this.listingRepo.findAndCount({
            where: { status: ListingStatus.PENDING },
            relations: ['city', 'property_type', 'images', 'user'],
            order: { created_at: 'ASC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, meta: { total, page, limit, total_pages: Math.ceil(total / limit) } };
    }

    async approveListing(listingId: string, adminId: string) {
        const listing = await this.listingRepo.findOne({ where: { id: listingId } });
        if (!listing) throw new NotFoundException('Listing not found');

        await this.listingRepo.update(listingId, { status: ListingStatus.APPROVED });
        await this.logAction(adminId, 'approve_listing', 'listing', listingId);
        return { message: 'Listing approved', listing_id: listingId };
    }

    async rejectListing(listingId: string, adminId: string, reason: string) {
        const listing = await this.listingRepo.findOne({ where: { id: listingId } });
        if (!listing) throw new NotFoundException('Listing not found');

        await this.listingRepo.update(listingId, {
            status: ListingStatus.REJECTED,
            rejection_reason: reason,
        });
        await this.logAction(adminId, 'reject_listing', 'listing', listingId, reason);
        return { message: 'Listing rejected', listing_id: listingId };
    }

    async getReports(page = 1, limit = 20) {
        const [data, total] = await this.reportRepo.findAndCount({
            relations: ['listing', 'reporter'],
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, meta: { total, page, limit, total_pages: Math.ceil(total / limit) } };
    }

    async updateReportStatus(reportId: string, adminId: string, status: ReportStatus) {
        await this.reportRepo.update(reportId, { status });
        await this.logAction(adminId, 'update_report', 'report', reportId);
        return this.reportRepo.findOne({ where: { id: reportId } });
    }

    async getUsers(page = 1, limit = 20) {
        const [data, total] = await this.userRepo.findAndCount({
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, meta: { total, page, limit, total_pages: Math.ceil(total / limit) } };
    }

    async banUser(userId: string, adminId: string) {
        await this.userRepo.update(userId, { is_active: false });
        await this.logAction(adminId, 'ban_user', 'user', userId);
        return { message: 'User banned', user_id: userId };
    }

    async unbanUser(userId: string, adminId: string) {
        await this.userRepo.update(userId, { is_active: true });
        await this.logAction(adminId, 'unban_user', 'user', userId);
        return { message: 'User unbanned', user_id: userId };
    }

    async verifyUser(userId: string, adminId: string) {
        await this.userRepo.update(userId, { is_verified: true });
        await this.logAction(adminId, 'verify_user', 'user', userId);
        return { message: 'User verified', user_id: userId };
    }

    async getStats() {
        const totalUsers = await this.userRepo.count();
        const totalListings = await this.listingRepo.count();
        const pendingListings = await this.listingRepo.count({ where: { status: ListingStatus.PENDING } });
        const approvedListings = await this.listingRepo.count({ where: { status: ListingStatus.APPROVED } });
        const openReports = await this.reportRepo.count({ where: { status: ReportStatus.PENDING } });
        return { totalUsers, totalListings, pendingListings, approvedListings, openReports };
    }

    private async logAction(
        adminId: string, actionType: string, targetType: string,
        targetId: string, reason?: string,
    ) {
        const action = this.actionRepo.create({
            admin_id: adminId,
            action_type: actionType,
            target_type: targetType,
            target_id: targetId,
            reason,
        });
        return this.actionRepo.save(action);
    }
}
