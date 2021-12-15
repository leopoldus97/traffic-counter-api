import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Device, DeviceDocument } from 'src/data/device.schema';

@Injectable()
export class DeviceService {
  constructor(
    @InjectModel(Device.name)
    private readonly deviceModel: Model<DeviceDocument>,
  ) {}

  async findAllDevicesAsync(): Promise<Device[]> {
    return this.deviceModel.find().exec();
  }

  async findOrCreateDeviceAsync(pid: string): Promise<Device> {
    const device: Device =
      (await this.findDeviceAsync(pid)) || (await this.createDeviceAsync(pid));
    return device;
  }

  private async findDeviceAsync(pid: string): Promise<Device> {
    return await this.deviceModel.findOne({ pid: pid }).exec();
  }

  private async createDeviceAsync(pid: string): Promise<Device> {
    const deviceData: Device = { pid: pid, timestamp: new Date() };
    const model = new this.deviceModel(deviceData);
    return await model.save();
  }
}
