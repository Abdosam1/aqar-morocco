import { IsOptional, IsEnum, IsNumber, IsString, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { ListingType } from '../../../shared/enums';
import { PaginationDto } from '../../../common/dto/pagination.dto';

export class FilterListingDto extends PaginationDto {
    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    city_id?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    neighborhood_id?: number;

    @IsOptional()
    @IsEnum(ListingType)
    listing_type?: ListingType;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    property_type_id?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    @Min(0)
    min_price?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    max_price?: number;

    @IsOptional()
    @Type(() => Number)
    @IsNumber()
    bedrooms?: number;

    @IsOptional()
    @IsString()
    search?: string;

    @IsOptional()
    @IsString()
    sort?: 'price' | 'created_at';

    @IsOptional()
    @IsString()
    order?: 'asc' | 'desc';
}
