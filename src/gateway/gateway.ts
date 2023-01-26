import { OnModuleInit, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { CallService } from '../call/call.service';

@WebSocketGateway()
@Injectable()
export class MyGateway implements OnModuleInit {
    constructor(
        private callService: CallService,
        private moduleRef: ModuleRef
    ) {}

    @WebSocketServer()
    server: Server;

    async onModuleInit() {

        const clSer = this.callService;

        this.server.on('connection', (socket) => {

            socket.on('join', function (data) {
                console.log('data', data)
                socket.join(data.login); 
            });

            socket.on('connectionRequest', async function (data) {
                console.log('dataARIEL', data);
                const operatorFIO = data.operatorFIO;
                const clientFIO = data.clientFIO;
                const channelName = operatorFIO + 'data'+clientFIO;
                console.log(channelName);
                const tokenA = await clSer.generateToken(operatorFIO + 'data'+clientFIO);
                console.log(tokenA);
                socket.in(data.operatorFIO).emit('new_msg', 
                    {
                        clientAvatar: data.avatar,
                        operatorFIO: operatorFIO,
                        clientFIO: clientFIO,
                        clientId: data.clientId,
                        operatorId: data.operatorId,
                        token: tokenA,
                        channelName: channelName
                    }
                );
            });

            socket.on('connectionConfirmation', function (data) {
                socket.in(data.clientFIO).emit('connectionConfirmation', 
                    {
                        token: data.token,
                        channelName: data.channelName,
                        clientFIO:data.clientFIO,
                        operatorFIO:data.operatorFIO
                    }
                );
            });

            socket.on('connectionLeave', async function (data) {
                console.log('setData', data);
                socket.in(data.opponentFIO).emit('leaveChannel');
            });

            socket.on('connectionEnd', async function (data) {
                console.log('setData', data);
                const call = await clSer.saveCall(data);
            });

        });
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any){
        console.log(body)
    }

}