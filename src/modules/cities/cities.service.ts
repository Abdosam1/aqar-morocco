import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { City } from './entities/city.entity';
import { Neighborhood } from './entities/neighborhood.entity';

@Injectable()
export class CitiesService {
    constructor(
        @InjectRepository(City)
        private cityRepo: Repository<City>,
        @InjectRepository(Neighborhood)
        private neighborhoodRepo: Repository<Neighborhood>,
    ) { }

    async findAllCities() {
        return this.cityRepo.find({
            where: { is_active: true },
            order: { name_fr: 'ASC' },
        });
    }

    async findNeighborhoods(cityId: number) {
        return this.neighborhoodRepo.find({
            where: { city_id: cityId, is_active: true },
            order: { name_fr: 'ASC' },
        });
    }

    async createCity(data: Partial<City>) {
        const city = this.cityRepo.create(data);
        return this.cityRepo.save(city);
    }

    async createNeighborhood(data: Partial<Neighborhood>) {
        const neighborhood = this.neighborhoodRepo.create(data);
        return this.neighborhoodRepo.save(neighborhood);
    }
}
