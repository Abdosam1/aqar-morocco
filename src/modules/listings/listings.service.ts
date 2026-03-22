import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Listing } from './entities/listing.entity';
import { ListingImage } from './entities/listing-image.entity';
import { PropertyType } from './entities/property-type.entity';
import { CreateListingDto } from './dto/create-listing.dto';
import { FilterListingDto } from './dto/filter-listing.dto';
import { ListingStatus } from '../../shared/enums';

@Injectable()
export class ListingsService {
    constructor(
        @InjectRepository(Listing)
        private listingRepo: Repository<Listing>,
        @InjectRepository(ListingImage)
        private imageRepo: Repository<ListingImage>,
        @InjectRepository(PropertyType)
        private propertyTypeRepo: Repository<PropertyType>,
    ) { }

    async create(userId: string, dto: CreateListingDto): Promise<Listing> {
        const listing = this.listingRepo.create({
            ...dto,
            user_id: userId,
            status: ListingStatus.PENDING,
        });
        return this.listingRepo.save(listing);
    }

    async findAll(filters: FilterListingDto, userId?: string) {
        const query = this.listingRepo
            .createQueryBuilder('l')
            .leftJoinAndSelect('l.city', 'c')
            .leftJoinAndSelect('l.neighborhood', 'n')
            .leftJoinAndSelect('l.property_type', 'pt')
            .leftJoinAndSelect('l.images', 'img')
            .where('l.status = :status', { status: ListingStatus.APPROVED });

        if (filters.city_id) {
            query.andWhere('l.city_id = :city_id', { city_id: filters.city_id });
        } else if (filters.city) {
            query.andWhere('(c.name_fr = :city OR c.name = :city)', { city: filters.city });
        }
        if (filters.neighborhood_id) {
            query.andWhere('l.neighborhood_id = :nid', { nid: filters.neighborhood_id });
        }
        if (filters.listing_type) {
            query.andWhere('l.listing_type = :lt', { lt: filters.listing_type });
        }
        if (filters.property_type_id) {
            query.andWhere('l.property_type_id = :ptid', { ptid: filters.property_type_id });
        }
        if (filters.min_price) {
            query.andWhere('l.price >= :min', { min: filters.min_price });
        }
        if (filters.max_price) {
            query.andWhere('l.price <= :max', { max: filters.max_price });
        }
        if (filters.bedrooms) {
            query.andWhere('l.bedrooms = :beds', { beds: filters.bedrooms });
        }
        if (filters.search) {
            query.andWhere(
                "(l.title ILIKE :q OR l.description ILIKE :q)",
                { q: `%${filters.search}%` },
            );
        }

        // Sorting
        const sortField = filters.sort === 'price' ? 'l.price' : 'l.created_at';
        const sortOrder = filters.order === 'asc' ? 'ASC' : 'DESC';
        query.orderBy(sortField, sortOrder);

        // Pagination
        const page = filters.page || 1;
        const limit = Math.min(filters.limit || 20, 50);
        query.skip((page - 1) * limit).take(limit);

        const [data, total] = await query.getManyAndCount();
        return {
            data,
            meta: { total, page, limit, total_pages: Math.ceil(total / limit) },
        };
    }

    async findById(id: string): Promise<Listing> {
        const listing = await this.listingRepo.findOne({
            where: { id },
            relations: ['city', 'neighborhood', 'property_type', 'images', 'user'],
        });
        if (!listing) throw new NotFoundException('Listing not found');

        // Increment views
        await this.listingRepo.increment({ id }, 'views_count', 1);

        return listing;
    }

    async findMyListings(userId: string) {
        return this.listingRepo.find({
            where: { user_id: userId },
            relations: ['city', 'property_type', 'images'],
            order: { created_at: 'DESC' },
        });
    }

    async update(id: string, userId: string, dto: Partial<CreateListingDto>): Promise<Listing> {
        const listing = await this.listingRepo.findOne({ where: { id } });
        if (!listing) throw new NotFoundException('Listing not found');
        if (listing.user_id !== userId) throw new ForbiddenException('Not your listing');

        // If editing, set back to pending for re-moderation
        await this.listingRepo.update(id, { ...dto, status: ListingStatus.PENDING });
        return this.findById(id);
    }

    async remove(id: string, userId: string): Promise<void> {
        const listing = await this.listingRepo.findOne({ where: { id } });
        if (!listing) throw new NotFoundException('Listing not found');
        if (listing.user_id !== userId) throw new ForbiddenException('Not your listing');
        await this.listingRepo.remove(listing);
    }

    async updateStatus(id: string, userId: string, status: ListingStatus): Promise<Listing> {
        const listing = await this.listingRepo.findOne({ where: { id } });
        if (!listing) throw new NotFoundException('Listing not found');
        if (listing.user_id !== userId) throw new ForbiddenException('Not your listing');

        const allowed = [ListingStatus.ARCHIVED, ListingStatus.SOLD, ListingStatus.RENTED];
        if (!allowed.includes(status)) {
            throw new ForbiddenException('Invalid status transition');
        }

        await this.listingRepo.update(id, { status });
        return this.findById(id);
    }

    async addImages(listingId: string, userId: string, images: { image_url: string; thumbnail_url?: string }[]) {
        const listing = await this.listingRepo.findOne({ where: { id: listingId } });
        if (!listing) throw new NotFoundException('Listing not found');
        if (listing.user_id !== userId) throw new ForbiddenException('Not your listing');

        const existingCount = await this.imageRepo.count({ where: { listing_id: listingId } });
        const newImages = images.map((img, i) =>
            this.imageRepo.create({
                listing_id: listingId,
                image_url: img.image_url,
                thumbnail_url: img.thumbnail_url,
                is_primary: existingCount === 0 && i === 0,
                sort_order: existingCount + i,
            }),
        );
        return this.imageRepo.save(newImages);
    }

    async removeImage(imageId: string, userId: string): Promise<void> {
        const image = await this.imageRepo.findOne({
            where: { id: imageId },
            relations: ['listing'],
        });
        if (!image) throw new NotFoundException('Image not found');
        if (image.listing.user_id !== userId) throw new ForbiddenException('Not your listing');
        await this.imageRepo.remove(image);
    }

    async getPropertyTypes() {
        return this.propertyTypeRepo.find({
            where: { is_active: true },
            order: { id: 'ASC' },
        });
    }
}
