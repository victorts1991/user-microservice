import {
  Body,
  Controller,
  HttpException,
  HttpStatus,
  Post,
} from '@nestjs/common';
import { CreateUserDTO } from './dto/CreateUserDTO';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { ApiBody } from '@nestjs/swagger';

@Controller('/user')
export class UserController {
  constructor(private userService: UserService) {}

  @Post()
  @ApiBody({ 
    type: CreateUserDTO,
    description: "Create user.",
    examples: {
        a: {
            summary: "Create Fulano user",
            value: {
              name: 'Fulano da Silva',
              email: 'user@gmail.com',
              password: '123456'
            }
        }
    }
  })
  async createUser(@Body() userData: CreateUserDTO) {
    const userEntity = new UserEntity();
    userEntity.email = userData.email;
    userEntity.password = userData.password;
    userEntity.name = userData.name;

    try{
      await this.userService.createUser(userEntity)
    }catch (error) {
      let message = error.message
      if(message.indexOf('duplicate key value violates unique constraint') > -1) {
        message = 'Já existe outro usuário com este e-mail.'
      }
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: [message],
      }, HttpStatus.BAD_REQUEST);
    }

    return {
      user: userEntity,
      message: 'Usuário criado com sucesso.'
    }
    
  }

}
