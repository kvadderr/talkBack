import { forwardRef, Module } from '@nestjs/common';
import { FavoriteService } from './favorite.service';
import { FavoriteController } from './favorite.controller';
import { Favorite } from './favorite.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Favorite]),
  ],
  providers: [FavoriteService],
  controllers: [FavoriteController],
  exports: [FavoriteService, FavoriteModule]
})
export class FavoriteModule {}
