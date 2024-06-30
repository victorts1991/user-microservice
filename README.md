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
2. Clique em "Painel" e depois na opção "Grupos de parâmetros";
3. Clique no botão "Criar grupo de parâmetros";
4. Atribua um nome e descrição, no combo "Tipo de mecanismo" selecione "PostgreSQL", em "Família de grupos de parâmetros" selecione a última versão do PostgreSQL disponível e clique em "Criar";
5. Após isso acesse os detalhes do Grupo de parâmetros criado e clique em "Editar";
6. Filtre o parâmetro "rds.force_ssl" e altere o valor de 1 para 0;
7. Após isso clique no botão "Salvar alterações", vá no menu lateral "Banco de dados" e em seguida no botão "Criar banco de dados";
9. Selecione o banco de dados PostgreSQL;
10. Em modelos selecione a opção "Produção";
11. Em "Disponibilidade e durabilidade" selecione a opção "Instância de banco de dados única";
12. Em Configurações, digite o nome "usermicroservicedb" no campo "Identificador da instância de banco de dados";
13. Em "Gerenciamento de credenciais" selecione "Autogerenciada" e defina uma senha, deixe a mesma anotada em um bloco de notas por enquanto;
14. Em "Conectividade" no campo "Nuvem privada virtual (VPC)", selecione a opção "Criar nova VPC";
15. Deixe o campo "Acesso público" marcado como "Sim";
16. Em "Grupo de segurança de VPC (firewall)" selecione a opção "Criar novo" e em "Novo nome do grupo de segurança da VPC" digite "usermicroservicedb-sg";
17. No bloco "Configuração adicional" clique para expandir e coloque o "Nome do banco de dados inicial" como "usermicroservicedb" também;
18. Ainda em "Configuração adicional" selecione o "Grupo de parâmetros do banco de dados" criado no passo 7;
19. Depois disso clique no botão "Criar banco de dados";
20. Após a criação do banco de dados ser concluída, na listagem dos banco de dados clique no banco de dados que você acabou de criar;
21. Clique no "Grupos de segurança da VPC";
22. Na tela que se abriu clique no check do item que aparece da listagem;
23. No conteúdo carregado abaixo clique na aba "Regras de entrada" e em seguida no botão "Editar regras de entrada";
24. Na tela que se abriu clique no botão "Adicionar regra", na linha que apareceu selecione "Todo o tráfego" em "Tipo" e em "Blocos CIDR" selecione a opção "0.0.0.0/0";
25. Clique no botão "Salvar regras" e volte aos detalhes do banco de dados que você criou;
26. Na tela de detalhes que se abriu, na sessão "Segurança e conexão" copie o valor do Endpoint, será algo semelhante ao valor "usermicroservicedb.cbqgeakk0utc.us-east-2.rds.amazonaws.com";
27. Em seu computador, acesse o seu terminal e digite os comandos abaixo com o endpoint e senha do seu banco de dados:
```
//Endpoint
echo -n 'usermicroservicedb.cbqgeakk0utc.us-east-2.rds.amazonaws.com' | base64
//OUTPUT: dXNlcm1pY3Jvc2VydmljZWRiLmNicWdlYWtrMHV0Yy51cy1lYXN0LTIucmRzLmFtYXpvbmF3cy5jb20=

//Senha
echo -n '123mudar' | base64
//OUTPUT: MTIzbXVkYXI=
```
28. Com os valores de saída, volte até a plataforma do Github, acesse o menu "Settings" do projeto, na tela que se abrir, clique no menu Security->Secrets and variables->Actions;
29. Adicione uma "repository secret" chamada DB_HOST com o valor da saída do endpoint, e crie outra "repository secret" chamada DB_PASS com o valor da saída da senha;

## 5. Create a Cluster Kubernetes in EKS:

1. Na AWS vá até o menu IAM e clique no menu lateral "Funções";
2. Clique no botão "Criar perfil";
3. Em "Tipo de entidade confiável" selecione o item "Política de confiança personalizada" copie o código abaixo e cole em "Política de confiança personalizada":
```
{
    "Version": "2012-10-17",
    "Statement": [
        {
            "Sid": "EKSNodeAssumeRole",
            "Effect": "Allow",
            "Principal": {
                "Service": "ec2.amazonaws.com"
            },
            "Action": "sts:AssumeRole"
        }
    ]
}
```
4. Depois clique no botão "Próximo", e na tela que se abriu, pesquise e adicione as seguintes permissões: AmazonEC2ContainerRegistryReadOnly, AmazonEKS_CNI_Policy e AmazonEKSWorkerNodePolicy, após isso clique no botão "Próximo";
5. Em "Nome da função" digite o nome "role-create-node" ou algum outro que preferir, após isso clique no botão "Criar perfil";
6. Crie uma nova função com o mesmo "Tipo de entidade confiável" selecionando o item "Política de confiança personalizada", copie o código abaixo e cole em "Política de confiança personalizada":
```
{
	"Version": "2012-10-17",
	"Statement": [
		{
			"Sid": "EKSClusterAssumeRole",
			"Effect": "Allow",
			"Principal": {
				"AWS": "arn:aws:iam::<ID da conta>:root",
				"Service": "eks.amazonaws.com"
			},
			"Action": "sts:AssumeRole"
		}
	]
}
```
7. Depois clique no botão "Próximo", e na tela que se abriu, pesquise e adicione as seguintes permissões: AmazonEKSClusterPolicy e AmazonEKSVPCResourceController, após isso clique no botão "Próximo";
8. Em "Nome da função" digite o nome "role-create-cluster" ou algum outro que preferir, após isso clique no botão "Criar perfil";
9. Após isso vá no menu EKS e clique em "Criar cluster";
10. Em "Nome" digite "user-microservice-cluster", e em "Função de serviço do cluster" selecione a função "role-create-cluster" criada no passo 8;
11. No bloco "Acesso ao cluster" deixe a opção "API do EKS e ConfigMap" e a "Permitir acesso de administrador do cluster" marcadas;
12. Vá avançando no formulário até chegar na última página e clicar no botão "Criar";
13. A criação do cluster poderá demorar alguns minutos, após a conclusão da criação acesse os detalhes do mesmo;
14. Clique na aba "Computação" e no bloco "Grupos de nós" clique no botão "Adicionar grupo de nós";
15. Defina o nome que preferir e em "Função do IAM do nó" selecione a função "role-create-node" criada no passo 5, após isso clique em "Próximo";
16. Avance nas demais telas até chegar na última e clicar no botão "Criar";
17. A criação do grupo de nós poderá demorar alguns minutos, você poderá acompanhar acessando os detalhes do cluster, na aba "Computação" e no bloco "Grupo de nós";
18. Após a criação do grupo de nós, ainda nos detalhes do cluster vá até a aba "Acesso" e no bloco "Entradas de acesso do IAM" clique no botão "Criar entrada de acesso";
19. No formulário que se abriu, selecione o usuário "Github" criado nos passos do step 2 no campo "ARN da entidade principal do IAM" e clique no botão "Próximo";
20. Em "Nome da política" selecione a opção "AmazonEKSClusterAdminPolicy" e clique no botão "Adicionar política", a seguir clique em "Próximo";
21. Na próxima tela clique no botão "Criar";
22. Após isso, caso o usuário root não esteja na lista de "Entradas de acesso do IAM", adicione ele com a política "AmazonEKSClusterAdminPolicy" da mesma forma que fez com o usuário anterior, porém ao invés de selecionar o mesmo no combo, apenas digite "arn:aws:iam::<ID da conta>:root" e clique na tecla "Enter", este usuário é necessário para que seja possível visualizar os Recursos do Kubernetes via interface posteriormente;
23. Com todos esses passos finalizados, qualquer commit feito na branch "main" irá acionar o pipeline e subir a infraestrutura na AWS;

## 6. For local kubernetes connection

- Execute os comandos abaixo em seu terminal:
```
//este comando irá pedir a Chave de acesso e a Chave de acesso secreta, além da região na qual você está criando a sua infraestrutura
aws configure

//configuração do kubernetes
aws eks update-kubeconfig --name user-microservice-cluster --region=us-east-2

kubectl get pods
```


## TODO:
- add endpoint login with return token JWT;
- add endpoints with auth (details, changedata, delete);
