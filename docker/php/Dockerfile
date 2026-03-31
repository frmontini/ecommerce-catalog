FROM php:8.3-cli

WORKDIR /var/www

RUN apt-get update && apt-get install -y \
    git \
    curl \
    unzip \
    libzip-dev \
    libpng-dev \
    libonig-dev \
    libxml2-dev \
    default-mysql-client \
    && docker-php-ext-install pdo pdo_mysql mbstring xml

COPY --from=composer:2 /usr/bin/composer /usr/bin/composer

CMD ["bash", "-lc", "composer install && php artisan key:generate --force && php artisan serve --host=0.0.0.0 --port=8000"]