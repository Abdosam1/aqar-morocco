import {
    Controller, Get, Post, Put, Delete, Patch,
    Param, Body, Query, UseGuards, ParseUUIDPipe,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { ListingsService } from './listings.service';
import { CreateListingDto } from './dto/create-listing.dto';
import { FilterListingDto } from './dto/filter-listing.dto';
import { CurrentUser } from '../../common/decorators';
import { Roles } from '../../common/decorators';
import { RolesGuard } from '../../common/guards';
import { UserRole, ListingStatus } from '../../shared/enums';

@Controller('api/listings')
export class ListingsController {
    constructor(private listingsService: ListingsService) { }

    @Get()
    findAll(@Query() filters: FilterListingDto) {
        return this.listingsService.findAll(filters);
    }

    @Get('property-types')
    getPropertyTypes() {
        return this.listingsService.getPropertyTypes();
    }

    @Get('my')
    @UseGuards(AuthGuard('jwt'))
    findMyListings(@CurrentUser('id') userId: string) {
        return this.listingsService.findMyListings(userId);
    }

    @Get(':id')
    findById(@Param('id', ParseUUIDPipe) id: string) {
        return this.listingsService.findById(id);
    }

    @Post()
    @UseGuards(AuthGuard('jwt'), RolesGuard)
    @Roles(UserRole.OWNER, UserRole.ADMIN)
    create(
        @CurrentUser('id') userId: string,
        @Body() dto: CreateListingDto,
    ) {
        return this.listingsService.create(userId, dto);
    }

    @Put(':id')
    @UseGuards(AuthGuard('jwt'))
    update(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @Body() dto: Partial<CreateListingDto>,
    ) {
        return this.listingsService.update(id, userId, dto);
    }

    @Delete(':id')
    @UseGuards(AuthGuard('jwt'))
    remove(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.listingsService.remove(id, userId);
    }

    @Patch(':id/status')
    @UseGuards(AuthGuard('jwt'))
    updateStatus(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @Body('status') status: ListingStatus,
    ) {
        return this.listingsService.updateStatus(id, userId, status);
    }

    @Post(':id/images')
    @UseGuards(AuthGuard('jwt'))
    addImages(
        @Param('id', ParseUUIDPipe) id: string,
        @CurrentUser('id') userId: string,
        @Body('images') images: { image_url: string; thumbnail_url?: string }[],
    ) {
        return this.listingsService.addImages(id, userId, images);
    }

    @Delete('images/:imageId')
    @UseGuards(AuthGuard('jwt'))
    removeImage(
        @Param('imageId', ParseUUIDPipe) imageId: string,
        @CurrentUser('id') userId: string,
    ) {
        return this.listingsService.removeImage(imageId, userId);
    }
}
