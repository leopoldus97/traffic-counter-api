import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Traffic } from 'src/data/traffic.schema';
import { TrafficService } from 'src/services/traffic.service';

@Controller('traffic')
export class TrafficController {
  constructor(private readonly service: TrafficService) {}

  @Get(':type')
  async get(@Param() params: any) {
    try {
      return this.service.findAllForTypeAsync(params.type);
    } catch (error) {
      return { error };
    }
  }

  @Post()
  async post(@Body() traffic: Traffic) {
    try {
      return this.service.createTrafficDataAsync(traffic);
    } catch (error) {
      return { error };
    }
  }
}
