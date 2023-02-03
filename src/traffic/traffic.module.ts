import { forwardRef, Module } from '@nestjs/common';
import { TrafficService } from './traffic.service';
import { TrafficController } from './traffic.controller';
import { Traffic } from './traffic.model';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forFeature([Traffic]),
  ],
  providers: [TrafficService],
  controllers: [TrafficController],
  exports: [TrafficService, TrafficModule],
})
export class TrafficModule {}
