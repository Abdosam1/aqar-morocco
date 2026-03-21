import { Controller, Get, Patch, Param, Query, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators';

@Controller('api/notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
    constructor(private notifService: NotificationsService) { }

    @Get()
    findAll(
        @CurrentUser('id') userId: string,
        @Query('page') page = 1,
        @Query('limit') limit = 20,
    ) {
        return this.notifService.findByUser(userId, +page, +limit);
    }

    @Get('unread-count')
    getUnreadCount(@CurrentUser('id') userId: string) {
        return this.notifService.getUnreadCount(userId);
    }

    @Patch(':id/read')
    markAsRead(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.notifService.markAsRead(id, userId);
    }

    @Patch('read-all')
    markAllAsRead(@CurrentUser('id') userId: string) {
        return this.notifService.markAllAsRead(userId);
    }
}
