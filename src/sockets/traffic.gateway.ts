import { Logger } from '@nestjs/common';
import {
  OnGatewayInit,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { SocketService } from './socket.service';

@WebSocketGateway({ cors: true })
export class TrafficGateway implements OnGatewayInit {
  @WebSocketServer() public server: Server;
  private logger: Logger = new Logger('AppGateway');

  constructor(private socketService: SocketService) {}

  afterInit(server: Server) {
    this.socketService.server = server;
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  handleConnection(client: Socket, ..._: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
  }
}
