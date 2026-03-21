import { Controller, Get, Post, Delete, Param, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { FavoritesService } from './favorites.service';
import { CurrentUser } from '../../common/decorators';

@Controller('favorites')
@UseGuards(AuthGuard('jwt'))
export class FavoritesController {
    constructor(private favService: FavoritesService) { }

    @Get()
    findAll(@CurrentUser('id') userId: string) {
        return this.favService.findByUser(userId);
    }

    @Post(':listingId')
    add(
        @CurrentUser('id') userId: string,
        @Param('listingId', ParseUUIDPipe) listingId: string,
    ) {
        return this.favService.add(userId, listingId);
    }

    @Delete(':listingId')
    remove(
        @CurrentUser('id') userId: string,
        @Param('listingId', ParseUUIDPipe) listingId: string,
    ) {
        return this.favService.remove(userId, listingId);
    }
}
