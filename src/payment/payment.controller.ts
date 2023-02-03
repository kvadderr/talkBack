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
import { PaymentService } from './payment.service';

@ApiTags('Payment')
@Controller('payment')
export class PaymentController {
  constructor(private paymentService: PaymentService) {}

  @ApiOperation({ summary: "Get link for pay" })
  @ApiResponse({ status: 200 })
  @Post('/')
  getLink(@Body() data) {
    console.log(data);
    return this.paymentService.generateLink(data);
  }


  @ApiOperation({ summary: "Confirm pay" })
  @ApiResponse({ status: 200 })
  @Post('/success')
  postBank(@Body() data) {
    console.log(data);
    return this.paymentService.postBank(data);
  }
  
}