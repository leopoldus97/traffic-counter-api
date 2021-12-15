import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Traffic, TrafficDocument, TrafficType } from 'src/data/traffic.schema';
import { SocketService } from 'src/sockets/socket.service';

@Injectable()
export class TrafficService {
  constructor(
    @Inject('MQTT_CLIENT') private client: ClientMqtt,
    @InjectModel(Traffic.name)
    private readonly trafficModel: Model<TrafficDocument>,
    private readonly socketService: SocketService,
  ) {}

  async findAllForTypeAsync(type: TrafficType): Promise<Traffic[]> {
    return await this.trafficModel.find({ trafficType: type }).exec();
  }

  async createTrafficDataAsync(trafficData: Traffic): Promise<Traffic> {
    const model = new this.trafficModel(trafficData);
    const traffic = await model.save();
    this.socketService.server.emit(
      'traffic/' + trafficData.trafficType,
      JSON.stringify(traffic),
    );
    return traffic;
  }

  async createTrafficDataTest(topic: string, trafficData: Traffic) {
    this.client.emit('traffic/' + topic, JSON.stringify(trafficData));
    return trafficData;
  }
}
