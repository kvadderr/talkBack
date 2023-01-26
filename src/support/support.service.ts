import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Support } from './support.model';

@Injectable()
export class SupportService {
  constructor(
    @InjectRepository(Support)
    private supportRepository: Repository<Support>,
  ) {}

  async create(support: Support) {
    const addReview = await this.supportRepository.save(support);
    if (!addReview) return;
    return addReview;
  }

  async getSupportMessage() {
    return this.supportRepository.find({
        relations: ['user'],
    });
  }


}