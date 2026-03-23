import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { VisitsService } from './visits.service';
import { VisitsController } from './visits.controller';
import { VisitRequest } from './entities/visit-request.entity';

@Module({
    imports: [TypeOrmModule.forFeature([VisitRequest])],
    providers: [VisitsService],
    controllers: [VisitsController],
    exports: [VisitsService],
})
export class VisitsModule { }
