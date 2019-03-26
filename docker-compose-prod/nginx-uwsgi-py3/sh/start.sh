#!/bin/sh

export LANG=ja_JP.UTF-8

# nginx起動
/etc/init.d/nginx start

cd /var/www/html/app

# npmのパッケージ再構築
npm install
# reactのコンパイル
npm run build-prod

# pipenvのパッケージ再構築(この環境変数はpipenv仮想環境をプロジェクト直下の".venv"フォルダに作成するおまじない)
export PIPENV_VENV_IN_PROJECT=1
pipenv install

# migrationsの再構築
rm -rf migrations
FLASK_APP=main.py pipenv run flask db init
FLASK_APP=main.py pipenv run flask db migrate
FLASK_APP=main.py pipenv run flask db upgrade

# uwsgiの起動
export FLASK_ENV=production
mkdir -p /var/log/uwsgi/
pipenv run uwsgi --ini uwsgi.ini
#tail -f /dev/null
