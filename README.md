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

## Steps to deploy in the AWS with Github Actions

## 1. SonarQube:

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

## 2. Create an user in AWS and configurate your secret keys for the Github Actions:

1. Faça o login na plataforma da AWS;
2. Acesse IAM->Usuários e crie um novo usuário chamado Github;
3. Com esse usuário criado, vá até a listagem de usuários e acesse os detalhes do mesmo;
4. No menu Permissões que irá aparecer na tela de detalhes, clique no botão "Adicionar permissões" que aparece no canto direito e selecione a opção "Criar política em linha";
5. No combo de serviços do formulário que será aberto, selecione a opção EC2, marque a opção "Todas as ações do EC2 (ec2:\*)" que irá aparecer, e em Recursos marque a opção "Tudo", logo abaixo irá aparecer um botão "Adicionar mais permissões", clique nele e repita o mesmo processo que fez com o EC2 para os seguintes serviços: EKS, IAM, CloudFormation e CloudWatch Logs;
6. Após avançar, defina um nome e clique em "Criar política";
7. Após isso, ainda no menu de Permissões, clique em "Adicionar permissões" mais um vez, porém dessa vez, selecione a opção "Adicionar permissões" ao invés de "Criar política em linha";
8. Na tela que irá aparecer, selecione a opção "Anexar políticas diretamente";
9. Pesquise pela permissão "AmazonEC2ContainerRegistryPowerUser" e adicione ela;
10. Após isso, de volta a tela de detalhes do usuário, clique na aba "Credenciais de Segurança", e no bloco "Chaves de acesso", clique em "Criar chave de acesso";
12. Na tela que irá se abrir, selecione a opção "Command Line Interface (CLI)" e clique em próximo;
13. No valor da etiqueta, coloque o valor "github actions" ou qualquer um que prefira para identificar posteriormente;
14. Copie os valores dos campos "Chave de acesso" e "Chave de acesso secreta" e clique no botão "Concluído";
15. Voltando até a plataforma do Github, acesse o menu "Settings" do projeto, na tela que se abrir, clique no menu Security->Secrets and variables->Actions;
16. Adicione uma "repository secret" chamada AWS_ACCESS_KEY_ID com o valor copiado de "Chave de acesso", crie outra "repository secret" chamada AWS_SECRET_ACCESS_KEY com o valor copiado de "Chave de acesso secreta", e crie uma última chamada AWS_REGION com a região na qual está criando toda a sua infraestrutura, por exemplo: "us-east-2";

## 3. Create a private repository in ECR:

1. Retornando a plataforma da AWS, vá até o menu ECR;
2. Crie um repositório privado chamado user-microservice-container;

## 4. Create a database in RDS:

1. Ainda na plataforma da AWS, vá até o menu RDS;
2. Clique na opção "Banco de Dados" do menu lateral e em seguida no botão "Criar banco de dados";
3. Selecione o banco de dados PostgreSQL;
4. Em modelos selecione o Nível Gratuito caso esteja apenas testando;
5. Em Configurações, digite o nome "user-microservice-db" no campo "Identificador da instância de banco de dados";
6. Em Senha principal digite uma senha segura e deixe a mesma anotada em um bloco de notas por enquanto;
7. Depois disse clique no botão "Criar banco de dados";
8. Após a criação do banco de dados ser concluída, na listagem dos banco de dados clique no banco de dados que você acabou de criar;
9. Na tela de detalhes que se abriu, na sessão "Segurança e conexão" copie o valor do Endpoint, será algo semelhante ao valor "user-microservice-db.cbqgeakk0utc.us-east-2.rds.amazonaws.com";
10. Em seu computador, acesse o seu terminal e digite os comandos abaixo com o endpoint e senha do seu banco de dados:
```
//Endpoint
echo -n 'user-microservice-db.cbqgeakk0utc.us-east-2.rds.amazonaws.com' | base64
//OUTPUT: dXNlci1taWNyb3NlcnZpY2UtZGIuY2JxZ2Vha2swdXRjLnVzLWVhc3QtMi5yZHMuYW1hem9uYXdzLmNvbQ==

//Senha
echo -n '"12345678"' | base64
//OUTPUT: IjEyMzQ1Njc4Ig==
```
11. Com os valores de saída, volte até a plataforma do Github, acesse o menu "Settings" do projeto, na tela que se abrir, clique no menu Security->Secrets and variables->Actions;
12. Adicione uma "repository secret" chamada DB_HOST com o valor da saída do endpoint, e crie outra "repository secret" chamada DB_PASS com o valor da saída da senha;

## 5. Create a Cluster Kubernetes in EKS:

1. Em seu computador instale o CLI da AWS e eksctl através dos links abaixo:
```
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
https://eksctl.io/installation/
```
2. Execute os seguintes comandos em seu terminal:
```
//este comando irá pedir a Chave de acesso e a Chave de acesso secreta, além da região na qual você está criando a sua infraestrutura
aws configure

//criação do cluster Kubernetes, este pode levar um tempo para ser concluído
eksctl create cluster --name  user-microservice-cluster --region us-east-2 --node-type m5.2xlarge --nodes 2

//configuração do kubernetes
aws eks update-kubeconfig --name user-microservice-cluster --region=us-east-2
```

## 6. Consume the microservices

1. Qualquer commit feito na branch main irá iniciar o pipeline que irá subir a api para a AWS;
2. Após o pipeline ser concluído, vá até o terminal em seu computador e digite o seguinte comando:
```
kubectl get svc
```
3. Copie o valor de EXTERNAL-IP do serviço user-microservice-svc, será algo semelhante a "ae94c4e3875c64fc1b2fabcf6db21b0c-1072296997.us-east-2.elb.amazonaws.com";

...

## TODO:

- add github actions (kubernetes(GCP - GKE), docker push(AWS - 
ECR), e2e tests);
- add endpoint login with return token JWT;
- add endpoints with auth (details, changedata, delete);
