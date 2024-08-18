import { HttpStatus } from "@nestjs/common";
import { log } from "console";

import * as request from "supertest";

describe("UserController (e2e)", () => {
  
  const baseUrl = process.env.USER_MICROSERVICE_URL ? process.env.USER_MICROSERVICE_URL : `http://localhost:3000`

  describe("/user (POST)", () => {
    
    it("it should return errors for name, email and password empty", () => {
      return request(baseUrl)
        .post("/user")
        .set("Accept", "application/json")
        .send({
            name: null,
            email: null,
            password: null
        })
        .expect((response: request.Response) => {
            expect(response.body.message.filter((value) => value === "O nome não pode ser vazio.").length).toEqual(1)
            expect(response.body.message.filter((value) => value === "O e-mail não pode ser vazio.").length).toEqual(1)
            expect(response.body.message.filter((value) => value === "A senha não pode ser vazia.").length).toEqual(1)
        })
        .expect(HttpStatus.BAD_REQUEST)
    });

    it("should return errors for invalid email and password less than 6 characters", () => {
        return request(baseUrl)
          .post("/user")
          .set("Accept", "application/json")
          .send({
              name: 'Fulano da Silva',
              email: 'usergmailcom',
              password: '12345'
          })
          .expect((response: request.Response) => {
              expect(response.body.message.filter((value) => value === "O e-mail informado é inválido.").length).toEqual(1)
              expect(response.body.message.filter((value) => value === "A senha precisa ter pelo menos 6 caracteres.").length).toEqual(1)
          })
          .expect(HttpStatus.BAD_REQUEST)
    });

    it("it should register a user and return the new user object", () => {
        return request(baseUrl)
          .post("/user")
          .set("Accept", "application/json")
          .send({
              name: 'Fulano da Silva',
              email: 'user1@gmailtest.com',
              password: '123456'
          })
          .expect((response: request.Response) => {
              expect(response.body.message).toEqual('Usuário criado com sucesso.')
          })
          .expect(HttpStatus.CREATED)
    });

    it("it should validate if the email is duplicate", async () => {
      await request(baseUrl).post("/user")
        .set("Accept", "application/json")
        .send({
            name: 'Fulano da Silva',
            email: 'user2@gmailtest.com',
            password: '123456'
        })
        

      return request(baseUrl).post("/user")
        .set("Accept", "application/json")
        .send({
            name: 'Fulano da Silva',
            email: 'user2@gmailtest.com',
            password: '123456'
        }).expect((response: request.Response) => {
          
          expect(response.body.message.filter((value) => value === "Já existe outro usuário com este e-mail.").length).toEqual(1)
          
        });
        
      
    });

    it("it should return 401", () => {
      
      return request(baseUrl).post("/user/auth")
        .set("Accept", "application/json")
        .send({
            email: 'user2@gmailtest.com',
            password: '123'
        }).expect(HttpStatus.UNAUTHORIZED)
        
    });

    it("it should return a token", () => {
      
      return request(baseUrl).post("/user/auth")
        .set("Accept", "application/json")
        .send({
            email: 'user2@gmailtest.com',
            password: '123456'
        }).expect((response: request.Response) => {
          expect(response.body).toHaveProperty("access_token")
        });
        
    });

    it("it should return a user details", async () => {
      const res = await request(baseUrl).post("/user/auth")
        .set("Accept", "application/json")
        .send({
            email: 'user2@gmailtest.com',
            password: '123456'
        })

      const token = res.body.access_token
      //log('*******::::::::' + token)
        
      return request(baseUrl).get("/user")
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .expect((response: request.Response) => {
            expect(response.body).toHaveProperty("name")
            expect(response.body.name).toEqual("Fulano da Silva")
          });
    });

    it("it should return errors for name, email empty in update user", async () => {

      const res = await request(baseUrl).post("/user/auth")
        .set("Accept", "application/json")
        .send({
            email: 'user2@gmailtest.com',
            password: '123456'
        })
      const token = res.body.access_token        
        
      return request(baseUrl).put("/user")
        .set("Accept", "application/json")
        .set("Authorization", "Bearer " + token)
        .send({
          name: null,
          email: null,
        })
        .expect((response: request.Response) => {
          expect(response.body.message.filter((value) => value === "O nome não pode ser vazio.").length).toEqual(1)
          expect(response.body.message.filter((value) => value === "O e-mail não pode ser vazio.").length).toEqual(1)
        });
        
    });

    it("it should update a user and return the user object", async () => {
      
      const res = await request(baseUrl).post("/user/auth")
        .set("Accept", "application/json")
        .send({
            email: 'user2@gmailtest.com',
            password: '123456'
        })
        const token = res.body.access_token    

        return request(baseUrl).put("/user")
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .send({
            name: 'Fulano da Silva',
            email: 'user5@gmailtest.com',
          })
          .expect((response: request.Response) => {
            expect(response.body.message).toEqual('Usuário atualizado com sucesso.')
          });
      
    });

    it("it should validate if the email is duplicate in update user", async () => {

      //create user with another email
      const res = await request(baseUrl)
        .post("/user")
        .set("Accept", "application/json")
        .send({
            name: 'Fulano da Silva Segundo',
            email: 'user222@gmailtest.com',
            password: '123456'
        })
      
      const res2 = await request(baseUrl).post("/user/auth")
        .set("Accept", "application/json")
        .send({
            email: 'user5@gmailtest.com',
            password: '123456'
        })
      const token = res2.body.access_token 

      return request(baseUrl).put("/user")
          .set("Accept", "application/json")
          .set("Authorization", "Bearer " + token)
          .send({
            name: 'Fulano da Silva',
            email: 'user222@gmailtest.com',
          })
          .expect((response: request.Response) => {
            //log(response)
            expect(response.body.message.filter((value) => value === "Já existe outro usuário com este e-mail.").length).toEqual(1)
          });
        
      
    });

    afterAll(() => {
      return request(baseUrl)
        .get("/user/delete-test-mass")
        .set("Accept", "application/json")
    })
  });
});
