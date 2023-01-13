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
import { Client } from './client.model';
import { ClientService } from './client.service';

@ApiTags('Client')
@Controller('client')
export class ClientController {
  constructor(private clientService: ClientService) {}

  @ApiOperation({ summary: 'Get all client' })
  @ApiResponse({ status: 200, type: [Client] })
  @Get()
  getAllClient() {
    return this.clientService.getAllClient();
  }

}