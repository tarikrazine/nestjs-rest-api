import { Injectable, NotFoundException } from '@nestjs/common';
import { scrypt as _scrypt, randomBytes } from 'crypto';
import { promisify } from 'util';

import { UsersService } from './users.service';

const scrypt = promisify(_scrypt);

@Injectable()
export class AuthService {
  constructor(private usersService: UsersService) {}

  async signup({
    username,
    email,
    password,
  }: {
    username?: string;
    email: string;
    password: string;
  }) {
    const user = await this.usersService.find(email);

    if (user.length) {
      throw new NotFoundException('User already exists');
    }

    const salt = randomBytes(8).toString('hex');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const result = `${salt}.${hash.toString('hex')}`;

    const newUser = await this.usersService.create({
      email,
      username: username && username,
      password: result,
    });

    return newUser;
  }

  async signin({ email, password }: { email: string; password: string }) {
    const [user] = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    const [salt, storedHash] = user.password.split('.');

    const hash = (await scrypt(password, salt, 32)) as Buffer;

    const isValid = hash.toString('hex') === storedHash;

    if (!isValid) {
      throw new NotFoundException('Invalid password');
    }

    return user;
  }
}
