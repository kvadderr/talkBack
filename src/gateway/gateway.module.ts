import { forwardRef, Module } from '@nestjs/common';
import { MyGateway } from './gateway';
import { CallModule } from '../call/call.module'

@Module({
    imports: [
        forwardRef(() => CallModule),
      ],
    providers: [MyGateway],
})
export class GatewayModule {}