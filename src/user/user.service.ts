import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class UserService {

  saltOrRounds: number = 10;

  constructor(
    @InjectRepository(UserEntity)
    private readonly userRepository: Repository<UserEntity>,
    private jwtService: JwtService
  ) {}

  async createUser(userEntity: UserEntity) {
    const hashPass = await bcrypt.hash(userEntity.password, this.saltOrRounds)
  
    let data = {
      ...userEntity,
      password: hashPass
    }

    await this.userRepository.save(data);
  }

  async signIn(email, password) {
    const user = await this.userRepository.findOneBy({ email: email });
    
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      throw new UnauthorizedException();
    }

    const payload = { 
      id: user.id, 
      name: user.name, 
      email: user.email 
    };

    return {
      access_token: await this.jwtService.signAsync(payload),
    };
  }
}