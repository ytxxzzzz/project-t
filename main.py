# -*- coding:utf-8 -*-

from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.orm.attributes import InstrumentedAttribute
import json
import re
import jwt

import numpy as np

app = Flask(__name__)

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:pass@localhost/project_t?charset=utf8'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class Task(db.Model):
    task_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), unique=False)
    content = db.Column(db.Text, unique=False)
    status = db.Column(db.String(30))

    def __init__(self, task: dict):
        self.set_attributes_from_dict(task)

    def set_attributes_from_dict(self, task: dict):
        # JSONのキーと同名だったフィールド全てに値をセット
        for camel_key in task.keys():
            snake_key = self.camel_to_snake(camel_key)
            if snake_key in self.__class__.__dict__:
                setattr(self, snake_key, task[camel_key])

    def to_dict(self):
        ret_dict = {}
        for snake_key in self.__class__.__dict__:
            # クラス定義を調べて、SQLAlchemyのカラム型だったら、DictへKeyValueをコピーする(Key名はキャメル変更した上で)
            if hasattr(self, snake_key) and \
                    isinstance(getattr(self.__class__, snake_key), InstrumentedAttribute):
                ret_dict[self.snake_to_camel(snake_key)] = getattr(self, snake_key)

        return ret_dict

    def __repr__(self):
        return '<Task %r, %s>' % (self.task_id, self.title)

    def camel_to_snake(self, camel):
        return re.sub("([A-Z])",lambda x:"_" + x.group(1).lower(),camel)

    def snake_to_camel(self, snake):
        return re.sub("_(.)",lambda x:x.group(1).upper(),snake)


@app.route('/task', methods=['POST'])
def add_new_task():
    req_data = json.loads(request.data)
    if 'taskId' in req_data:
        del(req_data['taskId'])

    task = Task(req_data)

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 200

@app.route('/task', methods=['PUT'])
def update_task():
    req_data = json.loads(request.data)

    # 更新なので、PK未指定は当然エラー
    if 'taskId' not in req_data:
        abort(400, {'msg':'更新オペレーションなので、PK(taskId)の指定は必須です。'})

    # 指定されたIDをSELECT
    task = db.session.query(Task).filter_by(task_id=req_data['taskId']).first()

    # 指定されたIDのデータが見つからず
    if task is None:
        abort(404, {'msg':'指定されたtaskIdのデータが見つかりませんでした。'})

    # 値の更新
    task.set_attributes_from_dict(req_data)
    db.session.commit()

    return jsonify(task.to_dict()), 200


@app.route('/task/<task_id>', methods=['GET'])
def get_task_by_id(task_id):
    task = Task.query.get(task_id)

    # 指定されたIDのデータが見つからず
    if task is None:
        abort(404, {'msg':'指定されたtaskIdのデータが見つかりませんでした。'})

    return jsonify(task.to_dict()), 200

@app.route('/task/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    task = Task.query.get(task_id)

    # 指定されたIDのデータが見つからず
    if task is None:
        abort(404, {'msg':'指定されたtaskIdのデータが見つかりませんでした。'})

    # 見つかったタスクの削除
    db.session.delete(task)
    db.session.commit()

    return jsonify(task.to_dict()), 200

@app.route('/task/findAll', methods=['GET'])
def find_all_tasks():
    tasks = Task.query.all()

    return jsonify([x.to_dict() for x in tasks]), 200

@app.route('/login/<token>', methods=['GET'])
def login(token):
    decoded = jwt.decode(token, 'secret', algorithms=['HS256'])

    print(decoded)
    return jsonify(decoded), 200

# テスト用トークン発行
@app.route('/token/<user_mail>', methods=['GET'])
def generate_token(user_mail: str):
    token = jwt.encode({"userMail": user_mail}, 'secret', algorithm='HS256')

    print(token)
    print(token.decode())

    return jsonify({"token": token.decode()}), 200

@app.route('/favicon.ico', methods=['GET'])
def favicon():
    return "", 200


@app.errorhandler(400)
@app.errorhandler(404)
@app.errorhandler(500)
def error_handler(error):
    response = jsonify({'message': error.description['msg'], 'statusCode': error.code})
    return response, error.code



if __name__ == '__main__':
    app.debug = True # デバッグモード有効化
    # modelとして定義した全テーブルをCreateする
    db.create_all()
    app.run(host='0.0.0.0') # どこからでもアクセス可能に
