import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Favorite } from './entities/favorite.entity';

@Injectable()
export class FavoritesService {
    constructor(
        @InjectRepository(Favorite)
        private favRepo: Repository<Favorite>,
    ) { }

    async findByUser(userId: string) {
        return this.favRepo.find({
            where: { user_id: userId },
            relations: ['listing', 'listing.city', 'listing.property_type', 'listing.images'],
            order: { created_at: 'DESC' },
        });
    }

    async add(userId: string, listingId: string) {
        const existing = await this.favRepo.findOne({
            where: { user_id: userId, listing_id: listingId },
        });
        if (existing) return existing;

        const fav = this.favRepo.create({ user_id: userId, listing_id: listingId });
        return this.favRepo.save(fav);
    }

    async remove(userId: string, listingId: string) {
        await this.favRepo.delete({ user_id: userId, listing_id: listingId });
        return { removed: true };
    }

    async isFavorited(userId: string, listingId: string): Promise<boolean> {
        const count = await this.favRepo.count({
            where: { user_id: userId, listing_id: listingId },
        });
        return count > 0;
    }
}
