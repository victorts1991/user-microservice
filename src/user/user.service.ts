import { Injectable, UnauthorizedException } from '@nestjs/common';
import { InjectRepository, } from '@nestjs/typeorm';
import { UserEntity } from './user.entity';
import { Repository, Like } from 'typeorm';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { log } from 'console';
import { UpdatePassUserDTO } from './dto/UpdatePassUserDTO';

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

    const user = this.userRepository.create({
      ...userEntity,
      password: hashPass
    })

    return await this.userRepository.save(user);
  }

  async updateUser(userEntity: UserEntity) {
    //Necessary for get the user password
    const user = await this.userRepository.findOneBy({ id: userEntity.id });
  
    let data = {
      ...userEntity,
      password: user.password
    }

    return await this.userRepository.save(data);
  }

  async updateUserPassword(id: string, userData: UpdatePassUserDTO) {

    const user = await this.userRepository.findOneBy({ id: id });
    const isMatch = await bcrypt.compare(userData.oldPassword, user?.password);

    if (!isMatch) {
      throw new Error('A senha atual não está correta.');
    }
    
    const hashPass = await bcrypt.hash(userData.newPassword, this.saltOrRounds)

    let data = {
      ...user,
      password: hashPass
    }

    return await this.userRepository.save(data);
  }  

  async signIn(email, password) {
    const user = await this.userRepository.findOne({ where: { email: email }})

    if(!user) {
      throw new UnauthorizedException();
    }

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

  async getUser(id: string) : Promise<UserEntity> {

    const user = await this.userRepository.findOneBy({ id: id });

    return user;
  }

  async deleteTestMass() {
    const testUsers = await this.userRepository
        .createQueryBuilder("users")
        .where("users.email like :email", { email:`%@gmailtest.com%`})
        .getMany()

    await this.userRepository.remove(testUsers);
  }

}