import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { In, Repository } from 'typeorm';

import { Review } from './review.model';

@Injectable()
export class ReviewService {
  constructor(
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
  ) {}

  async getReviewByOperator(operatorId: number) {
    return this.reviewRepository.find({
        where: {
            operatorId
        },
        relations: ['client'],
    });
  }

  async getRating(operatorId: number) {
    return this.reviewRepository
        .createQueryBuilder("review")
        .select("AVG(review.grade)", "AVG")
        .getRawOne(); 
  }

}