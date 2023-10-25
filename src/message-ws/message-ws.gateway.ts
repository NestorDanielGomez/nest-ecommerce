import { OnGatewayConnection, OnGatewayDisconnect, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { JwtService } from '@nestjs/jwt';
import { MessageWsService } from './message-ws.service';
import { Server, Socket } from 'socket.io';
import { NewMessageDto } from './dtos/new-message.dto';
import { JwtPayload } from '../auth/interfaces';

@WebSocketGateway({ cors: true })
export class MessageWsGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() wss: Server

  constructor(
    private readonly messageWsService: MessageWsService,
    private readonly jwtService: JwtService
  ) { }
  async handleConnection(client: Socket) {
    // console.log("cliente conectado", client.id)
    const token = client.handshake.headers.authentication as string
    let payload: JwtPayload

    try {
      payload = this.jwtService.verify(token)
      await this.messageWsService.registerClient(client, payload.id)
    } catch (error) {
      client.disconnect()
      return
    }


    this.wss.emit("clientes-updated", this.messageWsService.getConnectedClients())
  }
  handleDisconnect(client: Socket) {
    //console.log("cliente Desconectado", client.id)
    this.messageWsService.removeClient(client.id)
    this.wss.emit("clientes-updated", this.messageWsService.getConnectedClients())
  }


  @SubscribeMessage("message-from-client")
  handleMessageFromClient(client: Socket, payload: NewMessageDto) {
    // emite solo al cliente
    // client.emit("messages-from-server", {
    //   fullName: "Nestor",
    //   message: payload.message || "no-message"
    // })
    // emite a todos menos al cliente que lo emitio
    // client.emit("messages-from-server", {
    //   fullName: "Nestor",
    //   message: payload.message || "no-message"
    // })
    // emite a todos incluido el cliente
    this.wss.emit("messages-from-server", {
      fullName: this.messageWsService.getFullNameBySocketId(client.id),
      message: payload.message || "no-message"
    })
  }
}
