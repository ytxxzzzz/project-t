#!/bin/sh

# エラー時中断するように、などの設定
# set -eux

export LANG=ja_JP.UTF-8

# letsencryptでSSL鍵を生成(ドメインの認証をするために、独自のスタンドアローンなHTTPサーバを内部的に起動する)
/home/letsencrypt/letsencrypt-auto certonly --standalone --non-interactive --agree-tos -d ${SSL_DOMAIN} --email ${SSL_EMAIL}

# SSL鍵の配置
cp /etc/letsencrypt/live/${SSL_DOMAIN}/fullchain.pem /etc/nginx/fullchain.pem
cp /etc/letsencrypt/live/${SSL_DOMAIN}/privkey.pem /etc/nginx/privkey.pem
chmod 400 /etc/nginx/privkey.pem

# nginx起動
/etc/init.d/nginx start

/home/letsencrypt/letsencrypt-auto certonly --webroot -w /var/www/html/app --non-interactive --agree-tos --force-renewal -d ${SSL_DOMAIN} --email ${SSL_EMAIL}

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
