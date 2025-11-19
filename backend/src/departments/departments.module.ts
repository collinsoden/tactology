import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Department } from './department.entity';
import { SubDepartment } from './sub-department.entity';
import { DepartmentsService } from './departments.service';
import { DepartmentsResolver } from './departments.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([Department, SubDepartment])],
  providers: [DepartmentsService, DepartmentsResolver],
})
export class DepartmentsModule {}
