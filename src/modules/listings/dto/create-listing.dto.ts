import {
    IsNotEmpty, IsString, IsEnum, IsNumber, IsOptional,
    IsBoolean, Min, Matches, MaxLength,
} from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType } from '../../../shared/enums';

export class CreateListingDto {
    @IsString()
    @IsNotEmpty()
    @MaxLength(200)
    title: string;

    @IsString()
    @IsNotEmpty()
    description: string;

    @Type(() => Number)
    @IsNumber()
    property_type_id: number;

    @IsEnum(ListingType)
    listing_type: ListingType;

    @Type(() => Number)
    @IsNumber()
    @Min(0)
    price: number;

    @Type(() => Number)
    @IsNumber()
    city_id: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    neighborhood_id?: number;

    @IsOptional()
    @IsString()
    address?: string;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    latitude?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    longitude?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    area_m2?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    bedrooms?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    bathrooms?: number;

    @IsOptional()
    @IsBoolean()
    is_furnished?: boolean;

    @IsOptional()
    @IsBoolean()
    has_parking?: boolean;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    floor?: number;

    @IsString()
    @Matches(/^(\+212|0)[5-7][0-9]{8}$/, {
        message: 'Phone must be a valid Moroccan number',
    })
    phone_contact: string;

    @IsOptional()
    @IsString()
    @Matches(/^(\+212|0)[5-7][0-9]{8}$/, {
        message: 'WhatsApp must be a valid Moroccan number',
    })
    whatsapp_contact?: string;

    @IsOptional()
    @IsString()
    commercial_type?: string;

    @IsOptional()
    @IsBoolean()
    has_storefront?: boolean;
}
