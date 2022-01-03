import {
    MiddlewareConsumer,
    Module,
    NestModule,
    RequestMethod
} from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ClientsModule, Transport } from '@nestjs/microservices';
import { MongooseModule } from '@nestjs/mongoose';
import { AuthenticationController } from './controllers/authentication.controller';
import { SettingsController } from './controllers/settings.controller';
import { TrafficController } from './controllers/traffic.controller';
import { Session, SessionSchema } from './data/session.schema';
import { Settings, SettingsSchema } from './data/settings.schema';
import { Traffic, TrafficSchema } from './data/traffic.schema';
import { User, UserSchema } from './data/user.schema';
import { LoggerMiddleware } from './middleware/logger.middleware';
import { MqttController } from './mqtt/mqtt.controller';
import { AuthenticationService } from './services/authentication.service';
import { EventService } from "./services/event.service";
import { SettingsService } from './services/settings.service';
import { TrafficService } from './services/traffic.service';
import { TrafficGateway } from "./sockets/traffic.gateway";

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
      { name: Traffic.name, schema: TrafficSchema },
      { name: Settings.name, schema: SettingsSchema },
      { name: Session.name, schema: SessionSchema },
      { name: User.name, schema: UserSchema },
    ]),
  ],
  controllers: [
    MqttController,
    TrafficController,
    SettingsController,
    AuthenticationController,
  ],
  providers: [
    TrafficService,
    SettingsService,
    AuthenticationService,
    EventService,
    TrafficGateway
  ],
})
export class AppModule implements NestModule {
  // Setup middleware
  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(LoggerMiddleware)
      .forRoutes({ path: '*', method: RequestMethod.ALL });
  }
}
