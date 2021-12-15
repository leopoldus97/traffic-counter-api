import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { Traffic, TrafficType } from 'src/data/traffic.schema';
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
    const traffic: Traffic = JSON.parse(data);
    const trafficType: string = context
      .getTopic()
      .split('/')
      .pop()
      .toUpperCase();
    traffic.trafficType = TrafficType[trafficType];
    return await this.trafficService.createTrafficDataAsync(traffic);
  }

  @MessagePattern('init/#')
  async initializeSettings(@Ctx() context: MqttContext) {
    const pid = context.getTopic();
    await this.settingsService.initializeSettingsAsync(pid);
  }
  }
}
