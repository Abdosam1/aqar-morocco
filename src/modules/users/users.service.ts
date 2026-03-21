import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';

@Injectable()
export class UsersService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
    ) { }

    async findById(id: string): Promise<User> {
        const user = await this.userRepo.findOne({ where: { id } });
        if (!user) throw new NotFoundException('User not found');
        return user;
    }

    async updateProfile(userId: string, data: Partial<User>): Promise<User> {
        await this.userRepo.update(userId, data);
        return this.findById(userId);
    }

    async updateFcmToken(userId: string, fcmToken: string): Promise<void> {
        await this.userRepo.update(userId, { fcm_token: fcmToken });
    }

    async findAll(page = 1, limit = 20) {
        const [data, total] = await this.userRepo.findAndCount({
            order: { created_at: 'DESC' },
            skip: (page - 1) * limit,
            take: limit,
        });
        return { data, meta: { total, page, limit, total_pages: Math.ceil(total / limit) } };
    }
}
