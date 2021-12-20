import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from 'src/guards/auth.guard';
import { DeviceService } from 'src/services/device.service';

@UseGuards(AuthGuard)
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
