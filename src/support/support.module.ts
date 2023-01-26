import { forwardRef, Module } from '@nestjs/common';
import { SupportService } from './support.service';
import { SupportController } from './support.controller';
import { Support } from './support.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Support]),
  ],
  providers: [SupportService],
  controllers: [SupportController],
  exports: [SupportService, SupportModule]
})
export class SupportModule {}
