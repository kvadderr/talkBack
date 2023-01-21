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

import { User } from '../user/user.model'
import { Client } from '../client/client.model'
import { Operator } from '../operator/operator.model'

@Injectable()
export class AuthService {
constructor(
  private usersService: UserService,
  private clientService: ClientService,
  private operatorService: OperatorService
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

async signup(
  dto,
) {
  console.log('dto', dto);
  
  let candidate = await this.usersService.getUserByEmail(dto.login);

  if (candidate) {
    throw new HttpException(
      'Пользователь с таким логином существует',
      HttpStatus.BAD_REQUEST,
    );
  }
  
  const user = await this.usersService.create(dto);
  
  console.log('user', user);
  
  const data = {
    user, 
    ...dto
  }

  if (dto.role === 'CLIENT' ) {
    const client = await this.clientService.createClient(data);
  }

  if (dto.role === 'OPERATOR' ) {
    const operator = await this.operatorService.createOperator(data);
  }

  return user;

}

}