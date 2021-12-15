import { Controller, Get } from '@nestjs/common';
import { DeviceService } from 'src/services/device.service';

@Controller('device')
export class DeviceController {
  constructor(private readonly service: DeviceService) {}

  @Get()
  async get() {
    try {
      return await this.service.findAllDevicesAsync();
    } catch (error) {
      return { error };
    }
  }
}
