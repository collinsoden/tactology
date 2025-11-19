import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { ObjectType, Field, ID } from '@nestjs/graphql';
import { Department } from './department.entity';

@ObjectType()
@Entity()
export class SubDepartment {
  @Field(() => ID)
  @PrimaryGeneratedColumn()
  id!: number;

  @Field()
  @Column({ length: 255 })
  name!: string;

  @ManyToOne(() => Department, (dept) => dept.subDepartments, {
    onDelete: 'CASCADE',
  })
  department!: Department;
}
