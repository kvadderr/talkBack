import { forwardRef, Module } from '@nestjs/common';
import { OperatorService } from './operator.service';
import { OperatorController } from './operator.controller';
import { Operator } from './operator.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module';
import { User } from '../user/user.model';

@Module({
  imports: [
    TypeOrmModule.forFeature([Operator, User]),
    forwardRef(() => UserModule),
  ],
  providers: [OperatorService],
  controllers: [OperatorController],
  exports: [OperatorService, OperatorModule],
})
export class OperatorModule {}
