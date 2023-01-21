import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';

import * as path from 'path';

import { Client } from './client/client.model'
import { User } from './user/user.model'
import { Operator } from './operator/operator.model'
import { Review } from './review/review.model'
import { Favorite } from './favorite/favorite.model'

import { UserModule } from './user/user.module'
import { AuthModule } from './auth/auth.module'
import { ClientModule } from './client/client.module'
import { OperatorModule } from './operator/operator.module'
import { GatewayModule } from './gateway/gateway.module'
import { CallModule } from './call/call.module'
import { ReviewModule } from './review/review.module'

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      envFilePath: `.env`,
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
        Favorite
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
    ReviewModule
  ],
  providers: [AppModule],
})

export class AppModule {}