import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { AppModule } from './app.module';

async function bootstrap() {
  // Load app
  const app = await NestFactory.create(AppModule);

  // Configure additional features
  app.enableCors({origin: process.env.FRONTEND_URL,});
  app.connectMicroservice({
    transport: Transport.MQTT,
    options: {
      url: process.env.MQTT_URL,
      port: +process.env.MQTT_PORT,
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD,
    },
  });
  
  // Generate Docs
  const config = new DocumentBuilder()
    .setTitle('Traffic-Counter')
    .setDescription('Traffic-Counter API')
    .setVersion('1.0')
    .addTag('traffic-counter')
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);

  // Bootstrap server
  await app.startAllMicroservices();
  await app.listen(process.env.PORT || 3000);
}
bootstrap();
