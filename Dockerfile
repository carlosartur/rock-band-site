# Use a imagem oficial do Ubuntu como base
FROM ubuntu:latest

# Defina o ambiente não interativo para evitar prompts interativos durante a instalação
ENV DEBIAN_FRONTEND=noninteractive

# Atualize e instale os pacotes necessários
RUN apt-get update && \
    apt-get upgrade -y && \
    apt-get install -y \
    php-fpm php-mysql php-cli php-zip php-gd php-mbstring php-xml php-curl php-bcmath \
    nginx \
    # mysql-server \
    git \
    curl \
    unzip

# Instalar Composer
RUN curl -sS https://getcomposer.org/installer | php -- --install-dir=/usr/local/bin --filename=composer

# Copie os arquivos de configuração do Nginx e do PHP-FPM
COPY ./docker-configs/nginx.conf /etc/nginx/sites-available/default
COPY ./docker-configs/php.ini /etc/php/8.3/fpm/php.ini

# Instalar Laravel
RUN composer global require laravel/installer

# Defina o diretório de trabalho
WORKDIR /var/www/html

# Ajuste o diretório home do MySQL
RUN usermod -d /var/lib/mysql mysql

RUN chown -R mysql:mysql /var/lib/mysql && chmod -R 755 /var/lib/mysql

# Exponha as portas necessárias
EXPOSE 80 443

# Copiar o entrypoint script
COPY ./docker-configs/entrypoint.sh /usr/local/bin/

# Torna o script executável
RUN chmod +x /usr/local/bin/entrypoint.sh

# Defina o entrypoint
ENTRYPOINT ["/usr/local/bin/entrypoint.sh"]
