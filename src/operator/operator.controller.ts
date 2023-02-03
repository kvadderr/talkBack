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
  async getAllOperator() {
    return await this.operatorService.getAllOperator();
  }

  @ApiOperation({ summary: 'Get all operator' })
  @ApiResponse({ status: 200, type: [Operator] })
  @Get('/top')
  async getTopOperator() {
    return await this.operatorService.getTopOperator();
  }

  @ApiOperation({ summary: 'Update operator data' })
  @ApiResponse({ status: 200, type: [Operator] })
  @Put()
  async updateOperator(@Body() data) {
    return await this.operatorService.updateData(data);
  }

  @ApiOperation({ summary: 'Update operator data' })
  @ApiResponse({ status: 200, type: [Operator] })
  @Post()
  async saveOperator(@Body() data) {
    console.log(data);
    return await this.operatorService.createOperator(data.editingOperator);
  }

}