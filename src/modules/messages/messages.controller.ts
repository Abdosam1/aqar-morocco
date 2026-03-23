import {
    Controller, Get, Post, Body, UseGuards, Query, Patch, Param, ParseUUIDPipe
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { MessagesService } from './messages.service';
import { CurrentUser } from '../../common/decorators';

@Controller('messages')
@UseGuards(AuthGuard('jwt'))
export class MessagesController {
    constructor(private messagesService: MessagesService) { }

    @Post()
    sendMessage(
        @CurrentUser('id') userId: string,
        @Body() dto: any,
    ) {
        return this.messagesService.sendMessage(userId, dto);
    }

    @Get('conversations')
    getMyConversations(@CurrentUser('id') userId: string) {
        return this.messagesService.getMyConversations(userId);
    }

    @Get('thread/:otherUserId')
    getConversation(
        @CurrentUser('id') userId: string,
        @Param('otherUserId', ParseUUIDPipe) otherUserId: string,
        @Query('listingId') listingId?: string,
    ) {
        return this.messagesService.getConversation(userId, otherUserId, listingId);
    }

    @Patch(':id/read')
    markAsRead(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.messagesService.markAsRead(id, userId);
    }
}
