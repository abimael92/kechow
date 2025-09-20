# ------------------------
# Base PHP image with Apache
# ------------------------
FROM php:8.2-apache

# Set working directory
WORKDIR /var/www/html

# ------------------------
# Install system dependencies
# ------------------------
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl libpq-dev \
    nodejs npm \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Enable Apache rewrite
RUN a2enmod rewrite

# Set Apache document root to public
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf

# ------------------------
# Copy project files
# ------------------------
COPY . .

# ------------------------
# Install backend dependencies
# ------------------------
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# ------------------------
# Install frontend dependencies and build
# ------------------------
WORKDIR /var/www/html/kechow-client
RUN npm install
RUN npm run build

# ------------------------
# Permissions
# ------------------------
WORKDIR /var/www/html
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose Apache port
EXPOSE 80

# Start Apache
CMD ["apache2-foreground"]
