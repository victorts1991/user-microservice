## Description

A user microservice with Node.js, Nest.js, TypeORM, Kubernetes, CI/CD, unit and e2e tests. [Under construction]

## Installation

```bash
$ npm install
```

## Postgres

Install docker and run the command:

```bash
docker run --name user-microservice-db -e POSTGRES_PASSWORD=123456 -e POSTGRES_DB=user-microservice-db -p 5432:5432 -d postgres
```

## Enviroment Variables

Change the file name .env.sample for .env

## Running the app

```bash
# development
$ npm run start

# watch mode
$ npm run start:dev

# production mode
$ npm run start:prod
```

## Test

```bash
# unit tests with coverage report
$ npm run test:unit:cov

# e2e tests
$ npm run test:e2e
```

## Docker Compose

None of the above steps are necessary, just the command below:

```bash
$ docker compose up --build
```

Note: If you are running on Windows and get any errors, run your CLI as administrator.

## Swagger

After running the application, access the following url: http://localhost:3000/api

## Steps to deploy in the Cloud with Github Actions

1. Vincule este projeto no Sonar Cloud:
```
https://sonarcloud.io/
```
2. Acesse seu projeto no Sonar Cloud e vá até o menu Administration->Analisys Method e desmarque a opção "Automatic Analysis";
3. Depois vá até o menu Administration->Update Key e copie o valor de Project Key;
4. No menu Account que está no canto superior direito com a foto de seu usuário, acesse o menu My Organizations e copie o valor da Organization Key;
5. Depois novamente no menu Account, acesse My Account->Security, crie um novo token e copie o seu valor;
6. Voltando até a plataforma do Github, acesse o menu "Settings" do projeto, na tela que se abrir, clique no menu Security->Secrets and variables->Actions e cadastre novas "repository secret" conforme explicado abaixo:
```
SONAR_PROJECT_KEY=Valor copiado no passo 3
SONAR_ORGANIZATION=Valor copiado no passo 4
SONAR_TOKEN=Valor copiado no passo 5
```
7. Faça o login na plataforma da AWS;
8. Acesse IAM->Usuários e crie um novo usuário chamado Github;
9. Com esse usuário criado, vá até a listagem de usuários e acesse os detalhes do mesmo;
10. No menu Permissões que irá aparecer na tela de detalhes, clique no botão "Adicionar permissões" que aparece no canto direito e selecione a opção "Criar política em linha";
11. No combo de serviços do formulário que será aberto, selecione a opção EC2, marque a opção "Todas as ações do EC2 (ec2:\*)" que irá aparecer, e em Recursos marque a opção "Tudo", logo abaixo irá aparecer um botão "Adicionar mais permissões", clique nele e repita o mesmo processo que fez com o EC2 para os seguintes serviços: EKS, IAM e CloudWatch Logs;
12. Após avançar, defina um nome e clique em "Criar política";
13. Após isso, ainda no menu de Permissões, clique em "Adicionar permissões" mais um vez, porém dessa vez, selecione a opção "Adicionar permissões" ao invés de "Criar política em linha";
14. Na tela que irá aparecer, selecione a opção "Anexar políticas diretamente";
15. Pesquise pela permissão "AmazonEC2ContainerRegistryPowerUser" e adicione ela;
16. Após isso, de volta a tela de detalhes do usuário, clique na aba "Credenciais de Segurança", e no bloco "Chaves de acesso", clique em "Criar chave de acesso";
17. Na tela que irá se abrir, selecione a opção "Command Line Interface (CLI)" e clique em próximo;
18. No valor da etiqueta, coloque o valor "github actions" ou qualquer um que prefira para identificar posteriormente;
19. Copie os valores dos campos "Chave de acesso" e "Chave de acesso secreta" e clique no botão "Concluído";
20. Voltando até a plataforma do Github, acesse o menu "Settings" do projeto, na tela que se abrir, clique no menu Security->Secrets and variables->Actions;
21. Adicione uma "repository secret" chamada AWS_ACCESS_KEY_ID com o valor copiado de "Chave de acesso", e crie outra "repository secret" chamada AWS_SECRET_ACCESS_KEY com o valor copiado de "Chave de acesso secreta";



...

## TODO:

- add github actions (kubernetes(GCP - GKE), docker push(GCP - 
ARTIFACT REGISTRY), e2e tests);
- update README.md with steps for configuration in AWS;
- add endpoint login with return token JWT;
- add endpoints with auth (details, changedata, delete);
