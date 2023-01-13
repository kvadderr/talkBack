import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsPhoneNumber,
  IsString,
  IsUUID,
  Length,
  Matches,
} from 'class-validator';

import { RoleType } from 'src/role/role.model';

export class CreateUserDto {
  @IsUUID()
  @IsOptional()
  readonly apiUserUuid?: string;

  @ApiProperty({ example: 'test@test.ru', description: 'User email address' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsEmail({}, { message: 'Некорректный email' })
  readonly email: string;

  @ApiProperty({ example: 'Niko', description: 'User name' })
  @IsNotEmpty({ message: 'Не должно быть пустым' })
  @IsString({ message: 'Должно быть строкой' })
  readonly FIO: string;

  @ApiProperty({ example: 'password123', description: 'User password' })
  readonly password?: string;

  @ApiPropertyOptional({
    example: 'ADMIN',
  })
  readonly role?: string;

  @ApiPropertyOptional({
    example: 1,
  })
  readonly clientId?: number;
}
