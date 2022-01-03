import {
  Body,
  Controller,
  Get,
  Param,
  Put,
  UseGuards,
} from '@nestjs/common';
import { Settings } from 'src/data/settings.schema';
import { AuthGuard } from 'src/guards/auth.guard';
import { SettingsService } from 'src/services/settings.service';

@UseGuards(AuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get()
  async getAll() {
    try {
      return await this.service.findAllSettingsAsync();
    } catch (error) {
      return { error };
    }
  }

  @Get(':pid')
  async get(@Param() params: any) {
    try {
      return await this.service.findSettingForPidAsync(params.pid);
    } catch (error) {
      return { error };
    }
  }

  @Put()
  async put(@Body() settings: Settings) {
    try {
      return await this.service.executeThenEmitFull(settings);
    } catch (error) {
      return { error };
    }
  }

  @Put(':pid')
  async updatePartial(@Param() params: any, @Body() value: {}) {
    console.log(typeof params);
    try {
      return await this.service.executeThenEmitPartial(params.pid, value);
    } catch (error) {
      return { error };
    }
  }
}
