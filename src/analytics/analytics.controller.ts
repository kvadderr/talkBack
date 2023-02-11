import {
    Body,
    Controller,
    Get,
    HttpException,
    Param,
    Put,
    Delete,
    Post,
    UseGuards,
    Query
  } from '@nestjs/common';

import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import { AnalyticsService } from './analytics.service';

@ApiTags('Analytics')
@Controller('analytics')
export class AnalyticsController {
  constructor(private analyticsService: AnalyticsService) {}

  @ApiOperation({ summary: "Get call history by operator" })
  @ApiResponse({ status: 200 })
  @Get('/example/:startDay/:endDay')
  getOperatorReview(@Param('startDay') startDay: string, @Param('endDay') endDay: string) {
    return this.analyticsService.mainAnalytics(startDay, endDay);
  }

  @ApiOperation({ summary: "Get call history by operator" })
  @ApiResponse({ status: 200 })
  @Get('/client/:startDay/:endDay')
  getClientAnal(@Param('startDay') startDay: string, @Param('endDay') endDay: string) {
    return this.analyticsService.getClientAnal(startDay, endDay);
  }

  @ApiOperation({ summary: "Get call history by operator" })
  @ApiResponse({ status: 200 })
  @Get('/operator/:startDay/:endDay')
  getOperatorAnal(@Param('startDay') startDay: string, @Param('endDay') endDay: string) {
    return this.analyticsService.getOperatorAnal(startDay, endDay);
  }

  @ApiOperation({ summary: "Get call history by operator" })
  @ApiResponse({ status: 200 })
  @Get('/traffic/operator/:startDay')
  getOperatorTraffic(@Param('startDay') startDay: string) {
    return this.analyticsService.getTrafficAnal(startDay, 'OPERATOR');
  }

  @ApiOperation({ summary: "Get call history by operator" })
  @ApiResponse({ status: 200 })
  @Get('/traffic/client/:startDay')
  getClientTraffic(@Param('startDay') startDay: string) {
    return this.analyticsService.getTrafficAnal(startDay, 'CLIENT');
  }

  @ApiOperation({ summary: "Get call history by operator" })
  @ApiResponse({ status: 200 })
  @Get('/operatorStat/:operatorId')
  getOperatorStat(@Param('operatorId') operatorId: number) {
    console.log('operatorId', operatorId);
    return this.analyticsService.getOperatorStat(operatorId);
  }
 

}