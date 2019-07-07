#!/bin/sh

export LANG=ja_JP.UTF-8

# nginx起動
/etc/init.d/nginx start

# letsencryptでSSL鍵を生成(ドメインの認証をするために、一度nginxの起動が必要)
git clone https://github.com/letsencrypt/letsencrypt.git /home/letsencrypt
echo yes | /home/letsencrypt/letsencrypt-auto certonly --non-interactive --agree-tos --webroot -w /var/www/html/app/ -d ${SSL_DOMAIN} --email ${SSL_EMAIL}

# SSL鍵の配置
cp /etc/letsencrypt/live/www.tatatatask.work/fullchain.pem /etc/nginx/fullchain.pem
cp /etc/letsencrypt/live/www.tatatatask.work/privkey.pem /etc/nginx/privkey.pem
chmod 400 /etc/nginx/privkey.pem

/etc/init.d/nginx restart

# migrationsの再構築
cd /var/www/html/app
rm -rf migrations
FLASK_APP=main.py pipenv run flask db init
FLASK_APP=main.py pipenv run flask db migrate
FLASK_APP=main.py pipenv run flask db upgrade

# uwsgiの起動
export FLASK_ENV=production
mkdir -p /var/log/uwsgi/
pipenv run uwsgi --ini uwsgi.ini
#tail -f /dev/null
