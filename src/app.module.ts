import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { Settings, SettingsSchema } from './data/settings.schema';
import { Traffic, TrafficSchema } from './data/traffic.schema';
import { SettingsService } from './services/settings.service';
import { TrafficService } from './services/traffic.service';

@Module({
  imports: [
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
      { name: Test.name, schema: TestSchema },
      { name: Traffic.name, schema: TrafficSchema },
      { name: Settings.name, schema: SettingsSchema },
    ]),
  ],
  controllers: [
  ],
  providers: [
    TrafficService,
    SettingsService,
  ],
})
export class AppModule {}
