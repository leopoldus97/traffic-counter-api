import { Inject, Injectable } from '@nestjs/common';
import { ClientMqtt } from '@nestjs/microservices';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { concatMap, delay, of, range, repeat } from "rxjs";
import { Traffic, TrafficDocument } from 'src/data/traffic.schema';
import * as uuid from "uuid";
import { EventService } from "./event.service";

export type TrafficQuery = Partial<Pick<Traffic, "pid" | "trafficType" | "timestamp">>;

@Injectable()
export class TrafficService {
    constructor(
        @Inject('MQTT_CLIENT') private client: ClientMqtt,
        @InjectModel(Traffic.name)
        private readonly trafficModel: Model<TrafficDocument>,
        private readonly eventService: EventService,
    ) {
        if (process.env.GENERATE_TRAFFIC) {
            range(1, 10).pipe(
                concatMap(i => of(i).pipe(delay(1000 + (Math.random() * 4000)))), //Randomize interval
                repeat()
            ).subscribe(async val =>
                await this.createTrafficDataAsync({
                    trafficType: val % 3 === 0 ? "car" : val % 5 === 0 ? "pedestrian" : "bicycle",
                    pid: uuid.v4(),
                    timestamp: new Date()
                })
            );
        }
    }

    async findTrafficData(query?: TrafficQuery): Promise<Traffic[]> {
        const reducedQuery: TrafficQuery = Object.keys(query)
            .filter(key => !!query[key])
            .reduce((obj, key) => Object.assign(obj, { [key]: query[key] }), {});

        const dbQuery: any = reducedQuery;
        if(reducedQuery.timestamp) {
            const start = new Date(reducedQuery.timestamp);
            start.setHours(0, 0, 0, 0);

            const end = new Date(start);
            end.setHours(24, 0, 0, 0);
            dbQuery.timestamp = {$gte: start,$lt: end};
        }

        return await this.trafficModel.find(dbQuery).exec();
    }

    async createTrafficDataAsync(trafficData: Traffic): Promise<Traffic> {
        const model = new this.trafficModel(trafficData);
        const traffic = await model.save();
        this.eventService.emit({ eventType: "object", eventName: "created", data: { objectType: "traffic", object: traffic } });
        return traffic;
    }

    async createTrafficDataTest(topic: string, trafficData: Traffic) {
        this.client.emit('traffic/' + topic, JSON.stringify(trafficData));
        return trafficData;
    }
}
