import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { Settings } from 'src/data/settings.schema';
import { AuthGuard } from 'src/guards/auth.guard';
import { SettingsService } from 'src/services/settings.service';

@UseGuards(AuthGuard)
@Controller('settings')
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @Get(':pid')
  async get(@Param() params: any) {
    try {
      return await this.service.findLatestSettingForPidAsync(params.pid);
    } catch (error) {
      return { error };
    }
  }

  @Post()
  async post(@Body() settings: Settings) {
    try {
      return await this.service.createSettingsDataAsync(settings);
    } catch (error) {
      return { error };
    }
  }
}
