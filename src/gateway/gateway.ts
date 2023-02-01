import { OnModuleInit, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { CallService } from '../call/call.service';
import { UserService } from '../user/user.service';

@WebSocketGateway()
@Injectable()
export class MyGateway implements OnModuleInit {
    constructor(
        private callService: CallService,
        private userService: UserService,
        private moduleRef: ModuleRef
    ) {}

    @WebSocketServer()
    server: Server;

    async onModuleInit() {

        let timers = {}
        let balance = {}
        let price = {}
        let minutes = {}

        let i = 0;
        let currentBalance = 0;
        const clSer = this.callService;
        const usSer = this.userService;

        this.server.on('connection', (socket) => {

            socket.on('join', function (data) {
                console.log('user joined with ID - ', data.userId)
                socket.join(data.userId); 
            });

            socket.on('connectionRequest', async function (data) {

                balance[data.clientId] = data.balance;
                price[data.clientId] = data.price;
                minutes[data.clientId] = Math.floor(data.balance / data.price);

                const channelName = data.clientId + '_channel_' + data.operatorId;
                const tokenA = await clSer.generateToken(channelName);

                socket.in(data.operatorId).emit('connectionRequest', 
                    {
                        clientAvatar: data.avatar,
                        clientFIO: data.clientFIO,
                        clientId: data.clientId,
                        operatorId: data.operatorId,
                        token: tokenA,
                        channelName: channelName
                    }
                );
            });

            socket.on('connectionConfirmation', function (data) {

                this.server.in(data.operatorId).in(data.clientId).emit('connectionConfirmation', 
                    {
                        token: data.token,
                        channelName: data.channelName
                    }
                );
                currentBalance = balance[data.clientId];
                clearInterval(timers[data.clientId]);
                timers[data.clientId] = setInterval(() => {
                    this.server.in(data.operatorId).in(data.clientId).emit('timerUpdate', {
                        timer: i,
                        currentBalance: currentBalance
                    });
                    currentBalance = currentBalance - price[data.clientId]/60;
                    i++;
                }, 1000);
                
            });

            socket.on('connectionClose', async function (data) {
                console.log(data);
                this.server.in(data.opponentId).emit('connectionClose');
                clearInterval(timers[data.clientId]);
                i = 0 ;
                const call = await clSer.saveCall(data);
                const blnc = Math.floor(balance[data.clientId] - currentBalance);
                console.log('currentBalance', blnc)
                const operBalanceSave = await usSer.populateBalance(data.operatorId, blnc);
                const clientBalanceSave = await usSer.minusBalance(data.clientId, blnc);
                console.log('data clientBalanceSave', clientBalanceSave.balance);
                this.server.in(data.operatorId).emit('updateBalance', operBalanceSave.balance)
                this.server.in(data.clientId).emit('updateBalance', clientBalanceSave.balance);
            });

            socket.on('tips', async function (data) {
                
                console.log('tiiips', data);
                const operBalanceSave = await usSer.populateBalance(data.operatorId, data.balance);
                const clientBalanceSave = await usSer.minusBalance(data.clientId, data.balance);
                this.server.in(data.operatorId).emit('updateBalance', operBalanceSave.balance)

            });
            

        });
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any){
        console.log(body)
    }

}