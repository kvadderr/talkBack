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
import { JwtService } from "@nestjs/jwt";
import * as bcrypt from 'bcrypt';


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
    private jwtService: JwtService
  ) {}

  async login(dto, response){
    console.log(dto);
    let candidate = await this.usersService.getUserByEmailAndPass(dto.login);
    if (!candidate) {
      throw new HttpException(
        'Неверные данные авторизации',
        HttpStatus.BAD_REQUEST,
      );
    };

    if (!await bcrypt.compare(dto.password, candidate.password)) {
      throw new HttpException('Неверные данные авторизацииss', HttpStatus.BAD_REQUEST);
    }

    if (candidate.isBanned === 1) {
      throw new HttpException(
        candidate.banCause,
        HttpStatus.BAD_REQUEST,
      );
    }
    const jwt = await this.jwtService.signAsync({id: candidate.id}, {secret: 'secret'});
    response.cookie('jwt', jwt, {httpOnly: true});
    return candidate;
  }

  async getMe(request) {
    const cookie = request.cookies['jwt'];
    const data = await this.jwtService.verifyAsync(cookie, {secret: 'secret'});
    if (!data) {
      throw new UnauthorizedException();
    }

    const user = await this.usersService.getMe(data['id']);
    const {password, ...result} = user;
  
    return result;
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
    dto.isPassword = dto.password;
    dto.password = await bcrypt.hash(dto.password, 12);
    
    const user = await this.usersService.create(dto);
    console.log(user);
    const data = {
      user, 
      ...dto
    }
    if (dto.role === 'CLIENT' ) { const client = await this.clientService.createClient(data); }
    if (dto.role === 'OPERATOR' ) { const operator = await this.operatorService.createOperator(data); }
    delete user.password;
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