import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Res, UseGuards } from '@nestjs/common';
import { Response } from "express";
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
    async post(@Body() traffic: Traffic, @Res() res: Response) {
        try {
            if (!traffic || !traffic.pid) {
                return res.status(400).send({ error: "Empty body in request" });
            }
            return res.status(201).send(await this.service.createTrafficDataAsync(traffic));
        } catch (error) {
            res.status(500).send({ error });
        }
    }
}
