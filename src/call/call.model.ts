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
export class Call extends AppEntity {

    @ApiProperty({
        type: () => User,
    })
    @ManyToOne(() => User)
    @JoinColumn()
    operator: User;

    @ApiProperty()
    @Column()
    operatorId: number;

    @ApiProperty({
        type: () => User,
    })
    @ManyToOne(() => User)
    @JoinColumn()
    client: User;

    @ApiProperty()
    @Column()
    clientId: number;

    @ApiProperty()
    @Column()
    duration: number;

    @ApiProperty()
    @Column({
        default: 0,
        type: 'numeric', 
        precision: 10, 
        scale: 2 })
    cost: number;

    @ApiProperty()
    @Column({
        default: 0,
        type: 'numeric', 
        precision: 10, 
        scale: 2})
    companyCost: number;

}