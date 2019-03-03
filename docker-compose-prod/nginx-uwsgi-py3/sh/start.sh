#!/bin/sh

/etc/init.d/nginx start
cd /var/www/html/app
chmod -R 777 .
uwsgi --ini uwsgi.ini
