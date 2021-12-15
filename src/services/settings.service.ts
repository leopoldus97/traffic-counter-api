import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from 'src/data/settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @Inject('MQTT_CLIENT') private client: ClientMqtt,
    @InjectModel(Settings.name) private settingsModel: Model<SettingsDocument>,
  ) {}

  async findLatestSettingForPid(pid: string): Promise<Settings> {
    return this.settingsModel
      .findOne({ pid: pid })
      .sort({ timestamp: -1 })
      .exec();
  }

  async createSettingsData(settingsData: Settings): Promise<Settings> {
    const model = new this.settingsModel(settingsData);
    const settings = await model.save();
    this.client.emit('settings/update', JSON.stringify(settings));
    return settings;
  }
}
