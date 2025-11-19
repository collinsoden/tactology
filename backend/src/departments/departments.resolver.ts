import {
  Resolver,
  Mutation,
  Args,
  Query,
  Int,
  ObjectType,
  Field,
} from '@nestjs/graphql';
import { UseGuards } from '@nestjs/common';
import { Department } from './department.entity';
import { DepartmentsService } from './departments.service';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { PaginationInput } from './dto/pagination.input';
import { GqlAuthGuard } from '../auth/jwt.guard';

@ObjectType()
class DepartmentMeta {
  @Field(() => Int)
  total!: number;

  @Field(() => Int)
  page!: number;

  @Field(() => Int)
  limit!: number;

  @Field(() => Int)
  totalPages!: number;
}

@ObjectType()
class DepartmentPagination {
  @Field(() => [Department])
  items!: Department[];

  @Field(() => DepartmentMeta)
  meta!: DepartmentMeta;
}

@Resolver(() => Department)
@UseGuards(GqlAuthGuard)
export class DepartmentsResolver {
  constructor(private readonly departmentsService: DepartmentsService) {}

  @Mutation(() => Department)
  async createDepartment(
    @Args('input') input: CreateDepartmentInput,
  ): Promise<Department> {
    return this.departmentsService.create(input);
  }

  @Query(() => DepartmentPagination)
  async getDepartments(
    @Args('pagination', { type: () => PaginationInput, nullable: true })
    pagination?: PaginationInput,
  ): Promise<DepartmentPagination> {
    return this.departmentsService.findAll(
      pagination || { page: 1, limit: 10 },
    );
  }

  @Mutation(() => Department)
  async updateDepartment(
    @Args('input') input: UpdateDepartmentInput,
  ): Promise<Department> {
    return this.departmentsService.update(input);
  }

  @Mutation(() => Boolean)
  async deleteDepartment(
    @Args('id', { type: () => Int }) id: number,
  ): Promise<boolean> {
    return this.departmentsService.delete(id);
  }
}
