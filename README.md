# project-t

## 開発環境

```
# mysql 起動
$ cd mysql-docker-compose
$ docker-compose up -d
　※docker-compose.yamlにあるvolumesのdeviceのパスを環境に合わせて変更する必要あり

# mysqlログイン
$ mysql -uroot -p --port=3306 --host=127.0.0.1
　※パスワード＝pass

# DBの定義変更(Flask-migrateのざっくり使い方)

1. ソース中のModelクラスのカラム定義を修正する
　　(どうもカラムの追加と削除しかトラックされないみたい。サイズ変更とかは無視されるから自分でAlterTableするしかなさそうな雰囲気)

2. migrateコマンドで1のソース修正と接続先DBの定義突合をして差分をFlask-migrate管轄のファイル(migrationsフォルダ配下)に記録
$ FLASK_APP=main.py flask db migrate

3. 差分を接続先のDBへ適用(つまり実際にAlter Tableする)
$ FLASK_APP=main.py flask db upgrade

※DBを一旦migrate管理外で初期化してしまった場合は、
　Flask-migrateを初期化するために以下を行ってみると、再度migrateで再び管理できるようになるかも

1. mysqlの該当データベース内にある「alembic_version」テーブルをDropする
2. ソースフォルダのルート直下にある「migrations」フォルダを削除

3. 以下のコマンドで初期化
$ FLASK_APP=main.py flask db init

4. DB定義の最新化
$ FLASK_APP=main.py flask db migrate
$ FLASK_APP=main.py flask db upgrade

```

## React Typescript 環境構築
https://mae.chab.in/archives/59782

# 環境初期構築
- git clone
- python系
  - python3.6インストール
  - pipenvをインストールする
  - pipenvのパッケージインストール
    - `pipenv install`
    - ※install前に`export PIPENV_VENV_IN_PROJECT=true`をやった方が何かと都合良い　→これはプロジェクトフォルダ配下にvenvを作る設定
    - 当たり前だが、ログインシェルに入れておいた方がいいと思う
- npm系
  - npmのインストール
  - npmのパッケージインストール
    - `npm install`
  - フロントのコンパイル＆お試し起動
    - `npm start`

## 初期構築番外編　Windows10 HomeのWSL1で　Dockerを動かす
- WSLをubuntu16.04とした場合のDockerダウンロードコマンド
  - curl -O https://download.docker.com/linux/ubuntu/dists/xenial/pool/stable/amd64/docker-ce_17.09.0~ce-0~ubuntu_amd64.deb
  - バージョン違う場合は、xenialの部分を対象バージョンに合わせる←ここが開発コードになってる


- 参考
  - Dockerをインストールする方法
    - https://qiita.com/kogaH/items/534560dd1e4004e80df4
  - Docker17.09.0より新しいDockerはWSL1では動作しない、という情報
    - https://qiita.com/guchio/items/3eb0818df44fdbab3d14
  - WSLにWindowsディレクトリマウントするときのオプションの話とか
    - https://www.clear-code.com/blog/2017/11/8.html

## トラブルシュート
- 初期構築後、フロント側が、index.tsxのcreateHistory()のところでエラーになる場合
  - npmのバージョンが古い疑惑が濃厚 →aptで気にせずインストールするとかなり古い
    - https://qiita.com/seibe/items/36cef7df85fe2cefa3ea
  - 


