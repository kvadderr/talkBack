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
import { Specialization } from '../specialization/specialization.model'

@Entity()
export class Operator extends AppEntity {
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

    @ApiProperty()
    @Column({
        nullable: true
    })
    brief: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    aboutMe: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    goals: string;

    @ApiProperty({
        type: () => User,
    })
    @OneToOne(() => User)
    @JoinColumn()
    user: User;

    @ApiProperty({
        type: () => Specialization,
    })
    @ManyToOne(() => Specialization)
    @JoinColumn()
    specialization?: Specialization[];

    @ApiProperty()
    @Column()
    userId: number;
}