import { Logger } from "@nestjs/common";
import { OnGatewayInit, WebSocketGateway, WebSocketServer } from "@nestjs/websockets";
import { filter, tap } from "rxjs";
import { EventService } from "src/services/event.service";
import { Server, Socket } from 'socket.io';

@WebSocketGateway({ cors: true })
export class SettingsGateway implements OnGatewayInit {
    
    @WebSocketServer() 
    public server: Server;

    private logger: Logger = new Logger(SettingsGateway.name);

    constructor(private readonly eventService: EventService) {}

    afterInit(server: Server) {
        this.eventService.events$.pipe(
            filter(ev => ev.eventType === "object" && ev.data.objectType === "settings" && ev.eventName === "created"),
            tap(ev => server.emit("settings-record:added", JSON.stringify(ev.data.object) ))
        ).subscribe();
    }

    handleDisconnect(client: Socket) {
        this.logger.log(`Client disconnected: ${client.id}`);
    }

    handleConnection(client: Socket, ..._: any[]) {
        this.logger.log(`Client connected: ${client.id}`);
    }
}