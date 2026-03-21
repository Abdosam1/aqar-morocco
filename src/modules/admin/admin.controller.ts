import {
    Controller, Get, Patch, Param, Body, Query,
    UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { AdminService } from './admin.service';
import { Roles } from '../../common/decorators';
import { CurrentUser } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { UserRole, ReportStatus } from '../../shared/enums';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RolesGuard)
@Roles(UserRole.ADMIN)
export class AdminController {
    constructor(private adminService: AdminService) { }

    @Get('stats')
    getStats() {
        return this.adminService.getStats();
    }

    @Get('listings/pending')
    getPendingListings(
        @Query('page') page = 1,
        @Query('limit') limit = 20,
    ) {
        return this.adminService.getPendingListings(+page, +limit);
    }

    @Patch('listings/:id/approve')
    approve(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') adminId: string,
    ) {
        return this.adminService.approveListing(id, adminId);
    }

    @Patch('listings/:id/reject')
    reject(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') adminId: string,
        @Body('reason') reason: string,
    ) {
        return this.adminService.rejectListing(id, adminId, reason);
    }

    @Get('reports')
    getReports(
        @Query('page') page = 1,
        @Query('limit') limit = 20,
    ) {
        return this.adminService.getReports(+page, +limit);
    }

    @Patch('reports/:id')
    updateReportStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') adminId: string,
        @Body('status') status: ReportStatus,
    ) {
        return this.adminService.updateReportStatus(id, adminId, status);
    }

    @Get('users')
    getUsers(
        @Query('page') page = 1,
        @Query('limit') limit = 20,
    ) {
        return this.adminService.getUsers(+page, +limit);
    }

    @Patch('users/:id/ban')
    banUser(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') adminId: string,
    ) {
        return this.adminService.banUser(id, adminId);
    }

    @Patch('users/:id/unban')
    unbanUser(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') adminId: string,
    ) {
        return this.adminService.unbanUser(id, adminId);
    }
}
