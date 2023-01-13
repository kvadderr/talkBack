import {
    Entity,
    Column,
    OneToMany,
    DeleteDateColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne
} from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../user/user.model'

@Entity()
export class Operator extends AppEntity {
    @ApiProperty()
    @Column({
        default: 0
    })
    balance: number;

    @ApiProperty()
    @Column({
        default: 0
    })
    price: number;

    @ApiProperty()
    @Column({
        default: 0
    })
    percent: number;

    @ApiProperty({
        type: () => User,
    })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;

}