#!/bin/sh

# エラー時中断するように、などの設定
#set -eux

export LANG=ja_JP.UTF-8

FULLCHAIN_DEST=/etc/nginx/ssl_key/fullchain.pem
PRIVKEY_DEST=/etc/nginx/ssl_key/privkey.pem

if [ ! -f ${FULLCHAIN_DEST} ] || [ `date +%Y%m%d -r ${FULLCHAIN_DEST}` -lt `date +%Y%m%d -d '30 day ago'` ]; then
    # letsencryptでSSL鍵を生成(ドメインの認証をするために、独自のスタンドアローンなHTTPサーバを内部的に起動する)
    /home/letsencrypt/letsencrypt-auto certonly --standalone --non-interactive --agree-tos -d ${SSL_DOMAIN} --email ${SSL_EMAIL}

    # SSL鍵の配置
    cp /etc/letsencrypt/live/${SSL_DOMAIN}/fullchain.pem ${FULLCHAIN_DEST}
    cp /etc/letsencrypt/live/${SSL_DOMAIN}/privkey.pem ${PRIVKEY_DEST}
    chmod 400 ${PRIVKEY_DEST}
fi

# nginx起動
/etc/init.d/nginx start

# nginx起動後は80番がnginxに使われるので、Standaloneからwebrootへ変更して更新する
/home/letsencrypt/letsencrypt-auto renew --webroot -w /var/www/html/app --non-interactive --agree-tos --force-renewal -d ${SSL_DOMAIN} --email ${SSL_EMAIL} --post-hook "cp /etc/letsencrypt/live/${SSL_DOMAIN}/fullchain.pem ${FULLCHAIN_DEST};cp /etc/letsencrypt/live/${SSL_DOMAIN}/privkey.pem ${PRIVKEY_DEST};chmod 400 ${PRIVKEY_DEST};/etc/init.d/nginx restart"

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
