import { InputType, Field, ID } from '@nestjs/graphql';
import { IsInt, Min, IsString, MinLength } from 'class-validator';

@InputType()
export class UpdateDepartmentInput {
  @Field(() => ID)
  @IsInt()
  @Min(1)
  id!: number;

  @Field()
  @IsString()
  @MinLength(2)
  name!: string;
}
