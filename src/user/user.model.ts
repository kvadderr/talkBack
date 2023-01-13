import {
    Entity,
    Column,
    OneToMany,
    DeleteDateColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
} from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

@Entity()
export class User extends AppEntity {
    @ApiProperty()
    @Column()
    login: string;

    @ApiProperty()
    @Column()
    password: string;

    @ApiProperty()
    @Column()
    FIO: string;

    @ApiProperty()
    @Column()
    role: string;

    @ApiProperty()
    @Column()
    avatar: string;

    @ApiProperty()
    @Column({
        type: Boolean,
        default: false
    })
    isBanned: boolean;

    @ApiProperty()
    @Column({
        nullable: true
    })
    banCause: string;

}