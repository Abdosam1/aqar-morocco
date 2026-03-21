import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Listing } from '../listings/entities/listing.entity';
import { AdminAction } from './entities/admin-action.entity';
import { User } from '../users/entities/user.entity';
import { Report } from '../reports/entities/report.entity';
import { AdminService } from './admin.service';
import { AdminController } from './admin.controller';

@Module({
    imports: [TypeOrmModule.forFeature([Listing, AdminAction, User, Report])],
    controllers: [AdminController],
    providers: [AdminService],
    exports: [AdminService],
})
export class AdminModule { }
