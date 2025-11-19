import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength, ValidateNested, IsOptional } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubDepartmentInput } from './create-sub-department.input';

@InputType()
export class CreateDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name!: string;

  @Field(() => [CreateSubDepartmentInput], { nullable: true })
  @IsOptional()
  @ValidateNested({ each: true })
  @Type(() => CreateSubDepartmentInput)
  subDepartments?: CreateSubDepartmentInput[] | null;
}
