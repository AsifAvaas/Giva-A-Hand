FROM php:8.2-apache

# Install required packages and PHP extensions
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev zip unzip curl \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# Enable Apache rewrite module
RUN a2enmod rewrite

# Set the working directory to the Laravel project
WORKDIR /var/www/html

# Copy the composer.json and composer.lock files first to leverage Docker caching
COPY composer.json composer.lock ./

# Install Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Run composer install to install all the dependencies
RUN composer install --no-dev --optimize-autoloader

# Copy the rest of the project files
COPY . .

# Configure Apache DocumentRoot and other settings
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf

# Add custom directory index and permissions
RUN echo "DirectoryIndex index.php index.html" >> /etc/apache2/sites-available/000-default.conf

RUN echo "<Directory /var/www/html/public>" >> /etc/apache2/sites-available/000-default.conf && \
    echo "    AllowOverride All" >> /etc/apache2/sites-available/000-default.conf && \
    echo "    Require all granted" >> /etc/apache2/sites-available/000-default.conf && \
    echo "</Directory>" >> /etc/apache2/sites-available/000-default.conf

RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Set correct permissions for storage and cache folders
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 80 for the Apache server
EXPOSE 80

# Restart Apache service
RUN service apache2 restart

# Run the Apache server in the foreground
CMD ["apache2-foreground"]
