import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Department } from './department.entity';
import { SubDepartment } from './sub-department.entity';
import { CreateDepartmentInput } from './dto/create-department.input';
import { UpdateDepartmentInput } from './dto/update-department.input';
import { PaginationInput } from './dto/pagination.input';

@Injectable()
export class DepartmentsService {
  constructor(
    @InjectRepository(Department)
    private readonly deptRepo: Repository<Department>,
    @InjectRepository(SubDepartment)
    private readonly subRepo: Repository<SubDepartment>,
  ) {}

  async create(input: CreateDepartmentInput): Promise<Department> {
    const department = this.deptRepo.create({
      name: input.name,
      subDepartments:
        input.subDepartments?.map((s) =>
          this.subRepo.create({ name: s.name }),
        ) || [],
    });
    return this.deptRepo.save(department);
  }

  async findAll(pagination: PaginationInput) {
    const { page, limit } = pagination;
    const [items, total] = await this.deptRepo.findAndCount({
      relations: ['subDepartments'],
      skip: (page - 1) * limit,
      take: limit,
      order: { id: 'ASC' },
    });

    return {
      items,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async update(input: UpdateDepartmentInput): Promise<Department> {
    const department = await this.deptRepo.findOne({
      where: { id: input.id },
      relations: ['subDepartments'],
    });
    if (!department) throw new NotFoundException('Department not found');
    department.name = input.name;
    return this.deptRepo.save(department);
  }

  async delete(id: number): Promise<boolean> {
    const result = await this.deptRepo.delete(id);
    return (result.affected || 0) > 0;
  }
}
