import {
    Body,
    Controller,
    Get,
    HttpException,
    Param,
    Put,
    Delete,
    Post,
    UseGuards,
    Query
  } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Favorite } from './favorite.model';
import { FavoriteService } from './favorite.service';

@ApiTags('Favorite')
@Controller('favorite')
export class FavoriteController {
  constructor(private favoriteService: FavoriteService) {}

  @ApiOperation({ summary: "Get favorite list" })
  @ApiResponse({ status: 200, type: Favorite })
  @Get('/:userId')
  getOperatorReview(@Param('userId') userId: number) {
    return this.favoriteService.getFavorite(userId);
  }

  @ApiOperation({ summary: "Add favorite" })
  @ApiResponse({ status: 200, type: Favorite })
  @Post()
  addFavorite(@Body() data) {
    return this.favoriteService.addToFavorite(data);
  }

  @ApiOperation({ summary: "Delete favorite" })
  @ApiResponse({ status: 200, type: Favorite })
  @Delete()
  deleteFavorite(@Body() data) {
    return this.favoriteService.deleteFromFavorite(data.userId, data.operatorId);
  }

}