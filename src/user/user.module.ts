import { forwardRef, Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { User } from './user.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ClientModule } from '../client/client.module';
import { GatewayModule } from '../gateway/gateway.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]),
    forwardRef(() => ClientModule),
    forwardRef(() => GatewayModule),
  ],
  providers: [UserService],
  controllers: [UserController],
  exports: [UserService, UserModule]
})
export class UserModule {}
