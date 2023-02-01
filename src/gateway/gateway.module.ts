import { forwardRef, Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { CallModule } from '../call/call.module'
import { UserModule } from '../user/user.module'

@Module({
    imports: [
        forwardRef(() => CallModule),
        forwardRef(() => UserModule),
      ],
    providers: [MyGateway],
    exports: [GatewayModule],
})
export class GatewayModule {}