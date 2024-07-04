import { Test } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { CreateUserDTO } from './dto/CreateUserDTO';
import { UserEntity } from './user.entity';
import { TypeOrmModule, getRepositoryToken } from '@nestjs/typeorm';
import { PostgresConfigService } from '../config/postgres.config.service';
import { ConfigModule } from '@nestjs/config';
import { plainToInstance } from 'class-transformer';
import { validateSync } from 'class-validator';
import { TypeORMError } from 'typeorm';
import { CanActivate, HttpException } from '@nestjs/common';
import { log } from 'console';
import { JwtService } from '@nestjs/jwt';
import { UserGuard } from './user.guard';
import { createRequest } from 'node-mocks-http';

describe('User', () => {
    let userController: UserController;
    let userService: UserService;

    const mockUserEntityRepository= {
        save: jest.fn(),
        find: jest.fn(),
        findOne: jest.fn(),
        delete: jest.fn(),
    };

    const mockGuard: CanActivate = { canActivate: jest.fn(() => true) };

    beforeEach(async () => {
        const moduleRef = await Test.createTestingModule({
            imports: [],
            controllers: [UserController],
            providers: [
                UserService,
                {
                    provide: getRepositoryToken(UserEntity),
                    useValue: mockUserEntityRepository,
                },
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
            ],
        })
        .overrideGuard(UserGuard)
        .useValue(mockGuard)
        .compile();

        userService = moduleRef.get<UserService>(UserService);
        userController = moduleRef.get<UserController>(UserController);
    });
  
    it('should be valid with valid properties', () => {
       
        const validateSync1 = getValidateSync(CreateUserDTO, {
            email: null,
            password: null,
            name: null,
        });
        expect(validateSync1).toHaveLength(3);
        expect(validateSync1.filter((value) => value.property === 'name' && value.constraints.isNotEmpty === 'O nome não pode ser vazio.'))
            .toHaveLength(1);
        expect(validateSync1.filter((value) => value.property === 'email' && value.constraints.isNotEmpty === 'O e-mail não pode ser vazio.'))
            .toHaveLength(1);
        expect(validateSync1.filter((value) => value.property === 'password' && value.constraints.isNotEmpty === 'A senha não pode ser vazia.'))
            .toHaveLength(1);

        const validateSync2 = getValidateSync(CreateUserDTO, {
            email: "usergmailcom",
            password: '12345',
            name: 'Fulano da Silva',
        });
        expect(validateSync2).toHaveLength(2);
        expect(validateSync2.filter((value) => value.property === 'password' && value.constraints.minLength === 'A senha precisa ter pelo menos 6 caracteres.'))
            .toHaveLength(1);
        expect(validateSync2.filter((value) => value.property === 'email' && value.constraints.isEmail === 'O e-mail informado é inválido.'))
            .toHaveLength(1);

        const validateSync3 = getValidateSync(CreateUserDTO, {
            email: "user@gmail.com",
            password: '123456',
            name: 'Fulano da Silva',
        });
        expect(validateSync3).toHaveLength(0);
    });

    it('should validate if the email is duplicate', async () => {
        const userEntity = new UserEntity();
        userEntity.email = "user@gmail.com";
        userEntity.password ="123456";
        userEntity.name = 'Fulano da Silva';
        
        jest.spyOn(userService, 'createUser').mockImplementation(() => {
            throw new TypeORMError('duplicate key value violates unique constraint');
        });

        const userData: CreateUserDTO = new CreateUserDTO()
        userData.email = userEntity.email
        userData.password = userEntity.password
        userData.name = userEntity.name

        try {
            await userController.createUser(userData)
        }catch(error) {
            //log(error.response)
            expect(error.response.status).toEqual(400);
            expect(error.response.message).toEqual([ 'Já existe outro usuário com este e-mail.' ]);
        }
    })

    it('should return an object with user created and a sucess message', async () => {
        const userEntity = new UserEntity();
        userEntity.email = "user@gmail.com";
        userEntity.password ="123456";
        userEntity.name = 'Fulano da Silva';
        
        jest.spyOn(userService, 'createUser' as never).mockImplementation(() => userEntity as never);

        const userData: CreateUserDTO = new CreateUserDTO()
        userData.email = userEntity.email
        userData.password = userEntity.password
        userData.name = userEntity.name

        expect(await userController.createUser(userData)).toStrictEqual({
            user: userEntity,
            message: 'Usuário criado com sucesso.',
        });
    });

    it('should return an object with an access_token', async () => {
        let signInResult = {
            access_token: "abc"
        }

        jest.spyOn(userService, 'signIn' as never).mockImplementation(() => signInResult as never);

        let signInDto = {
            email: 'fulano@gmail.com',
            password: '123456'
        }

        expect(await userController.signIn(signInDto)).toEqual(signInResult);
    });

    /*it('should return an object with an user data', async () => {
        
        

        const mockRequest = createRequest({
            method: 'GET',
            url: '/user',
            headers: {
                authorization: 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjFjY2VmNmU0LWViZjctNDAwNC1hYWFiLTI0Nzg1MjgzN2ZlMiIsIm5hbWUiOiJGdWxhbm8gZGEgU2lsdmEiLCJlbWFpbCI6InVzZXJAZ21haWwuY29tIiwiaWF0IjoxNzIwMDgyMzgzLCJleHAiOjE3MjAwODU5ODN9._zbQICz2PC8rhj40ExwN6g1hh8KEwgM32DnsEwPOOPI'
            }
        });

        let response = await userController.getData(mockRequest)

        expect(response.name).toEqual("Fulano da Silva");
    });*/
  
});


function getValidateSync(dto, object){
    const dtoObject = plainToInstance(dto, object);
    return validateSync(dtoObject);
}