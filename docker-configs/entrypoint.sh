#!/bin/bash

# Ajuste permissões no diretório MySQL
chown -R mysql:mysql /var/lib/mysql
chmod -R 755 /var/lib/mysql

# Inicialize o MySQL
# service mysql start

# Inicialize o PHP-FPM
service php8.3-fpm start

# Inicialize o Nginx
service nginx start

# Mantenha o container em execução
tail -f /var/log/mysql/error.log /var/log/nginx/access.log /var/log/nginx/error.log /var/log/php8.3-fpm.log
