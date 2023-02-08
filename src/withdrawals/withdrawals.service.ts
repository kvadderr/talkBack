import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';
import { Withdrawals } from './withdrawals.model'

import { UserService } from '../user/user.service';

@Injectable()
export class WithdrawalsService {
  constructor(
    @InjectRepository(Withdrawals)
    private withdrawalsRepository: Repository<Withdrawals>,
    private userService: UserService,
  ) {}

    async getAll() {
        return this.withdrawalsRepository.find();
    }

    async getActual(status: string) {
        return this.withdrawalsRepository.find({
            where: {status},
            relations: ['user']
        });
    }

    async create(withdrawals) {
        if (withdrawals.status === 'FAILED') withdrawals.balance = 0;
        if (withdrawals.status === 'SUCCESS') {
            console.log('succ');
            await this.userService.minusBalance(withdrawals.user_id, withdrawals.balance);
        }
        return await this.withdrawalsRepository.save(withdrawals);
    }

}