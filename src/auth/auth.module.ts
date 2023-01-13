import { forwardRef, Module } from '@nestjs/common';
import { UserModule } from '../user/user.module';
import { ClientModule } from '../client/client.module';
import { OperatorModule } from '../operator/operator.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';

@Module({
    imports: [
      forwardRef(() => UserModule),
      forwardRef(() => ClientModule),
      forwardRef(() => OperatorModule),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
  })
  export class AuthModule {}