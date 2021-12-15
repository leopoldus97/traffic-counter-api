import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Traffic, TrafficDocument, TrafficType } from 'src/data/traffic.schema';

@Injectable()
export class TrafficService {
  constructor(
    @Inject('MQTT_CLIENT') private client: ClientMqtt,
    @InjectModel(Traffic.name) private trafficModel: Model<TrafficDocument>,
  ) {}

  async findAllForType(type: TrafficType): Promise<Traffic[]> {
    return this.trafficModel.find({ trafficType: type }).exec();
  }

  async createTrafficData(trafficData: Traffic): Promise<Traffic> {
    const model = new this.trafficModel(trafficData);
    const traffic = await model.save();
    this.client.emit(
      'traffic/' + trafficData.trafficType.toLowerCase(),
      JSON.stringify(traffic),
    );
    return traffic;
  }
}
