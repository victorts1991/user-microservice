import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { DeleteTestMassController } from './delete-test-mass.controller';
import { UserService } from './user.service';
import { UserEntity } from './user.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { jwtConstants } from './constants';

@Module({
  imports: [
    TypeOrmModule.forFeature([UserEntity]),
    JwtModule.register({
      global: true,
      secret: jwtConstants.secret,
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [UserController, DeleteTestMassController],
  providers: [UserService],
})
export class UserModule {}
