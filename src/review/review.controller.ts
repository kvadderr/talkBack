import {
    Body,
    Controller,
    Get,
    HttpException,
    Param,
    Put,
    UseGuards,
    Query,
    Post
  } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Review } from './review.model';
import { ReviewService } from './review.service';

@ApiTags('Review')
@Controller('review')
export class ReviewController {
  constructor(private reviewService: ReviewService) {}

  @ApiOperation({ summary: "Get operator's review" })
  @ApiResponse({ status: 200, type: Review })
  @Get('/:operatorId')
  getOperatorReview(@Param('operatorId') operatorId: number) {
    return this.reviewService.getReviewByOperator(operatorId);
  }

  @ApiOperation({ summary: "Get operator's grade" })
  @ApiResponse({ status: 200, type: Review })
  @Get('/grade/:operatorId')
  getOperatorGrade(@Param('operatorId') operatorId: number) {
    return this.reviewService.getRating(operatorId);
  }

  @ApiOperation({ summary: "Add review" })
  @ApiResponse({ status: 200, type: Review })
  @Post()
  addFavorite(@Body() data) {
    return this.reviewService.create(data);
  }

}