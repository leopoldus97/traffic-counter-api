import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from 'src/data/settings.schema';

@Injectable()
export class SettingsService {
  constructor(
    @Inject('MQTT_CLIENT') private client: ClientMqtt,
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
  ) {}

  async findLatestSettingForPidAsync(pid: string): Promise<Settings> {
    return await this.settingsModel
      .findOne({ pid: pid })
      .sort({ timestamp: -1 })
      .exec();
  }

  async createSettingsDataAsync(settingsData: Settings): Promise<Settings> {
    const model = new this.settingsModel(settingsData);
    const settings: Settings = await model.save();
    console.log('createSettingsData', settings);
    this.client.emit('settings/' + settingsData.pid, JSON.stringify(settings));
    return settings;
  }

  //   async updateSettingsData(pid: string, settingsData: Settings) {
  //     settingsData.timestamp = new Date();
  //     //   const model = new this.settingsModel(settings);
  //     //   const settings = await model.updateOne().exec();
  //     const settings = await this.settingsModel
  //       .updateOne({ pid: pid }, settingsData)
  //       .exec();
  //     this.client.emit('settings/' + pid, JSON.stringify(settings));
  //   }

  async initializeSettingsAsync(pid: string) {
    const settings = await this.findLatestSettingForPidAsync(pid);
    this.client.emit('settings/init/' + pid, JSON.stringify(settings));
  }
}
