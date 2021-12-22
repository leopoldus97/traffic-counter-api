import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, UseGuards } from '@nestjs/common';
import { Traffic, TrafficType } from 'src/data/traffic.schema';
import { AuthGuard } from "src/guards/auth.guard";
import { TrafficService } from 'src/services/traffic.service';

@UseGuards(AuthGuard)
@Controller('traffic')
export class TrafficController {
    constructor(private readonly service: TrafficService) { }

    @Get()
    async get(@Query("type") type: TrafficType, @Query("day", ParseIntPipe) day: number) {
        try {
            return await this.service.findTrafficData({ trafficType: type, timestamp: day && new Date(day) });
        } catch (error) {
            return { error };
        }
    }

    @Post()
    async post(@Body() traffic: Traffic) {
        try {
            return await this.service.createTrafficDataAsync(traffic);
        } catch (error) {
            return { error };
        }
    }
}
