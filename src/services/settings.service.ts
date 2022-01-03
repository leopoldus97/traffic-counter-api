import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Settings, SettingsDocument } from 'src/data/settings.schema';
import { EventService } from './event.service';

@Injectable()
export class SettingsService {
  constructor(
    @Inject('MQTT_CLIENT') private client: ClientMqtt,
    @InjectModel(Settings.name)
    private readonly settingsModel: Model<SettingsDocument>,
    private readonly eventService: EventService,
  ) {}

  async findSettingForPidAsync(pid: string): Promise<Settings> {
    return await this.settingsModel.findOne({ pid: pid }).exec();
  }

  async findAllSettingsAsync() {
    return await this.settingsModel.find().exec();
  }

  async updateSettingsDataAsync(settingsData: Settings): Promise<Settings> {
    const settings: Settings = await this.settingsModel
      .findOneAndUpdate({ pid: settingsData.pid }, settingsData, {
        upsert: true,
        new: true,
      })
      .exec();
    return settings;
  }

  async patchValueToSettingsAsync(
    pid: string,
    partToUpdate: {},
  ): Promise<Settings> {
    const settings = this.settingsModel.findOneAndUpdate(
      { pid: pid },
      partToUpdate,
      { upsert: false, new: true },
    );
    return settings;
  }

  async executeThenEmitFull(settingsData: Settings): Promise<Settings> {
    const settings: Settings = await this.updateSettingsDataAsync(settingsData);
    this.client.emit('settings/' + settingsData.pid, JSON.stringify(settings));
    return settings;
  }

  async executeThenEmitPartial(pid: string, partToUpdate: {}): Promise<Settings> {
    const settings: Settings = await this.patchValueToSettingsAsync(pid, partToUpdate);
    this.client.emit('settings/' + pid, JSON.stringify(settings));
    return settings;
  }

  async initializeSettingsAsync(pid: string): Promise<Settings> {
    let settings: Settings = await this.findSettingForPidAsync(pid);
    if (!settings) {
      settings = { pid, state: 'on', timestamp: new Date() };
      this.eventService.emit({ eventType: "object", eventName: "created", data: { objectType: "settings", object: settings } });
      return await this.executeThenEmitFull(settings);
    } else {
      this.client.emit('settings/' + pid, JSON.stringify(settings));
      return settings;
    }
  }
}
