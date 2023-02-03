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

@Entity()
export class Payment extends AppEntity {

    @ApiProperty()
    @Column({
        nullable: true
    })
    order_id: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    user_id: number;

    @ApiProperty()
    @Column({
        nullable: true
    })
    payment: number;

    @ApiProperty()
    @Column({
        nullable: true,
        type: 'numeric', 
        precision: 10, 
        scale: 2 
    })
    amount: number;
  
    @ApiProperty()
    @Column({
        nullable: true,
        type: 'numeric', 
        precision: 10, 
        scale: 2 
    })
    amount_crypto: number;

    @ApiProperty()
    @Column({
        nullable: true
    })
    currency: string;

    @ApiProperty()
    @Column({
        nullable: true
    })
    status: string;

}