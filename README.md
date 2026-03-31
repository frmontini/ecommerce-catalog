# E-commerce Catalog

Projeto de catálogo de produtos com autenticação, desenvolvido como
teste técnico utilizando Laravel (API), React (frontend) e MySQL, com
ambiente containerizado via Docker.

------------------------------------------------------------------------

## Tecnologias utilizadas

-   PHP 8.3 / Laravel
-   MySQL 8
-   Docker / Docker Compose
-   React (em desenvolvimento)

------------------------------------------------------------------------

## Repositório

https://github.com/frmontini/ecommerce-catalog

------------------------------------------------------------------------

## Estrutura do projeto

ecommerce-catalog/ api/ \# Backend (Laravel) web/ \# Frontend (React)
docker/ php/ Dockerfile docker-compose.yml

------------------------------------------------------------------------

## Pré-requisitos

-   Docker
-   Docker Compose

------------------------------------------------------------------------

## Como rodar o projeto

### 1. Clonar o repositório

git clone https://github.com/frmontini/ecommerce-catalog.git cd
ecommerce-catalog

------------------------------------------------------------------------

### 2. Configurar ambiente do backend

cp api/.env.example api/.env

------------------------------------------------------------------------

### 3. Subir containers

docker compose up --build

Aplicação disponível em: http://localhost:8000

------------------------------------------------------------------------

### 4. Rodar migrations

docker compose exec app php artisan migrate

------------------------------------------------------------------------

### 5. Rodar seeders

docker compose exec app php artisan db:seed

------------------------------------------------------------------------

## Observações

-   O backend está preparado como API REST.
-   O frontend será implementado em React consumindo os endpoints da
    API.
-   O ambiente já está configurado para facilitar a execução sem
    necessidade de instalação manual de dependências.

------------------------------------------------------------------------

## Autor

Fernando Montini
