import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Call } from './call.model'


const {RtcTokenBuilder, RtmTokenBuilder, RtcRole, RtmRole} = require('agora-access-token')

const appId = 'ddafd74f4177415b9a7201aa56ecc12f';
const appCertificate = 'b3fc4f5d990a47a8a1ce223514add751';
const uid = 0;
const userAccount = "User account";
const role = RtcRole.PUBLISHER;
const expirationTimeInSeconds = 3600;
const currentTimestamp = Math.floor(Date.now() / 1000);
const privilegeExpiredTs = currentTimestamp + expirationTimeInSeconds;

@Injectable()
export class CallService {
  constructor(
    @InjectRepository(Call)
    private callRepository: Repository<Call>,
  ) {}

  async generateToken(channelName: string) {
    const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
    console.log("Token with integer number Uid: " + tokenA);
    return tokenA;
  }

  async saveCall(data: Call) {
    return this.callRepository.save({ ...data });
  }

  async getCallByOperator(operatorId: number) {

    if (operatorId === undefined)  return;

    return this.callRepository.find({
      where: {
        operatorId
      },
      relations: ['client']
    }
    );
  }

  async getCallByClient(clientId: number) {

    if (clientId === undefined)  return;

    return this.callRepository.find({
      where: {
        clientId
      },
      relations: ['operator']
    }
    );
  }

}