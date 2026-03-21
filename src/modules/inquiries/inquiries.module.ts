import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Inquiry } from './entities/inquiry.entity';

@Module({
    imports: [TypeOrmModule.forFeature([Inquiry])],
    controllers: [],
    providers: [],
})
export class InquiriesModule { }
