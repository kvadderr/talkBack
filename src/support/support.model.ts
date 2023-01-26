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
export class Support extends AppEntity {

    @ApiProperty({
        type: () => User,
    })
    @ManyToOne(() => User)
    @JoinColumn()
    user: User;

    @ApiProperty()
    @Column()
    userId: number;

    @ApiProperty()
    @Column()
    message: string;

}