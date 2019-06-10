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
- dockerは古ければ動く
- docker-composeは動かず
```
# WSLのインストールなど
https://qiita.com/kogaH/items/534560dd1e4004e80df4

※但し、現在はDockerのバージョンが新しくなっているため、WSL1では動作しない
　→動かすには、古いバージョンのDockerで環境構築する必要があるが、
　ubuntuのaptでインストールすると、最新が入ってしまうため、debパッケージを自前で
　ダウンロードしてインストールする必要がある。

以下、それを考慮して書いた手順。

# aptの更新
sudo apt update
sudo apt upgrade

# WSLをubuntu16.04とした場合のDockerダウンロードコマンド
curl -O https://download.docker.com/linux/ubuntu/dists/xenial/pool/stable/amd64/docker-ce_17.09.0~ce-0~ubuntu_amd64.deb

# ↑でubuntuのバージョン違う場合は、xenialの部分を対象バージョンに合わせる←ここが開発コードになってる
# 開発コードとバージョンの対応表
  * https://kledgeb.blogspot.com/2013/08/ubuntu.html

# aptでファイルからインストール(※WSLは管理者モードで起動する必要あり)
sudo apt-get install ./docker-ce_17.09.0~ce-0~ubuntu_amd64.deb

# あんまりよくわからんが、wslからdockerを使えるようにするおまじないらしい
sudo cgroupfs-mount

# dockerグループに現在のユーザを追加して、sudoなしでdocker利用できるようにする設定
sudo usermod -aG docker $USER

# dockerサービスの起動
sudo service docker start

# 次回以降、WSL起動時に毎回以下のコマンドでdockerサービスを起動する必要あり
sudo cgroupfs-mount && sudo service docker start

# docker-composeをインストールする -> ダメ
このURL通りの結果でした
https://gdgd-shinoyu.hatenablog.com/entry/2018/07/10/032023

おしい

```
- 参考
  - Dockerをインストールする方法
    - https://qiita.com/kogaH/items/534560dd1e4004e80df4
  - Docker17.09.0より新しいDockerはWSL1では動作しない、という情報
    - https://qiita.com/guchio/items/3eb0818df44fdbab3d14
  - WSLにWindowsディレクトリマウントするときのパーミッションが777になっちゃう件の回避策など
    - https://www.clear-code.com/blog/2017/11/8.html

## 環境構築番外編２　ｗSLでLinux版VSCodeを使う
理由・動機：Win版のVSCodeでデバッグするにはWindows版のPythonで動作させる必要があり、Linux上での動作と異なる可能性がありだいぶ嫌な感じなので。

参考：
https://gist.github.com/wilfrem/d2c1c6223608d8e23a93451981935c91


## トラブルシュート
- 初期構築後、フロント側が、index.tsxのcreateHistory()のところでエラーになる場合
  - npmのバージョンが古い疑惑が濃厚 →aptで気にせずインストールするとかなり古い
    - https://qiita.com/seibe/items/36cef7df85fe2cefa3ea
  - 


