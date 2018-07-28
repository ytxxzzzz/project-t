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
```

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
