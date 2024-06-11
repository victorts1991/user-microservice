import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class CreateUserDTO {

  @ApiProperty()
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  @IsEmail(undefined, { message: 'O e-mail informado é inválido.' })
  email: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'A senha não pode ser vazia.' })
  @MinLength(6, { message: 'A senha precisa ter pelo menos 6 caracteres.' })
  password: string;
}
