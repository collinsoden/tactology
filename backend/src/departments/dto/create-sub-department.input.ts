import { InputType, Field } from '@nestjs/graphql';
import { IsString, MinLength } from 'class-validator';

@InputType()
export class CreateSubDepartmentInput {
  @Field()
  @IsString()
  @MinLength(2)
  name!: string;
}
