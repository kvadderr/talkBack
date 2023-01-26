import {
    Body,
    Controller,
    Get,
    HttpException,
    Param,
    Put,
    UseGuards,
    Query,
    Post
  } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { Support } from './support.model';
import { SupportService } from './support.service';

@ApiTags('Support')
@Controller('support')
export class SupportController {
  constructor(private supportService: SupportService) {}

  @ApiOperation({ summary: "Add support msg" })
  @ApiResponse({ status: 200, type: Support })
  @Post()
  createMessage(@Body() data) {
    return this.supportService.create(data);
  }

  @ApiOperation({ summary: "Get all support msg" })
  @ApiResponse({ status: 200, type: Support })
  @Get()
  getMessage() {
    return this.supportService.getSupportMessage();
  }

}