import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
  } from '@nestjs/common';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
  import { UserService } from './user.service';
  import { User } from './user.model'

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(private readonly userService: UserService) {}

    @ApiOperation({ summary: 'Get all user' })
    @ApiResponse({ status: 200, type: User })
    @Get()
    getUsers() {
        return this.userService.getAll();
    }

}