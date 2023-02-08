import { forwardRef, Module } from '@nestjs/common';
import { WithdrawalsService } from './withdrawals.service';
import { WithdrawalsController } from './withdrawals.controller';
import { Withdrawals } from './withdrawals.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module'


@Module({
  imports: [
    TypeOrmModule.forFeature([Withdrawals]),
    forwardRef(() => UserModule),
  ],
  providers: [WithdrawalsService],
  controllers: [WithdrawalsController],
  exports: [WithdrawalsService, WithdrawalsModule],
})
export class WithdrawalsModule {}
