import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  NotFoundException,
} from '@nestjs/common';
import { Serialize } from 'src/interceptors/serialize.interceptor';
import { CreateUserDto } from './dtos/createUser.dto';
import { UserDto } from './dtos/user.dto';
import { UsersService } from './users.service';

@Controller('auth')
@Serialize(UserDto)
export class UsersController {
  constructor(private usersService: UsersService) {}

  @Post('/signup')
  signup(@Body() body: CreateUserDto) {
    this.usersService.create(body);
  }

  @Get('/:id')
  async findUser(@Param('id') id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Get()
  async findByEmail(@Query('email') email: string) {
    const user = await this.usersService.find(email);

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Patch('/:id')
  updateUser(@Param('id') id: number, @Body() body: Partial<CreateUserDto>) {
    return this.usersService.update(id, body);
  }

  @Delete('/:id')
  deleteUser(@Param('id') id: number) {
    return this.usersService.remove(id);
  }
}
