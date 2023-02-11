import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { MailerModule } from '@nestjs-modules/mailer';
import { MulterModule } from '@nestjs/platform-express';
import { ServeStaticModule } from '@nestjs/serve-static';
import { JwtModule } from "@nestjs/jwt";

import * as path from 'path';

import { Client } from './client/client.model'
import { User } from './user/user.model'
import { Operator } from './operator/operator.model'
import { Review } from './review/review.model'
import { Favorite } from './favorite/favorite.model'
import { Specialization } from './specialization/specialization.model'
import { Call } from './call/call.model'
import { Support } from './support/support.model'
import { FAQ } from './faq/faq.model'
import { Traffic } from './traffic/traffic.model'
import { Payment } from './payment/payment.model'
import { Withdrawals } from './withdrawals/withdrawals.model'

import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ClientModule } from './client/client.module'
import { OperatorModule } from './operator/operator.module'
import { GatewayModule } from './gateway/gateway.module'
import { CallModule } from './call/call.module'
import { ReviewModule } from './review/review.module'
import { FavoriteModule } from './favorite/favorite.module'
import { MailModule } from './mailer/mail.module'
import { SupportModule } from './support/support.module'
import { FAQModule } from './faq/faq.module'
import { TrafficModule } from './traffic/traffic.module'
import { PaymentModule } from './payment/payment.module'
import { AnalyticsModule } from './analytics/analytics.module'
import { WithdrawalsModule } from './withdrawals/withdrawals.module'

import { join } from 'path';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
    }),
    MulterModule.register({
      dest: './uploads'
    }),
    ServeStaticModule.forRoot({
      rootPath: join(__dirname, '..', 'uploads'), 
    }),
    MailerModule.forRoot({
      transport: {
        service: process.env.MAILER_SERVICE,
        auth: {
          user: process.env.MAILER_USER,
          pass: process.env.MAILER_PASSWORD,
        },
      },
    }),
    JwtModule.register({
      secret: 'secret',
      signOptions: {expiresIn: '1d'}
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      database: process.env.POSTGRES_DB,
      host: process.env.POSTGRES_HOST,
      port: +process.env.POSTGRES_PORT,
      username: process.env.POSTGRES_USER,
      password: process.env.POSTGRESS_PASSWORD,
      synchronize: true,
      migrationsRun: true, 
      entities: [
        Client,
        User,
        Operator,
        Review,
        Favorite,
        Specialization,
        Call,
        Support,
        Traffic,
        FAQ,
        Payment,
        Withdrawals
      ],
      subscribers: ['dist/subscriber/*.js'],
      migrations: ['dist/migration/*.js'],
    }),

    UserModule,
    AuthModule,
    ClientModule,
    OperatorModule,
    GatewayModule,
    CallModule,
    ReviewModule,
    FavoriteModule,
    MailModule,
    SupportModule,
    FAQModule,
    TrafficModule,
    PaymentModule,
    AnalyticsModule,
    WithdrawalsModule
  ],
  providers: [AppModule],
})

export class AppModule {}