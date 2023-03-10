import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { User } from './user.model';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { RoleType } from '../role/role.model'

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(User) private userRepository: Repository<User>,
    ) {}

    async create(user: User) {

        const userSaved = await this.userRepository.save(user);

        if (!userSaved) {
          throw new HttpException(
            { message: 'Ошибка при создании пользователя' },
            HttpStatus.BAD_REQUEST,
          );
        }
    
        return userSaved;
    }

    async getAll() {
        const users = await this.userRepository.find();
    
        if (!users) {
          throw new HttpException('Цели не найдены', HttpStatus.NOT_FOUND);
        }
    
        return users;
    }

    async getUserByEmail(login: string) {

      const user = await this.userRepository.findOne({
        where: { login }
      });

      return user;

    }

    async getUserByEmailAndPass(login: string) {

      const user = await this.userRepository.findOne({
        where: { login},
      });

      return user;

    }

    async updateAvatar(data){
      const id = data.userId;
      const user = await this.userRepository.findOne({
        where: { id }
      });
  
      user.avatar = data.filename;
      return await this.userRepository.save(user);
  
    }

    async getMe(id: number) {

      const user = await this.userRepository.findOne({
        where: { id },
      });

      return user;

    }

    async populateBalance(id: number, newBalance: number) {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      console.log(user.balance);
      console.log(newBalance);
      user.balance = +user.balance + +newBalance;
      return await this.userRepository.save(user);
    }

    async minusBalance(id: number, newBalance: number) {
      const user = await this.userRepository.findOne({
        where: { id },
      });

      user.balance = +user.balance - +newBalance;
      return await this.userRepository.save(user);
    }

}