import { Controller, Post, Body, UseGuards, Param, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ReportsService } from './reports.service';
import { CurrentUser } from '../../common/decorators';
import { ReportReason } from '../../shared/enums';

@Controller('api/reports')
@UseGuards(AuthGuard('jwt'))
export class ReportsController {
    constructor(private reportsService: ReportsService) { }

    @Post()
    create(
        @CurrentUser('id') userId: string,
        @Body() body: { listing_id: string; reason: ReportReason; details?: string },
    ) {
        return this.reportsService.create(userId, body.listing_id, body.reason, body.details);
    }
}
