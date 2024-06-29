import { HttpStatus } from "@nestjs/common";
import { log } from "console";

import * as request from "supertest";

describe("AuthController (e2e)", () => {
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
              email: 'user@gmail.com',
              password: '123456'
          })
          .expect((response: request.Response) => {
              expect(response.body.message).toEqual('Usuário criado com sucesso.')
          })
          .expect(HttpStatus.CREATED)
    });

    it("it should validate if the email is duplicate", () => {
      var agent = request(baseUrl);
      agent.post("/user")
        .set("Accept", "application/json")
        .send({
            name: 'Fulano da Silva',
            email: 'user@gmail.com',
            password: '123456'
        }).end(() => {
          agent.post("/user")
            .set("Accept", "application/json")
            .send({
                name: 'Fulano da Silva',
                email: 'user@gmail.com',
                password: '123456'
            }).end((err, res) => {
              //log(res.text)
              expect(JSON.parse(res.text).message.filter((value) => value === "Já existe outro usuário com este e-mail.").length).toEqual(1)
            });
        });
    });

  });
});
