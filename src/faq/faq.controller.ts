import {
    Body,
    Controller,
    Get,
    HttpException,
    Param,
    Put,
    UseGuards,
    Post
  } from '@nestjs/common';
import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { FAQService } from './faq.service';
import { FAQ } from './faq.model';

@ApiTags('FAQ')
@Controller('faq')
export class FAQController {
  constructor(private faqService: FAQService) {}

  @ApiOperation({ summary: 'Get all FAQ' })
  @ApiResponse({ status: 200, type: [FAQ] })
  @Get()
  async getAllOperator() {
    return await this.faqService.getAll();
  }

  @ApiOperation({ summary: 'Update FAQ data' })
  @ApiResponse({ status: 200, type: [FAQ] })
  @Post()
  async updateOperator(@Body() data) {
    return await this.faqService.create(data);
  }

}