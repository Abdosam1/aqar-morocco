import { Injectable, ConflictException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { User } from '../users/entities/user.entity';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
import { UserRole } from '../../shared/enums';

@Injectable()
export class AuthService {
    constructor(
        @InjectRepository(User)
        private userRepo: Repository<User>,
        private jwtService: JwtService,
    ) { }

    async register(dto: RegisterDto) {
        // Check if email already exists
        const existing = await this.userRepo.findOne({ where: { email: dto.email } });
        if (existing) {
            throw new ConflictException('Email already registered');
        }

        // Hash password
        const salt = await bcrypt.genSalt(12);
        const password_hash = await bcrypt.hash(dto.password, salt);

        // Create user
        const user = this.userRepo.create({
            email: dto.email,
            password_hash,
            full_name: dto.full_name,
            phone: dto.phone,
            whatsapp: dto.whatsapp || null,
            role: UserRole.USER,
        });

        const savedUser = await this.userRepo.save(user);

        // Generate tokens
        const tokens = this.generateTokens(savedUser);

        return {
            ...tokens,
            user: {
                id: savedUser.id,
                email: savedUser.email,
                full_name: savedUser.full_name,
                role: savedUser.role,
            },
        };
    }

    async login(dto: LoginDto) {
        // Find user with password
        const user = await this.userRepo
            .createQueryBuilder('user')
            .addSelect('user.password_hash')
            .where('user.email = :email', { email: dto.email })
            .getOne();

        if (!user) {
            throw new UnauthorizedException('Invalid credentials');
        }

        if (!user.is_active) {
            throw new UnauthorizedException('Account is deactivated');
        }

        // Compare password
        const isMatch = await bcrypt.compare(dto.password, user.password_hash);
        if (!isMatch) {
            throw new UnauthorizedException('Invalid credentials');
        }

        const tokens = this.generateTokens(user);

        return {
            ...tokens,
            user: {
                id: user.id,
                email: user.email,
                full_name: user.full_name,
                role: user.role,
            },
        };
    }

    async getProfile(userId: string) {
        const user = await this.userRepo.findOne({ where: { id: userId } });
        if (!user) {
            throw new UnauthorizedException('User not found');
        }
        return user;
    }

    private generateTokens(user: User) {
        const payload = { sub: user.id, email: user.email, role: user.role };
        return {
            access_token: this.jwtService.sign(payload),
            refresh_token: this.jwtService.sign(payload, {
                expiresIn: '7d',
            }),
        };
    }
}
