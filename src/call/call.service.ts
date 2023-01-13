import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
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
  constructor() {}

  async generateToken(channelName: string) {
    const tokenA = RtcTokenBuilder.buildTokenWithUid(appId, appCertificate, channelName, uid, role, privilegeExpiredTs);
    console.log("Token with integer number Uid: " + tokenA);
    return tokenA;
  }

}