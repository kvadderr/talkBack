import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Operator } from './operator.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service'

@Injectable()
export class OperatorService {
  constructor(
    @InjectRepository(Operator)
    private operatorRepository: Repository<Operator>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async getAllOperator(): Promise<Operator[] | []> {
    return this.operatorRepository.find({
      relations: ['user', 'specialization'],
    });
  }

  async createOperator(operator: Partial<Operator>): Promise<Operator> {
    return this.operatorRepository.save({ ...operator });
  }

}