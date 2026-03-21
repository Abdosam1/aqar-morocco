import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from './entities/listing.entity';
import { ListingImage } from './entities/listing-image.entity';
import { PropertyType } from './entities/property-type.entity';
import { ListingsService } from './listings.service';
import { ListingsController } from './listings.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Listing, ListingImage, PropertyType])],
    controllers: [ListingsController],
    providers: [ListingsService],
    exports: [ListingsService],
})
export class ListingsModule { }
