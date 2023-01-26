import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Favorite } from './favorite.model';
import { User } from '../user/user.model';
import { UserService } from '../user/user.service'

@Injectable()
export class FavoriteService {
  constructor(
    @InjectRepository(Favorite)
    private favoriteRepository: Repository<Favorite>
  ) {}

  async getFavorite(userId: number) {
    return this.favoriteRepository.find({
      where: { userId },
      relations: ['operator', 'operator.user', 'operator.specialization'],
    });
  }

  async addToFavorite(favorite: Favorite) {
    const addFav = await this.favoriteRepository.save(favorite);

    if (!addFav) return;

    return addFav;

  }

  async deleteFromFavorite(userId: number, operatorId: number){
    const fav = await this.favoriteRepository.findOne({
      where: {
        userId,
        operatorId
      }
    })
    return this.favoriteRepository.remove(fav)
  }
  



}