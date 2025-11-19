import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcryptjs';
import { User } from './user.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private readonly repo: Repository<User>) {}

  async findByUsername(username: string): Promise<User | null> {
    return this.repo.findOne({ where: { username } });
  }

  async seedDefaultUser() {
    const existing = await this.repo.findOne({ where: { username: 'admin' } });
    if (!existing) {
      const user = this.repo.create({
        username: 'admin',
        passwordHash: await bcrypt.hash('password', 10),
      });
      await this.repo.save(user);
      console.log('Seeded default admin user (admin/password)');
    }
  }
}
