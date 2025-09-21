import { Logger } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import {
  MessageBody,
  OnGatewayConnection,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';

@WebSocketGateway({
  namespace: 'events',
  transports: ['websocket'],
  cors: {
    origin: '*',
  },
})
export class EventsGateway implements OnGatewayConnection {
  private readonly logger = new Logger(EventsGateway.name);
  constructor(private readonly jwtService: JwtService) {}

  async handleConnection(client: Socket) {
    try {
      const token: string | undefined = client.handshake.auth.token;
      if (!token) {
        this.logger.warn('Token is empty');
        client.disconnect(true);
        return;
      }
      const payload = await this.jwtService.verifyAsync(token);
      (client as any).user = payload;
    } catch {
      client.disconnect(true);
      this.logger.warn('Reject connection');
    }
  }
  @WebSocketServer()
  server: Server;

  send() {
    this.server.emit('events', {
      data: 'This is a test event',
      type: 'notification',
      message: 'hello-world' + new Date().getTime(),
    });
  }

  @SubscribeMessage('events')
  handleEvent(@MessageBody() data: string): string {
    this.logger.log(data);
    return data;
  }
}
