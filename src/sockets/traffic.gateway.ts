import { Logger } from '@nestjs/common';
import {
    OnGatewayInit,
    WebSocketGateway,
    WebSocketServer,
} from '@nestjs/websockets';
import { filter, tap } from "rxjs/operators";
import { Server, Socket } from 'socket.io';
import { EventService } from "src/services/event.service";

@WebSocketGateway({ cors: true })
export class TrafficGateway implements OnGatewayInit {
    
    @WebSocketServer() 
    public server: Server;

    private logger: Logger = new Logger(TrafficGateway.name);

    constructor(private readonly eventService: EventService) {}

    afterInit(server: Server) {
        this.eventService.events$.pipe(
            filter(ev => ev.eventType === "object" && ev.data.objectType === "traffic" && ev.eventName === "created"),
            tap(ev => server.emit("traffic-record:added", JSON.stringify(ev.data.object) ))
        ).subscribe();
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ..._: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}
