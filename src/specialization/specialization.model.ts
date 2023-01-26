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

import { Operator } from '../operator/operator.model'

@Entity()
export class Specialization extends AppEntity {

    @ApiProperty({
        type: () => Operator,
    })
    @ManyToOne(() => Operator, (operator) => operator.specialization)
    @JoinColumn()
    operator: Operator;

    @ApiProperty()
    @Column()
    operatorId: number;

    @ApiProperty()
    @Column()
    name: string;

}