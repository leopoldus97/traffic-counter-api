import { NestFactory } from '@nestjs/core';
import { Transport } from '@nestjs/microservices';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import * as yargs from "yargs";
import { AppModule } from './app.module';
import { DbSeeder } from "./seeder";
import { AuthenticationService } from "./services/authentication.service";
import { DeviceService } from "./services/device.service";
import { TrafficService } from "./services/traffic.service";

const bootstrap = async () => {
    // Load app
    const app = await NestFactory.create(AppModule);
    // Configure additional features
    app.enableCors({ origin: process.env.FRONTEND_URL, });
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


const seed = async () => {
    const app = await NestFactory.create(AppModule);
    const authService = app.get<AuthenticationService>(AuthenticationService);
    const deviceService = app.get<DeviceService>(DeviceService);
    const trafficService = app.get<TrafficService>(TrafficService);
    const seeder = new DbSeeder(authService, deviceService, trafficService);

    try {
        await seeder.seed(argv.seedPath);
        process.exit(0);
    } catch (error) {
        console.log("Error on seed:", error.message || error);
        process.exit(1);
    }
}

// Check seed option
const argv = yargs.option("seedPath", {
    alias: "sp",
    description: "Path to json file containing seed data",
    type: "string"
}).argv;

if (argv.seedPath) {
    seed();
} else {
    bootstrap();
}