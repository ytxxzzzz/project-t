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

```

## React Typescript 環境構築
https://mae.chab.in/archives/59782



## 第１段

### データ構造

- タスク
    - タスクID
    - タイトル
    - 詳細
    - ステータス
    - 順序

- ステータス
    - ステータスID
    - 順序
    - ラベル

### API

- タスク
    - 新規作成
    - 更新
    - 

## そのうち
- タスク
    - タスクID
    - タイトル
    - 詳細
    - カテゴリID
    - カテゴリステータスID
    - N:タスクリスト
    - ファイルリスト
- カテゴリ
    - カテゴリID
    - カテゴリ名
- カテゴリステータス
    - カテゴリID
    - カテゴリステータスID
    - 順序
    - ラベル
