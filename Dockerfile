FROM php:8.2-apache

ENV APACHE_DOCUMENT_ROOT=/var/www/html/public

RUN apt-get update && apt-get install -y \
    libzip-dev zip unzip git curl libonig-dev libxml2-dev \
    && docker-php-ext-install pdo_mysql zip mbstring bcmath

RUN a2enmod rewrite \
    && sed -ri 's!/var/www/html!${APACHE_DOCUMENT_ROOT}!g' \
    /etc/apache2/sites-available/*.conf \
    /etc/apache2/apache2.conf \
    && echo '<Directory /var/www/html/public>\
    AllowOverride All\
    Require all granted\
</Directory>' > /etc/apache2/conf-available/laravel.conf \
    && a2enconf laravel

WORKDIR /var/www/html

# COPY BACKEND CODE (THIS IS THE FIX)
COPY kechow-server/ .

RUN chown -R www-data:www-data storage bootstrap/cache
