import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { City } from './entities/city.entity';
import { Neighborhood } from './entities/neighborhood.entity';
import { CitiesService } from './cities.service';
import { CitiesController } from './cities.controller';

@Module({
    imports: [TypeOrmModule.forFeature([City, Neighborhood])],
    controllers: [CitiesController],
    providers: [CitiesService],
    exports: [CitiesService],
})
export class CitiesModule { }
