import { forwardRef, Module } from '@nestjs/common';
import { CallService } from './call.service';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
    imports: [
        forwardRef(() => GatewayModule),
    ],
    providers: [CallService],
})
export class CallModule {}