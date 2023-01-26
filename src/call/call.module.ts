import { forwardRef, Module } from '@nestjs/common';
import { CallService } from './call.service';
import { GatewayModule } from '../gateway/gateway.module';
import { Call } from './call.model';
import { CallController } from './call.controller';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
    imports: [
        TypeOrmModule.forFeature([Call]),
        forwardRef(() => GatewayModule),
    ],
    providers: [CallService],
    controllers: [CallController],
    exports: [CallService, CallModule],
})
export class CallModule {}