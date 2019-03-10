#!/bin/sh

export LANG=ja_JP.UTF-8

/etc/init.d/nginx start
cd /var/www/html/app

# npmのパッケージ再構築
npm install
# reactのコンパイル
npm run build

# pipenvのパッケージ再構築
pipenv install

# migrationsの再構築
rm migrations
FLASK_APP=main.py pipenv run flask db init
FLASK_APP=main.py pipenv run flask db migrate
FLASK_APP=main.py pipenv run flask db upgrade

#chmod -R 777 .
uwsgi --ini uwsgi.ini
