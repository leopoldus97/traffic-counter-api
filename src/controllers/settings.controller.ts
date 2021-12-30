import { Body, Controller, Get, Param, Post, Res, UseGuards } from '@nestjs/common';
import { Settings } from 'src/data/settings.schema';
import { AuthGuard } from 'src/guards/auth.guard';
import { SettingsService } from 'src/services/settings.service';
import { Request, Response } from 'express';

@UseGuards(AuthGuard)
@Controller('settings')
export class SettingsController {
    constructor(private readonly service: SettingsService) { }

    @Get(':pid')
    async get(@Param() params: any, @Res() res: Response) {
        try {
            const cfg = await this.service.findLatestSettingForPidAsync(params.pid);
            return res.status(cfg ? 200 : 404).send(cfg || { error: `No config found for device with PID: ${params.pid}` });
        } catch (error) {
            res.status(500).send({ error });
        }
    }

    @Post()
    async post(@Body() settings: Settings, @Res() res: Response) {
        try {
            if (!settings || !settings.pid) {
                return res.status(400).send({ error: "Empty body in request" });
            }
            return res.status(201).send(await this.service.createSettingsDataAsync(settings));
        } catch (error) {
            res.status(500).send({ error });
        }
    }
}
