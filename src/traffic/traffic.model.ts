import {
    Entity,
    Column,
    OneToMany,
    DeleteDateColumn,
    ManyToMany,
    PrimaryGeneratedColumn,
    JoinColumn,
    OneToOne,
    ManyToOne
} from 'typeorm';

import { AppEntity } from '../base/BaseEntity';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

import { User } from '../user/user.model'

@Entity()
export class Traffic extends AppEntity {

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
    duration: number;

}