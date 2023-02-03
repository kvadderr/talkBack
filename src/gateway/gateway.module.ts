import { forwardRef, Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { CallModule } from '../call/call.module'
import { UserModule } from '../user/user.module'
import { TrafficModule } from '../traffic/traffic.module'

@Module({
    imports: [
        forwardRef(() => CallModule),
        forwardRef(() => UserModule),
        forwardRef(() => TrafficModule),
      ],
    providers: [MyGateway],
    exports: [GatewayModule],
})
export class GatewayModule {}