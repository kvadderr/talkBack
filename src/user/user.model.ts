import {
    Entity,
    Column,
    OneToMany,
    DeleteDateColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinColumn
} from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { Favorite } from '../favorite/favorite.model';

@Entity()
export class User extends AppEntity {
    @ApiProperty()
    @Column()
    login: string;

    @ApiProperty()
    @Column()
    password: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    isPassword: string;

    @ApiProperty()
    @Column()
    FIO: string;

    @ApiProperty()
    @Column()
    role: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    birth: number;

    @ApiProperty()
    @Column({
        default: 'https://as2.ftcdn.net/v2/jpg/04/10/43/77/1000_F_410437733_hdq4Q3QOH9uwh0mcqAhRFzOKfrCR24Ta.jpg'
    })
    avatar: string;

    @ApiProperty()
    @Column({
        default: 100,
        type: 'numeric', 
        precision: 10, 
        scale: 2 
    })
    balance: number;

    @ApiProperty()
    @Column({
        default: 0
    })
    isBanned: number;

    @ApiProperty()
    @Column({
        nullable: true
    })
    banCause: string;

    @OneToMany(() => Favorite, (favorite) => favorite.operator) 
    @JoinColumn({name: "userId"})
    favorite: Favorite[]

    @ApiProperty()
    @Column({
        default: false
    })
    isSuccessful: boolean;
}