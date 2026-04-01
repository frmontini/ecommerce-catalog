# E-commerce Catalog

Projeto de catálogo de produtos com autenticação, desenvolvido como teste técnico com **Laravel**, **React** e **MySQL**, com ambiente preparado para execução via **Docker**.

O backend foi estruturado em camadas, seguindo o padrão solicitado no desafio:

- **Controllers**
- **Services**
- **Repositories**
- **Resources / Collections**
- **Autenticação com Laravel Sanctum**

O frontend foi desenvolvido em **React + Vite**, com interface para:

- listagem de produtos
- busca por nome/descrição
- filtro por categoria
- paginação
- visualização de detalhes
- login e cadastro
- operações autenticadas de cadastro/edição/exclusão

---

## Repositório

```bash
git clone https://github.com/frmontini/ecommerce-catalog.git
cd ecommerce-catalog
```

---

## Estrutura do projeto

```text
ecommerce-catalog/
  api/        # Backend Laravel
  web/        # Frontend React + Vite
  docker/
    php/
      Dockerfile
  docker-compose.yml
  README.md
```

---

## Tecnologias utilizadas

### Backend
- PHP 8.3
- Laravel 13
- Laravel Sanctum
- MySQL 8

### Frontend
- React
- Vite

### Infraestrutura
- Docker
- Docker Compose

### Testes
- PHPUnit / Laravel Feature Tests

---

## Pré-requisitos

Para rodar o projeto, é necessário ter instalado na máquina:

- Docker
- Docker Compose

Não é necessário instalar PHP, Composer, Node ou MySQL localmente para executar a aplicação no ambiente containerizado.

---

## Como iniciar o projeto

### 1. Clonar o repositório

```bash
git clone https://github.com/frmontini/ecommerce-catalog.git
cd ecommerce-catalog
```

### 2. Criar o arquivo de ambiente do Laravel

```bash
cp api/.env.example api/.env
```

### 3. Subir os containers

```bash
docker compose up -d --build
```

Esse comando sobe:

- container do backend Laravel
- container do frontend React/Vite
- container do banco MySQL

Se quiser acompanhar os logs em tempo real:

```bash
docker compose logs -f
```

### 4. Gerar chave da aplicação

```bash
docker compose exec app php artisan key:generate
```

### 5. Rodar as migrations

```bash
docker compose exec app php artisan migrate
```

### 6. Popular o banco com dados iniciais

```bash
docker compose exec app php artisan db:seed
```

Se quiser recriar tudo do zero com banco já populado:

```bash
docker compose exec app php artisan migrate:fresh --seed
```

---

## Acesso à aplicação

### Frontend React
A interface fica disponível em:

```text
http://localhost:5173
```

### API Laravel
A API fica disponível em:

```text
http://localhost:8000
```

### Exemplos de endpoints públicos

```text
GET  /api/categories
GET  /api/products
GET  /api/products/{id}
POST /api/register
POST /api/login
```

### Exemplos de endpoints protegidos

```text
POST   /api/products
PUT    /api/products/{id}
DELETE /api/products/{id}

POST   /api/categories
PUT    /api/categories/{id}
DELETE /api/categories/{id}
```

As rotas protegidas utilizam autenticação com **Sanctum**.

---

## Fluxo recomendado para avaliação

Para colocar o projeto no ar com banco populado:

```bash
git clone https://github.com/frmontini/ecommerce-catalog.git
cd ecommerce-catalog
cp api/.env.example api/.env
docker compose up -d --build
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate:fresh --seed
```

Depois disso, basta acessar:

```text
Frontend: http://localhost:5173
API:      http://localhost:8000/api/products
```

---

## Comandos úteis do dia a dia

### Subir os containers
```bash
docker compose up -d --build
```

### Parar os containers
```bash
docker compose down
```

### Reiniciar os containers
```bash
docker compose restart
```

### Reiniciar apenas o backend
```bash
docker compose restart app
```

### Reiniciar apenas o frontend
```bash
docker compose restart web
```

### Ver status dos containers
```bash
docker compose ps
```

### Entrar no container do backend
```bash
docker compose exec app bash
```

### Entrar no container do frontend
```bash
docker compose exec web sh
```

---

## Frontend

O frontend roda com Vite dentro do container `web`.

Configuração usada no ambiente Docker:

```env
VITE_API_URL=/api
VITE_BACKEND_URL=http://app:8000
```

Com isso, o frontend fica disponível em `http://localhost:5173` e encaminha as requisições da API para o backend Laravel via proxy.

Se precisar reinstalar as dependências do frontend:

```bash
docker compose exec web npm install
```

Se precisar reiniciar o servidor de desenvolvimento do frontend:

```bash
docker compose restart web
```

---

## Banco de dados

O ambiente Docker já sobe o MySQL automaticamente.

Configuração utilizada pelo backend:

```env
DB_CONNECTION=mysql
DB_HOST=db
DB_PORT=3306
DB_DATABASE=ecommerce
DB_USERNAME=laravel
DB_PASSWORD=secret
```

O volume do MySQL é persistido no Docker, então os dados permanecem salvos entre reinicializações, a menos que o ambiente seja destruído com remoção de volumes.

Se quiser apagar tudo e recriar completamente:

```bash
docker compose down -v
docker compose up -d --build
docker compose exec app php artisan key:generate
docker compose exec app php artisan migrate:fresh --seed
```

---

## Seeds

O projeto possui seeders para popular o banco com categorias e produtos para testes.

Comando:

```bash
docker compose exec app php artisan db:seed
```

Ou, para recriar tudo do zero:

```bash
docker compose exec app php artisan migrate:fresh --seed
```

---

## Testes automatizados

O projeto possui testes automatizados para validar os principais fluxos da API.

### Rodar todos os testes

```bash
docker compose exec app php artisan test
```

### Rodar com saída mais detalhada

```bash
docker compose exec app php artisan test -v
```

### Rodar apenas uma suíte específica

```bash
docker compose exec app php artisan test --filter=AuthTest
docker compose exec app php artisan test --filter=CategoryTest
docker compose exec app php artisan test --filter=ProductTest
```

### Rodar um teste específico

```bash
docker compose exec app php artisan test --filter=test_authenticated_user_can_create_product
```

### Limpar caches antes dos testes, se necessário

```bash
docker compose exec app php artisan optimize:clear
```

---

## Testes manuais da API

### Cadastro de usuário

```bash
curl -X POST http://localhost:8000/api/register \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Fernando Teste",
    "email": "fernando_teste@example.com",
    "password": "12345678",
    "password_confirmation": "12345678"
  }'
```

### Login

```bash
curl -X POST http://localhost:8000/api/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fernando_teste@example.com",
    "password": "12345678"
  }'
```

### Listar categorias

```bash
curl -X GET http://localhost:8000/api/categories \
  -H "Accept: application/json"
```

### Listar produtos

```bash
curl -X GET http://localhost:8000/api/products \
  -H "Accept: application/json"
```

### Buscar produtos por termo

```bash
curl -X GET "http://localhost:8000/api/products?search=notebook" \
  -H "Accept: application/json"
```

### Filtrar produtos por categoria

```bash
curl -X GET "http://localhost:8000/api/products?category=1" \
  -H "Accept: application/json"
```

---

## Testando rotas protegidas

Primeiro, faça login e obtenha um token.

### Exemplo de login com retorno de token

```bash
curl -s -X POST http://localhost:8000/api/login \
  -H "Accept: application/json" \
  -H "Content-Type: application/json" \
  -d '{
    "email": "fernando_teste@example.com",
    "password": "12345678"
  }'
```

Depois, use o token retornado em uma rota protegida:

```bash
curl -X POST http://localhost:8000/api/products \
  -H "Accept: application/json" \
  -H "Authorization: Bearer SEU_TOKEN_AQUI" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Produto Teste",
    "description": "Produto criado manualmente",
    "price": 99.90,
    "category_id": 1,
    "image_url": "https://placehold.co/600x600?text=Produto"
  }'
```

---

## Estrutura da API

A API foi organizada com separação de responsabilidades:

### Controllers
Responsáveis por receber a requisição HTTP e devolver a resposta.

### Services
Responsáveis pela regra de negócio.

### Repositories
Responsáveis pela comunicação com o banco de dados.

### Resources / Collections
Responsáveis por padronizar a estrutura das respostas da API.

Essa organização foi adotada para manter o código mais legível, testável e fácil de manter.

---

## Observações

- O backend já está preparado para execução em Docker.
- O frontend também roda em Docker com Vite.
- O banco de dados pode ser recriado facilmente com migrations e seeders.
- Os testes automatizados podem ser executados com um único comando.
- A arquitetura está desacoplada entre backend e frontend.

---

## Autor

Fernando Montini
