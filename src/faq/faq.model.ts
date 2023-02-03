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
export class FAQ extends AppEntity {

    @ApiProperty()
    @Column()
    title: string;

    @ApiProperty()
    @Column()
    detail: string;
    
}