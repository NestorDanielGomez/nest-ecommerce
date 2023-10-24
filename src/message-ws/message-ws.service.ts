import { Injectable } from '@nestjs/common';
import { Socket } from 'socket.io';
import { User } from '../auth/entities/user.entity';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';

interface ConnectedClients {
    [id: string]: {
        socket: Socket,
        user: User
    }
}

@Injectable()
export class MessageWsService {
    constructor(
        @InjectRepository(User)
        private readonly userRepository: Repository<User>
    ) { }
    private connectedClients: ConnectedClients = {}

    async registerClient(client: Socket, userId: string) {
        const user = await this.userRepository.findOneBy({ id: userId })
        if (!user) throw new Error("Usuario no encontrado")
        if (!user.IsActive) throw new Error("Usuario no activo")

        this.connectedClients[client.id] = { socket: client, user: user }
    }

    removeClient(clientId: string) {
        delete this.connectedClients[clientId]
    }

    getConnectedClients(): string[] {
        return Object.keys(this.connectedClients)
    }
    getFullNameBySocketId(socketId: string) {
        return this.connectedClients[socketId].user.fullName
    }
}
