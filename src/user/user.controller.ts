import {
  Body,
  Controller,
  Post,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/CreateUserDTO';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  async createUser(@Body() userData: CreateUserDTO) {
    const userEntity = new UserEntity();
    userEntity.email = userData.email;
    userEntity.password = userData.password;
    userEntity.name = userData.name;

    this.userService.createUser(userEntity);

    return {
      user: userEntity,
      messagem: 'Usuário criado com sucesso.',
    };
  }

}
