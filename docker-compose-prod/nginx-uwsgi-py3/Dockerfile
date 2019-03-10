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

# npm インストール
RUN apt-get install npm -y

# nginxインストール
RUN apt-get install nginx=1.14.0-0ubuntu1.2 -y
RUN useradd --shell /sbin/nologin -u 1000 nginx

# nginxの設定関係
COPY conf/nginx.conf /etc/nginx/nginx.conf
ADD conf/default.conf /etc/nginx/conf.d/default.conf

# jaロケールの構築
RUN apt-get install locales
RUN echo "ja_JP UTF-8" >> /etc/locale.gen
RUN locale-gen

# ポートの公開
EXPOSE 80
EXPOSE 443

# コンテナメインプロセス起動用シェル
ADD ./sh/start.sh /tmp/start.sh

CMD /bin/bash /tmp/start.sh
