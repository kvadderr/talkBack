import { forwardRef, Module } from '@nestjs/common';
import { ClientService } from './client.service';
import { ClientController } from './client.controller';
import { Client } from './client.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../user/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Client, User]),
    forwardRef(() => UserModule),
  ],
  providers: [ClientService],
  controllers: [ClientController],
  exports: [ClientService, ClientModule],
})
export class ClientModule {}
