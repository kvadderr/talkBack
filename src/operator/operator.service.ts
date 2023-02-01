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

  async getTopOperator(){
    const [data, total] = await this.operatorRepository.findAndCount({
      take: 3,
      skip: 1,
      relations: ['user', 'specialization'],
    });

    return data;
  }

  async createOperator(operator: Operator) {
    return this.operatorRepository.save({ ...operator });
  }

  async updateData(data){
    const userId = data.userId;
    const operator = await this.operatorRepository.findOne({
      where: { userId }
    });

    operator.brief = data.brief;
    operator.aboutMe = data.aboutMe;
    operator.goals = data.goals;
    return await this.operatorRepository.save(operator);

  }

}