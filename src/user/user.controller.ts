import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Request,
  UseGuards
} from '@nestjs/common';
import { CreateUserDTO } from './dto/CreateUserDTO';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { ApiBody } from '@nestjs/swagger';
import { UserGuard } from './user.guard';

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

  @ApiBody({ 
    description: "Authenticate user.",
    examples: {
        a: {
            summary: "Authenticate Fulano user",
            value: {
              email: 'user@gmail.com',
              password: '123456'
            }
        }
    }
  })
  @Post('auth')
  async signIn(@Body() signInDto: Record<string, any>) {
    return await this.userService.signIn(signInDto.email, signInDto.password);
  }

  @UseGuards(UserGuard)
  @Get()
  async getData(@Request() req) {
    const user = await this.userService.getUser(req.user.id);
    return {
      id: user.id,
      name: user.name,
      email: user.email
    }
  }
}
