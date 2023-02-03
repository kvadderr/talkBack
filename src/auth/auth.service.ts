import {
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';

import { RoleType } from '../role/role.model'
import { CreateUserDto } from '../user/dto/create-user.dto'

import { UserService } from '../user/user.service'
import { ClientService } from '../client/client.service'
import { OperatorService } from '../operator/operator.service'
import { MailService } from '../mailer/mail.service'

import { User } from '../user/user.model'
import { Client } from '../client/client.model'
import { Operator } from '../operator/operator.model'

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private clientService: ClientService,
    private operatorService: OperatorService,
    private mailService: MailService,
  ) {}

  async login(dto){
    console.log(dto);
    let candidate = await this.usersService.getUserByEmailAndPass(dto.login, dto.password);
    if (!candidate) {
      throw new HttpException(
        'Неверные данные авторизации',
        HttpStatus.BAD_REQUEST,
      );
    };

    if (candidate.isBanned === 1) {
      throw new HttpException(
        candidate.banCause,
        HttpStatus.BAD_REQUEST,
      );
    }
    return candidate;
  }

  async signup(dto) {
    console.log(dto);
    let candidate = await this.usersService.getUserByEmail(dto.login);
    if (candidate) {
      throw new HttpException(
        'Пользователь с таким логином существует',
        HttpStatus.BAD_REQUEST,
      );
    }
    const user = await this.usersService.create(dto);
    console.log(user);
    const data = {
      user, 
      ...dto
    }
    if (dto.role === 'CLIENT' ) { const client = await this.clientService.createClient(data); }
    if (dto.role === 'OPERATOR' ) { const operator = await this.operatorService.createOperator(data); }
    
    return user;
  }

  async sendConfirmCodeEmail(userId: number){

    const user = await this.usersService.getMe(userId);
    const code = Math.floor(Math.random() * (9999-1000))+1000;
    console.log('sendCode', user);
    const sendMa = await this.mailService.sendCode(user.login, code);
    return code;

  }

  async confirmProfile(data){

    const user = await this.usersService.getUserByEmail(data.login);
    user.isSuccessful = true;
    console.log('usrr', user);
    const updateUser = await this.usersService.create(user);
    console.log('usrr', user);
    return updateUser;

  }

  async restorePassword(data){

    const user = await this.usersService.getUserByEmail(data.login);
    console.log('restore USER', user);
    const code = Math.floor(Math.random() * (9999-1000))+1000;
    user.password = code+'_new';
    const sendMa = await this.mailService.sendForgotPassword(user.login, user.password);
    const updateUser = await this.usersService.create(user);
    return updateUser;

  }

  async updateBaseData(data){
    const user = await this.usersService.getUserByEmail(data.login);
    user.FIO = data.FIO;
    user.password = data.password; 
    user.birth = data.years; 
    const updateUser = await this.usersService.create(user);
    return updateUser;
  }

  async banUser(data){
    const user = await this.usersService.getUserByEmail(data.login);
    user.isBanned = data.isBanned;
    user.banCause = data.cause; 
    const updateUser = await this.usersService.create(user);
    return updateUser;
  }

  async statistic(data){
    
  }

}    