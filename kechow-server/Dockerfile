# ------------------------
# Stage 1: Build frontend
# ------------------------
FROM node:20 AS frontend-build

# Set working directory inside the container
WORKDIR /app

# Copy frontend package.json and package-lock.json
COPY kechow-client/package*.json ./

# Install dependencies
RUN npm ci

# Copy frontend source
COPY kechow-client/ ./

# Build frontend assets
RUN npm run build

# ------------------------
# Stage 2: PHP + Apache
# ------------------------
FROM php:8.2-apache

WORKDIR /var/www/html

# Install PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev libonig-dev libxml2-dev zip unzip git curl libpq-dev \
    && docker-php-ext-install pdo_mysql pdo_pgsql mbstring exif pcntl bcmath gd

# Enable Apache rewrite
RUN a2enmod rewrite
ENV APACHE_DOCUMENT_ROOT /var/www/html/public
RUN sed -ri -e 's!/var/www/html!/var/www/html/public!g' /etc/apache2/sites-available/*.conf

# Copy backend source
COPY kechow-server/ ./

# Copy built frontend from previous stage
COPY --from=frontend-build /app/dist /var/www/html/public/build

# Install Composer and backend dependencies
COPY --from=composer:2 /usr/bin/composer /usr/bin/composer
RUN composer install --no-dev --optimize-autoloader

# Set permissions
RUN chown -R www-data:www-data /var/www/html \
    && chmod -R 755 /var/www/html

# Expose port
EXPOSE 80

# Start Apache in foreground
CMD ["apache2-foreground"]
