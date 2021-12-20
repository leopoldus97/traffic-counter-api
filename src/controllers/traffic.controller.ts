import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Traffic } from 'src/data/traffic.schema';
import { AuthGuard } from "src/guards/auth.guard";
import { TrafficService } from 'src/services/traffic.service';

@UseGuards(AuthGuard)
@Controller('traffic')
export class TrafficController {
  constructor(private readonly service: TrafficService) {}

  @Get(':type')
  async get(@Param() params: any) {
    try {
      return await this.service.findAllForTypeAsync(params.type);
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
