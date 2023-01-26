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
import { Call } from './call.model';
import { CallService } from './call.service';

@ApiTags('Call')
@Controller('call')
export class CallController {
  constructor(private callService: CallService) {}

  @ApiOperation({ summary: "Get call history by operator" })
  @ApiResponse({ status: 200, type: Call })
  @Get('/operator/:operatorId')
  getOperatorReview(@Param('operatorId') operatorId: number) {
    return this.callService.getCallByOperator(operatorId);
  }

  @ApiOperation({ summary: "Get call history by client" })
  @ApiResponse({ status: 200, type: Call })
  @Get('/client/:clientId')
  getClientReview(@Param('clientId') clientId: number) {
    return this.callService.getCallByClient(clientId);
  }

  

}