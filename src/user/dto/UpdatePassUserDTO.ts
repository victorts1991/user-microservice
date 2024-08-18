import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, MinLength } from 'class-validator';

export class UpdatePassUserDTO {

  @ApiProperty()
  @IsNotEmpty({ message: 'A senha atual não pode ser vazia.' })
  oldPassword: string;

  @ApiProperty()
  @IsNotEmpty({ message: 'A nova senha não pode ser vazia.' })
  @MinLength(6, { message: 'A nova senha precisa ter pelo menos 6 caracteres.' })
  newPassword: string;
}
