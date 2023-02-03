import { forwardRef, Module } from '@nestjs/common';
import { FAQService } from './faq.service';
import { FAQController } from './faq.controller';
import { FAQ } from './faq.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([FAQ]),
  ],
  providers: [FAQService],
  controllers: [FAQController],
  exports: [FAQService, FAQModule],
})
export class FAQModule {}
