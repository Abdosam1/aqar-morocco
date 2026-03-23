import {
    Controller, Get, Post, Put, Patch,
    Param, Body, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { VisitsService } from './visits.service';
import { CurrentUser } from '../../common/decorators';
import { VisitStatus } from '../../shared/enums';

@Controller('visits')
@UseGuards(AuthGuard('jwt'))
export class VisitsController {
    constructor(private visitsService: VisitsService) { }

    @Post()
    create(
        @CurrentUser('id') userId: string,
        @Body() dto: any,
    ) {
        return this.visitsService.create(userId, dto);
    }

    @Get('my-requests')
    findMyRequests(@CurrentUser('id') userId: string) {
        return this.visitsService.findMyRequests(userId);
    }

    @Get('owner-visits')
    findOwnerVisits(@CurrentUser('id') userId: string) {
        return this.visitsService.findOwnerVisits(userId);
    }

    @Patch(':id/status')
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @Body('status') status: VisitStatus,
    ) {
        return this.visitsService.updateStatus(id, userId, status);
    }
}
