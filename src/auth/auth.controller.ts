import {
    Body,
    Controller,
    Get,
    HttpException,
    Patch,
    Post,
    Query,
    Req,
    Res,
    UseGuards,
    Headers,
    Param,
  } from '@nestjs/common';
import { ApiBody, ApiResponse, ApiTags, ApiOperation } from '@nestjs/swagger';
import { Response, Request } from 'express';
import { AuthService } from './auth.service'

import { CreateUserDto } from '../user/dto/create-user.dto';

@ApiTags('Authorization')
@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @ApiOperation({ summary: 'Регистрация' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/signup')
  async signup(
    @Body() data,
    @Headers() headers: Record<string, string>,
  ) {
    return await this.authService.signup(
        data,
    );
  }

  @ApiOperation({ summary: 'Get me' })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Get('/me')
  getAllClient(@Req() request: Request) {
    return this.authService.getMe(request);
  }

  @ApiOperation({ summary: 'Авторизация' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/signin')
  async signin(
    @Body() data,
    @Res({passthrough: true}) response: Response,
    @Headers() headers: Record<string, string>,
  ) {
    return await this.authService.login(
        data, response
    );
  }

  @ApiOperation({ summary: 'Сброс пароля' })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/restorePassword')
  async restore(
    @Body() data
  ) {
    return await this.authService.restorePassword(
        data
    );
  }

  @ApiOperation({ summary: 'Отправка кода подтверждения' })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/sendCode')
  async sendCode(
    @Body() data
  ) {
    return await this.authService.sendConfirmCodeEmail(
        data.userId
    );
  }

  @ApiOperation({ summary: 'Подтверждение кода подтверждения' })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/confirm')
  async comfirmMail(
    @Body() data
  ) {
    return await this.authService.confirmProfile(
        data
    );
  }

  @ApiOperation({ summary: 'Подтверждение кода подтверждения' })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/updateBaseData')
  async updateBaseData(
    @Body() data
  ) {
    return await this.authService.updateBaseData(
        data
    );
  }

  @ApiOperation({ summary: 'Подтверждение кода подтверждения' })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/ban')
  async banUser(
    @Body() data
  ) {
    return await this.authService.banUser(
        data
    );
  }

}