import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users.entity';

@Injectable()
export class UsersService {
  constructor(@InjectRepository(User) private repo: Repository<User>) {}

  create(data: { email: string; username?: string; password: string }) {
    const user = this.repo.create({
      ...data,
    });

    return this.repo.save(user);
  }

  findOne(id: number) {
    return this.repo.findOne({
      where: { id },
    });
  }

  find(email: string) {
    return this.repo.find({ where: { email } });
  }

  async update(id: number, data: Partial<User>) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    Object.assign(user, data);

    return this.repo.save(user);
  }

  async remove(id: number) {
    const user = await this.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return this.repo.remove(user);
  }
}
