import { forwardRef, Module } from '@nestjs/common';
import { JwtModule } from "@nestjs/jwt";
import { UserModule } from '../user/user.module';
import { ClientModule } from '../client/client.module';
import { OperatorModule } from '../operator/operator.module';
import { MailModule } from '../mailer/mail.module';
import { FavoriteModule } from '../favorite/favorite.module';
import { CallModule } from '../call/call.module';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
  
@Module({
    imports: [
      forwardRef(() => UserModule),
      forwardRef(() => JwtModule),
      forwardRef(() => ClientModule),
      forwardRef(() => OperatorModule),
      forwardRef(() => MailModule),
      forwardRef(() => FavoriteModule),
      forwardRef(() => CallModule),
    ],
    providers: [AuthService],
    controllers: [AuthController],
    exports: [AuthService],
  })
  export class AuthModule {}