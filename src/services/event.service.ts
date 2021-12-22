import { Injectable } from "@nestjs/common";
import { Observable, Subject } from "rxjs";
import { Traffic } from "src/data/traffic.schema";

export interface TrafficEventData {
    objectType: "traffic";
    object: Traffic;
}
export interface ObjectEvent {
    eventType: "object";
    eventName: "updated" | "created" | "deleted";
    data: TrafficEventData;
}

export type Event = ObjectEvent;

@Injectable()
export class EventService {

    private eventStream: Subject<Event> = new Subject();
    public get events$(): Observable<Event> {
        return this.eventStream.pipe();
    }

    public emit(ev: Event): void {
        this.eventStream.next(ev);
    }
}