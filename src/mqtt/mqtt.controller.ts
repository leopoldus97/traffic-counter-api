import { Controller } from '@nestjs/common';
import {
  Ctx,
  MessagePattern,
  MqttContext,
  Payload,
} from '@nestjs/microservices';
import { Traffic } from 'src/data/traffic.schema';
import { TrafficService } from 'src/services/traffic.service';

@Controller()
export class MqttController {
  constructor(private readonly service: TrafficService) {}

  @MessagePattern('traffic/#')
  async traffic(@Payload() data: any, @Ctx() context: MqttContext) {
    const traffic: Traffic = JSON.parse(data);
    // return await this.service.createTestData(carData);
    console.log(traffic);
  }
}
