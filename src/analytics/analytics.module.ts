import { forwardRef, Module } from '@nestjs/common';
import { AnalyticsService } from './analytics.service';
import { GatewayModule } from '../gateway/gateway.module';
import { AnalyticsController } from './analytics.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [],
    providers: [AnalyticsService],
    controllers: [AnalyticsController],
    exports: [AnalyticsService, AnalyticsModule],
})
export class AnalyticsModule {}