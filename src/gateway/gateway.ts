import { OnModuleInit, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { CallService } from '../call/call.service';

@WebSocketGateway()
@Injectable()
export class MyGateway implements OnModuleInit {
    private callService: CallService
    constructor(private moduleRef: ModuleRef) {}

    @WebSocketServer()
    server: Server;

    async onModuleInit() {

        this.callService = await this.moduleRef.create(CallService);
        const clSer = this.callService;
        this.server.on('connection', (socket) => {

            socket.on('join', function (data) {
                console.log('data', data)
                socket.join(data.login); 
            });

            socket.on('connectionRequest', async function (data) {
                console.log(data);
                const operatorFIO = data.operatorFIO;
                const clientFIO = data.clientFIO;
                const channelName = operatorFIO + 'data'+clientFIO;
                console.log(channelName);
                const tokenA = await clSer.generateToken(operatorFIO + 'data'+clientFIO);
                console.log(tokenA);
                socket.in(data.operatorFIO).emit('new_msg', 
                    {
                        operatorFIO: operatorFIO,
                        clientFIO: clientFIO,
                        token: tokenA,
                        channelName: channelName
                    }
                );
            });

            socket.on('connectionConfirmation', function (data) {
                console.log('setData', data);
                socket.in(data.clientFIO).emit('connectionConfirmation', 
                    {
                        token: data.token,
                        channelName: data.channelName,
                        clientFIO:data.clientFIO,
                        operatorFIO:data.operatorFIO
                    }
                );
            });

            socket.on('connectionLeave', function (data) {
                console.log('setData', data);
                socket.in(data.opponentFIO).emit('leaveChannel');
            });

        });
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any){
        console.log(body)
    }

}