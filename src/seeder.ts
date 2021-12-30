import * as fs from "fs";
import * as uuid from "uuid";
import { Device } from "./data/device.schema";
import { TrafficType } from "./data/traffic.schema";
import { AuthenticationService } from "./services/authentication.service";
import { DeviceService } from "./services/device.service";
import { TrafficService } from "./services/traffic.service";

interface SeedModel {
    auth: {
        username: string,
        password: string
    },
    devices: Device[],
    traffic: {
        start: string,
        end: string
    }
}

export class DbSeeder {
    constructor(
        private readonly auth: AuthenticationService,
        private readonly devices: DeviceService,
        private readonly traffic: TrafficService) {

    }

    public async seed(path: string): Promise<void> {
        const content = fs.readFileSync(path);
        const data: SeedModel = JSON.parse(content.toString());

        // Seed Auth
        await this.auth.createUser(data.auth.username, data.auth.password);

        // Seed Devices
        for (const pid of data.devices.map(d => d.pid)) {
            await this.devices.findOrCreateDeviceAsync(pid);
        }

        // Seed Traffic
        {
            let startDate = new Date(Date.parse(data.traffic.start));
            const endDate = new Date(Date.parse(data.traffic.end));
            console.log(startDate, endDate);
            while (startDate < endDate) {
                for (const type of ["car", "bicycle", "pedestrian", "motorcycle"]){
                    await this.traffic.createTrafficDataAsync({
                        trafficType: type as TrafficType,
                        pid: uuid.v4(),
                        timestamp: startDate
                    })
                }
                const temp = new Date(startDate);
                temp.setDate(startDate.getDate() + 1);
                startDate = temp;
            }
        }


    }
}