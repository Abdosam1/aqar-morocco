import {
    Controller, Get, Post, Body, UseGuards, Patch, Param, ParseUUIDPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { NotificationsService } from './notifications.service';
import { CurrentUser } from '../../common/decorators';

@Controller('notifications')
@UseGuards(AuthGuard('jwt'))
export class NotificationsController {
    constructor(private notificationsService: NotificationsService) { }

    @Get()
    getMyNotifications(@CurrentUser('id') userId: string) {
        return this.notificationsService.getMyNotifications(userId);
    }

    @Patch(':id/read')
    markAsRead(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.notificationsService.markAsRead(id, userId);
    }

    @Post('read-all')
    markAllAsRead(@CurrentUser('id') userId: string) {
        return this.notificationsService.markAllAsRead(userId);
    }
}
