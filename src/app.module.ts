import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { DeviceController } from './controllers/device.controller';
import { SettingsController } from './controllers/settings.controller';
import { TrafficController } from './controllers/traffic.controller';
import { Device, DeviceSchema } from './data/device.schema';
import { Settings, SettingsSchema } from './data/settings.schema';
import { Traffic, TrafficSchema } from './data/traffic.schema';
import { MqttController } from './mqtt/mqtt.controller';
import { DeviceService } from './services/device.service';
import { SettingsService } from './services/settings.service';
import { TrafficService } from './services/traffic.service';
import { SocketModule } from './sockets/socket.module';
import { TrafficGateway } from './sockets/traffic.gateway';

@Module({
  imports: [
    SocketModule,
    TrafficGateway,
    ConfigModule.forRoot(),
    ClientsModule.register([
      {
        name: 'MQTT_CLIENT',
        transport: Transport.MQTT,
        options: {
          url: process.env.MQTT_URL,
          port: +process.env.MQTT_PORT,
          username: process.env.MQTT_USERNAME,
          password: process.env.MQTT_PASSWORD,
        },
      },
    ]),
    MongooseModule.forRoot(process.env.MONGODB_CONNECTION_STRING),
    MongooseModule.forFeature([
      { name: Traffic.name, schema: TrafficSchema },
      { name: Settings.name, schema: SettingsSchema },
      { name: Device.name, schema: DeviceSchema },
    ]),
  ],
  controllers: [
    MqttController,
    TrafficController,
    SettingsController,
    DeviceController,
  ],
  providers: [TrafficService, SettingsService, DeviceService],
})
export class AppModule {}
