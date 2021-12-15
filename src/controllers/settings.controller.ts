import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { Settings } from 'src/data/settings.schema';
import { SettingsService } from 'src/services/settings.service';

@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get(':pid')
  async get(@Param() params: any) {
    try {
      return this.service.findLatestSettingForPid(params.pid);
      return await this.service.findLatestSettingForPidAsync(params.pid);
    } catch (error) {
      return { error };
    }
  }

  @Post()
  async post(@Body() settings: Settings) {
    try {
      return this.service.createSettingsData(settings);
      return await this.service.createSettingsDataAsync(settings);
    } catch (error) {
      return { error };
    }
  }
    } catch (error) {
      return { error };
    }
  }
}
