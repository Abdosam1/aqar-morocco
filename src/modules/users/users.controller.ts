import { Controller, Get, Patch, Body, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UsersService } from './users.service';
import { CurrentUser } from '../../common/decorators';

@Controller('api/users')
export class UsersController {
    constructor(private usersService: UsersService) { }

    @Get('profile')
    @UseGuards(AuthGuard('jwt'))
    getProfile(@CurrentUser('id') userId: string) {
        return this.usersService.findById(userId);
    }

    @Patch('profile')
    @UseGuards(AuthGuard('jwt'))
    updateProfile(
        @CurrentUser('id') userId: string,
        @Body() data: { full_name?: string; phone?: string; whatsapp?: string; avatar_url?: string },
    ) {
        return this.usersService.updateProfile(userId, data);
    }

    @Patch('fcm-token')
    @UseGuards(AuthGuard('jwt'))
    updateFcmToken(
        @CurrentUser('id') userId: string,
        @Body('fcm_token') fcmToken: string,
    ) {
        return this.usersService.updateFcmToken(userId, fcmToken);
    }
}
