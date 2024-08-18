import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class UpdateUserDTO {

  @ApiProperty()
  @IsNotEmpty({ message: 'O nome não pode ser vazio.' })
  name: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'O e-mail não pode ser vazio.' })
  @IsEmail(undefined, { message: 'O e-mail informado é inválido.' })
  email: string;
}
