import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { Traffic } from 'src/data/traffic.schema';
import { SettingsService } from 'src/services/settings.service';
import { TrafficService } from 'src/services/traffic.service';

@Controller()
export class MqttController {
  constructor(
    private readonly trafficService: TrafficService,
    private readonly settingsService: SettingsService,
  ) {}

  @MessagePattern('traffic/#')
  async traffic(@Payload() data: any, @Ctx() context: MqttContext) {
    const traffic: Traffic = { ...JSON.parse(data), trafficType: context.getTopic().split('/').pop() };
    return await this.trafficService.createTrafficDataAsync(traffic);
  }

  @MessagePattern('init/#')
  async initializeSettings(@Ctx() context: MqttContext) {
    const pid = context.getTopic().split('/').pop();
    return await this.settingsService.initializeSettingsAsync(pid);
  }
}
