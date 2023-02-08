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

import { WithdrawalsService } from './withdrawals.service';
import { Withdrawals } from './withdrawals.model';

@ApiTags('Withdrawals')
@Controller('withdrawals')
export class WithdrawalsController {
  constructor(private withdrawalsService: WithdrawalsService) {}

  @ApiOperation({ summary: 'Get all traffic' })
  @ApiResponse({ status: 200, type: [Withdrawals] })
  @Get()
  async getAllTraffic() {
    return await this.withdrawalsService.getAll();
  }

  @ApiOperation({ summary: 'Get all traffic' })
  @ApiResponse({ status: 200, type: [Withdrawals] })
  @Get('/actual')
  async getActual() {
    return await this.withdrawalsService.getActual('PROCESS');
  }

  @ApiOperation({ summary: 'Get all traffic' })
  @ApiResponse({ status: 200, type: [Withdrawals] })
  @Post()
  async create(@Body() data) {
    return await this.withdrawalsService.create(data);
  }

}