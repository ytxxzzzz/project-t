FROM ubuntu:18.04

# aptパッケージ最新化
RUN apt update
RUN apt upgrade -y

# python3.6インストール
RUN apt-get install python3.6 python3.6-dev python3-pip -y

# python3のパッケージ管理セットアップ
RUN pip3 install pipenv

# uwsgiインストール
RUN pip3 install uwsgi

# npm インストール(普通にインストールすると古いので、nパッケージで最新化している。wgetはnで必要みたい)
RUN apt-get install npm wget -y
RUN npm install n -g
RUN n stable
# 念のため古いnpmを削除
RUN apt purge -y nodejs npm
# 更に最新化(2019/03時点でv6.9.0。このVerでは少なくとも動いている→後にバージョン固定化必要になったらこの近辺に固定するとよろし)
RUN npm install npm -g

# git インストール
RUN apt-get install git -y

# nginxインストール
RUN apt-get install nginx=1.14.0-0ubuntu1.2 -y
RUN useradd --shell /sbin/nologin -u 1000 nginx

# mysqlクライアントは不要だが、欲しい場合はインストール
RUN apt-get install mysql-client-5.7 -y

# jaロケールの構築
RUN apt-get install locales
RUN echo "ja_JP UTF-8" >> /etc/locale.gen
RUN locale-gen

# git clone
ARG GIT_URI
RUN mkdir -p /var/www/html/app/
RUN echo ${GIT_URI}
RUN ls -R /var/www/html
RUN git clone ${GIT_URI} /var/www/html/app/

# letsencryptのインストール
RUN git clone https://github.com/letsencrypt/letsencrypt.git /home/letsencrypt

# WEBアプリのデプロイ先
WORKDIR /var/www/html/app/

# ロケール設定(特に、pipenvで必要となる)
ENV LANG ja_JP.UTF-8

# npmのパッケージ構築
RUN npm install
# reactのコンパイル
RUN npm run build-prod

# pipenvのパッケージ構築(この環境変数はpipenv仮想環境をプロジェクト直下の".venv"フォルダに作成するおまじない)
ENV PIPENV_VENV_IN_PROJECT 1
RUN pipenv install

# コンテナメインプロセス起動用シェル
ADD ./sh/start.sh /tmp/start.sh

# nginxの設定関係
COPY conf/nginx.conf /etc/nginx/nginx.conf
ADD conf/default.conf /etc/nginx/conf.d/default.conf

# ポートの公開
EXPOSE 80
EXPOSE 443

CMD /bin/bash -x /tmp/start.sh > /tmp/start.sh.log 2>&1
