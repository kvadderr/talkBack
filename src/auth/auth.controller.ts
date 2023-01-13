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

  @ApiOperation({ summary: 'Авторизация' })
  @ApiBody({ type: CreateUserDto })
  @ApiResponse({ status: 200, type: CreateUserDto })
  @Post('/signin')
  async signin(
    @Body() data,
    @Headers() headers: Record<string, string>,
  ) {
    return await this.authService.login(
        data,
    );
  }

}