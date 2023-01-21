import {
    Entity,
    Column,
    OneToMany,
    DeleteDateColumn,
    ManyToOne,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne
} from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../user/user.model'

@Entity()
export class Favorite extends AppEntity {

    @ApiProperty({
        type: () => User,
    })
    @ManyToOne(() => User, (user) => user.favorite)
    operator: User;

    @ApiProperty()
    @Column()
    operatorId: number;

    @ApiProperty()
    @Column()
    userId: number;

}