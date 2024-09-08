import {
  Body,
  Controller,
  Get,
  HttpException,
  HttpStatus,
  Post,
  Put,
  Request,
  UseGuards
} from '@nestjs/common';
import { CreateUserDTO } from './dto/CreateUserDTO';
import { UpdateUserDTO } from './dto/UpdateUserDTO';
import { UserEntity } from './user.entity';
import { UserService } from './user.service';
import { ApiBearerAuth, ApiBody } from '@nestjs/swagger';
import { UserGuard } from './user.guard';
import { UpdatePassUserDTO } from './dto/UpdatePassUserDTO';

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

    let userCreated: UserEntity  = null

    try{
      userCreated = await this.userService.createUser(userEntity)
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

    delete userCreated.password

    return {
      user: userCreated,
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

  @ApiBearerAuth('JWT-auth')
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

  @ApiBearerAuth('JWT-auth')
  @UseGuards(UserGuard)
  @Put()
  @ApiBody({ 
    type: UpdateUserDTO,
    description: "Update user data.",
    examples: {
        a: {
            summary: "Update Fulano user",
            value: {
              name: 'Fulano da Silva',
              email: 'user5@gmail.com'
            }
        }
    }
  })
  async updateData(@Request() req, @Body() userData: UpdateUserDTO) {

    const userEntity = new UserEntity();
    userEntity.id = req.user.id;
    userEntity.email = userData.email;
    userEntity.name = userData.name;

    try{
      await this.userService.updateUser(userEntity)
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
      message: 'Usuário atualizado com sucesso.'
    }
    
  }

  @ApiBearerAuth('JWT-auth')
  @UseGuards(UserGuard)
  @Put('password')
  @ApiBody({ 
    type: UpdatePassUserDTO,
    description: "Update user password.",
    examples: {
        a: {
            summary: "Update Fulano user password",
            value: {
              newPassword: '654321',
              oldPassword: '123456'
            }
        }
    }
  })
  async updatePassword(@Request() req, @Body() userData: UpdatePassUserDTO) {
    try{
      await this.userService.updateUserPassword(req.user.id, userData)
    }catch (error) {
      let message = error.message
      
      throw new HttpException({
        status: HttpStatus.BAD_REQUEST,
        message: [message],
      }, HttpStatus.BAD_REQUEST);
    }

    return {
      message: 'Senha atualizado com sucesso.'
    }
  }

}
