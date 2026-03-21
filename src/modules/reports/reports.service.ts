import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Report } from './entities/report.entity';
import { ReportReason, ReportStatus } from '../../shared/enums';

@Injectable()
export class ReportsService {
    constructor(
        @InjectRepository(Report)
        private reportRepo: Repository<Report>,
    ) { }

    async create(reporterId: string, listingId: string, reason: ReportReason, details?: string) {
        const report = this.reportRepo.create({
            reporter_id: reporterId,
            listing_id: listingId,
            reason,
            details,
        });
        return this.reportRepo.save(report);
    }

    async findAll(page = 1, limit = 20) {
        const [data, total] = await this.reportRepo.findAndCount({
            relations: ['listing', 'reporter'],
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, meta: { total, page, limit, total_pages: Math.ceil(total / limit) } };
    }

    async updateStatus(id: string, status: ReportStatus) {
        await this.reportRepo.update(id, { status });
        return this.reportRepo.findOne({ where: { id }, relations: ['listing', 'reporter'] });
    }
}
