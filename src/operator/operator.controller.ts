import {
    Body,
    Controller,
    Get,
    HttpException,
    Param,
    Put,
    UseGuards,
  } from '@nestjs/common';
  import { ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';

import { User } from '../user/user.model';
import { Operator } from './operator.model';
import { OperatorService } from './operator.service';

@ApiTags('Operator')
@Controller('operator')
export class OperatorController {
  constructor(private operatorService: OperatorService) {}

  @ApiOperation({ summary: 'Get all operator' })
  @ApiResponse({ status: 200, type: [Operator] })
  @Get()
  getAllOperator() {
    return this.operatorService.getAllOperator();
  }

}