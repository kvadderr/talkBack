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
export class Withdrawals extends AppEntity {

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
    status: string;

    @ApiProperty()
    @Column({
        nullable: true,
        type: 'numeric', 
        precision: 10, 
        scale: 2 
    })
    balance: number;

}