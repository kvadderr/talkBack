import { OnModuleInit, Injectable } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core'
import { MessageBody, SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

import { CallService } from '../call/call.service';
import { UserService } from '../user/user.service';
import { TrafficService } from '../traffic/traffic.service';

import { Traffic } from '../traffic/traffic.model';


@WebSocketGateway()
@Injectable()
export class MyGateway implements OnModuleInit {
    constructor(
        private callService: CallService,
        private userService: UserService,
        private trafficService: TrafficService,
        private moduleRef: ModuleRef
    ) {}

    @WebSocketServer()
    server: Server;

    async onModuleInit() {

        let timers = {}
        let balance = {}
        let price = {}
        let minutes = {}
        let users = {}
        let startSession = {}
        let onlineOperatorList = []

        let i = 0;
        let currentBalance = 0;
        const clSer = this.callService;
        const usSer = this.userService;
        const trafficSer = this.trafficService;

        this.server.on('connection', (socket) => {

            socket.on('join', function (data) {
                console.log('user joined with ID - ', data.userId)
                socket.join(data.userId); 
                onlineOperatorList.push(data.userId);
                users[socket.id] = data.userId;
                startSession[socket.id] = new Date();
                this.server.emit('listOnlineUser', onlineOperatorList);
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
                const blnc = Math.floor((balance[data.clientId] - currentBalance) * 100) /100;
                console.log('currentBalance', blnc);
                const percent = 12;
                const companyCost = percent * blnc/100;
                const cost = blnc - companyCost;
                data.cost = cost;
                data.companyCost = companyCost
                const call = await clSer.saveCall(data);
                const operBalanceSave = await usSer.populateBalance(data.operatorId, cost);
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

            socket.on('sendMeList', async function (data) {
                this.server.in(data.userId).emit('listOnlineUser', onlineOperatorList);
            });

            socket.on('disconnect', async function () {
                const isThisMoment = new Date();
                
                const onlineDuration = Math.floor(isThisMoment.valueOf() - startSession[socket.id].valueOf()) / 1000;
                console.log(onlineOperatorList);
                const data = {
                    userId: users[socket.id], 
                    duration: Math.floor(onlineDuration)
                }
                const saveTraffic = await trafficSer.create(data);
                onlineOperatorList = onlineOperatorList.filter((n) => {return n != users[socket.id]});
                this.server.emit('listOnlineUser', onlineOperatorList);
                console.log('tiiips', socket.id);
                console.log('user id - ', users[socket.id])
                console.log('DURATION SESSION - ', Math.floor(onlineDuration))
            });

        });
    }

    @SubscribeMessage('newMessage')
    onNewMessage(@MessageBody() body: any){
        console.log(body)
    }

}