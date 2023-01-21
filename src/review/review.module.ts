import { forwardRef, Module } from '@nestjs/common';
import { ReviewService } from './review.service';
import { ReviewController } from './review.controller';
import { Review } from './review.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Review]),
  ],
  providers: [ReviewService],
  controllers: [ReviewController],
  exports: [ReviewService, ReviewModule]
})
export class ReviewModule {}
