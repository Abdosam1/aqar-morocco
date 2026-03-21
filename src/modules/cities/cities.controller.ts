import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { CitiesService } from './cities.service';

@Controller('cities')
export class CitiesController {
    constructor(private citiesService: CitiesService) { }

    @Get()
    findAll() {
        return this.citiesService.findAllCities();
    }

    @Get(':id/neighborhoods')
    findNeighborhoods(@Param('id', ParseIntPipe) id: number) {
        return this.citiesService.findNeighborhoods(id);
    }
}
