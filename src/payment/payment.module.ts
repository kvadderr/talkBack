import { forwardRef, Module } from '@nestjs/common';
import { PaymentService } from './payment.service';
import { PaymentController } from './payment.controller';
import { Payment } from './payment.model';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserModule } from '../user/user.module'

@Module({
    imports: [
        TypeOrmModule.forFeature([Payment]),
        forwardRef(() => UserModule),
    ],
    providers: [PaymentService],
    controllers: [PaymentController],
    exports: [PaymentService, PaymentModule],
})
export class PaymentModule {}