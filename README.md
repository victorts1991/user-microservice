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
7. Para facilitar o exemplo deixe o campo "Acesso público" marcado como "Sim";
8. Depois disse clique no botão "Criar banco de dados";
9. Após a criação do banco de dados ser concluída, na listagem dos banco de dados clique no banco de dados que você acabou de criar;
10. Na tela de detalhes que se abriu, na sessão "Segurança e conexão" copie o valor do Endpoint, será algo semelhante ao valor "user-microservice-db.cbqgeakk0utc.us-east-2.rds.amazonaws.com";
11. Em seu computador, acesse o seu terminal e digite os comandos abaixo com o endpoint e senha do seu banco de dados:
```
//Endpoint
echo -n 'user-microservice-db.cbqgeakk0utc.us-east-2.rds.amazonaws.com' | base64
//OUTPUT: dXNlci1taWNyb3NlcnZpY2UtZGIuY2JxZ2Vha2swdXRjLnVzLWVhc3QtMi5yZHMuYW1hem9uYXdzLmNvbQ==

//Senha
echo -n '123mudar' | base64
//OUTPUT: MTIzbXVkYXI=
```
11. Com os valores de saída, volte até a plataforma do Github, acesse o menu "Settings" do projeto, na tela que se abrir, clique no menu Security->Secrets and variables->Actions;
12. Adicione uma "repository secret" chamada DB_HOST com o valor da saída do endpoint, e crie outra "repository secret" chamada DB_PASS com o valor da saída da senha;

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
11. No bloco "Acesso ao cluster" deixe a opção "API do EKS e ConfigMap" e a "Permitir acesso de administrador do cluster" marcadas, após isso vá avançando no formulário até chegar na última página e clicar no botão "Criar";
12. A criação do cluster poderá demorar alguns minutos, após a conclusão da criação acesse os detalhes do mesmo;
13. Clique na aba "Computação" e no bloco "Grupos de nós" clique no botão "Adicionar grupo de nós";
14. Defina o nome que preferir e em "Função do IAM do nó" selecione a função "role-create-node" criada no passo 5, após isso clique em "Próximo";
15. Avance nas demais telas até chegar na última e clicar no botão "Criar";
16. A criação do grupo de nós poderá demorar alguns minutos, você poderá acompanhar acessando os detalhes do cluster, na aba "Computação" e no bloco "Grupo de nós";
17. Após a criação do grupo de nós, ainda nos detalhes do cluster vá até a aba "Acesso" e no bloco "Entradas de acesso do IAM" clique no botão "Criar entrada de acesso";
18. No formulário que se abriu, selecione o usuário "Github" criado nos passos do step 2 no campo "ARN da entidade principal do IAM" e clique no botão "Próximo";
19. Em "Nome da política" selecione a opção "AmazonEKSClusterAdminPolicy" e clique no botão "Adicionar política", a seguir clique em "Próximo";
20. Na próxima tela clique no botão "Criar";
21. Após isso adicione mais um usuário com a política "AmazonEKSClusterAdminPolicy", porém ao invés de selecionar o mesmo no combo, apenas digite "arn:aws:iam::<ID da conta>:root" e clique na tecla "Enter", este usuário é necessário para que seja possível visualizar os Recursos do Kubernetes via interface posteriormente;
22. Com todos esses passos finalizados, qualquer commit feito na branch "main" irá acionar o pipeline e subir a infraestrutura na AWS;




.......

///////////////////////RASCUNHO INICIO
    .......
19.
20.
21.
22.
23.
24. vá até sua máquina e instale as seguintes bibliotecas para ser possível utilizar a CLI da AWS e eksctl:
```
https://docs.aws.amazon.com/cli/latest/userguide/getting-started-install.html
https://eksctl.io/installation/
```
18. Após a instalação das bibliotecas descritas acima, digite os comandos abaixo em seu terminal:
```
//este comando irá pedir a Chave de acesso e a Chave de acesso secreta, além da região na qual você está criando a sua infraestrutura
aws configure

aws sts get-caller-identity
//a saída deverá ser algo semelhante a isso:
//{
//    "UserId": "AIDAQ3EGUMF3KUWZ2Q5OI",
//    "Account": "058264412534",
//    "Arn": "arn:aws:iam::058264412534:user/Github_Actions"
//}

//Copie o valor da propriedade UserId
```
19. Com a propriedade UserId copiada, retorne até o painel da AWS, vá no menu IAM e clique no menu lateral "Funcões";
20. Clique em "Criar perfil" e selecione o item "Conta da AWS" no bloco "Tipo de entidade confiável";
21. No bloco "Uma conta da AWS" selecione a opção "Outra conta da AWS" e cole o UserId no campo "ID da conta", após isso clique em "Próximo";
22. 


 
23.
24.
25.
26.
27.
28. qualquer commit na branch main irá iniciar o pipeline que levará a aplicação para a AWS;


....................


5. Execute os seguintes comandos em seu terminal:
```
//este comando irá pedir a Chave de acesso e a Chave de acesso secreta, além da região na qual você está criando a sua infraestrutura
aws configure

//criação do cluster Kubernetes, este pode levar um tempo para ser concluído
eksctl create cluster --name=user-microservice-cluster --region=us-east-2 --node-type=m5.2xlarge --nodes=2 --profile=default

//configuração do kubernetes
aws eks update-kubeconfig --name user-microservice-cluster --region=us-east-2
```



Obs: Caso ao executar o comando [eksctl create cluster...] você obtenha um erro e mesmo assim no painel da AWS o cluster estiver sendo criado, ainda será preciso verificar se após a criação do cluster o mesmo possuí 2 nós, caso não possua, crie esses nós com o comando abaixo:
```
eksctl create nodegroup --cluster=user-microservice-cluster [--name=user_microservice_cluster_node_one]
```

///////////////////////RASCUNHO FIM


## 6. Consume the microservices

1. Qualquer commit feito na branch main irá iniciar o pipeline que irá subir a api para a AWS;
2. Após o pipeline ser concluído, vá até o terminal em seu computador e digite o seguinte comando:
```
kubectl get svc
```
3. Copie o valor de EXTERNAL-IP do serviço user-microservice-svc, será algo semelhante a "ae94c4e3875c64fc1b2fabcf6db21b0c-1072296997.us-east-2.elb.amazonaws.com";

...

## TODO:
- Testar a subida;
- add github actions (e2e tests);
- add endpoint login with return token JWT;
- add endpoints with auth (details, changedata, delete);
