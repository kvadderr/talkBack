import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    UseGuards,
    UseInterceptors,
    Res,
    UploadedFile
  } from '@nestjs/common';
  import { FileInterceptor } from '@nestjs/platform-express';
  import { diskStorage } from 'multer';
  import { extname } from 'path';
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

    @ApiOperation({ summary: 'Get me info' })
    @ApiResponse({ status: 200, type: User })
    @Get('/:id')
    getMe(@Param('id') id: number) {
        return this.userService.getMe(id);
    }

    @ApiOperation({ summary: 'Обновление аватара пользователя' })
    @ApiResponse({ status: 200 })
    @Post('/updateAvatar')
    async updateAvatar(
        @Body() data
    ) {
        return await this.userService.updateAvatar(
            data
        );
    }

    @ApiOperation({ summary: 'Обновление аватара пользователя' })
    @ApiResponse({ status: 200 })
    @Post('/populate')
    populate(@Body() data) {
        return this.userService.populateBalance(
            data.id, data.balance
        );
    }

    @ApiOperation({ summary: 'uploadPhoto' })
    @ApiResponse({ status: 200 })
    @Post('/uploadPhoto')
    @UseInterceptors(FileInterceptor('image', {
        storage: diskStorage({
            destination: './uploads',
            filename: (req, file, callback) => {
            console.log('filenamess');
            const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
            const ext = extname(file.originalname);
            const filename = `${uniqueSuffix}${ext}`;
            callback(null, filename);
            },
        }),
    }))
    upload(@UploadedFile() file) {
        const fileName = file.filename;
        console.log(fileName);
        return {fileName};
    }

    

}