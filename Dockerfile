# Use the official PHP image with Apache
FROM php:8.2-apache

# Install required extensions
RUN apt-get update && apt-get install -y \
    libpng-dev libjpeg-dev libfreetype6-dev zip unzip \
    && docker-php-ext-configure gd --with-freetype --with-jpeg \
    && docker-php-ext-install gd pdo pdo_mysql

# Enable Apache mod_rewrite for Laravel pretty URLs
RUN a2enmod rewrite

# Set working directory to Laravel root
WORKDIR /var/www/html

# Copy Laravel project files
COPY . .

# Change Apache DocumentRoot to Laravel's public directory
RUN sed -i 's|DocumentRoot /var/www/html|DocumentRoot /var/www/html/public|' /etc/apache2/sites-available/000-default.conf

# Add DirectoryIndex directive for Apache to recognize index.php
RUN echo "DirectoryIndex index.php index.html" >> /etc/apache2/sites-available/000-default.conf

# Ensure Apache config allows access to Laravel public folder
RUN echo "<Directory /var/www/html/public>" >> /etc/apache2/sites-available/000-default.conf && \
    echo "    AllowOverride All" >> /etc/apache2/sites-available/000-default.conf && \
    echo "    Require all granted" >> /etc/apache2/sites-available/000-default.conf && \
    echo "</Directory>" >> /etc/apache2/sites-available/000-default.conf

# Set server name to avoid warning
RUN echo "ServerName localhost" >> /etc/apache2/apache2.conf

# Grant proper permissions
RUN chown -R www-data:www-data /var/www/html/storage /var/www/html/bootstrap/cache

# Expose port 80
EXPOSE 80

# Restart Apache to apply changes
RUN service apache2 restart

# Start Apache server
CMD ["apache2-foreground"]
