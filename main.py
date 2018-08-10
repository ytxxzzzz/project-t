# -*- coding:utf-8 -*-

# Flask などの必要なライブラリをインポートする
from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from sqlalchemy.orm.attributes import InstrumentedAttribute
import json
import re
import numpy as np

app = Flask(__name__)
v1 = Blueprint('v1', __name__, url_prefix='/v1')

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


@v1.route('/task', methods=['POST'])
def add_new_task():
    req_data = json.loads(request.data)
    if 'taskId' in req_data:
        del(req_data['taskId'])

    task = Task(req_data)

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 200

@v1.route('/task', methods=['PUT'])
def update_task():
    req_data = json.loads(request.data)

    # 更新なので、PK未指定は当然エラー
    if 'taskId' not in req_data:
        return '', 400

    # 指定されたIDをSELECT
    task = db.session.query(Task).filter_by(task_id=req_data['taskId']).first()

    # 指定されたIDのデータが見つからず
    if task is None:
        return '', 404

    # 値の更新
    task.set_attributes_from_dict(req_data)
    db.session.commit()

    return jsonify(task.to_dict()), 200


@v1.route('/task/<task_id>', methods=['GET'])
def get_task_by_id(task_id):
    task = Task.query.get(task_id)
    return jsonify(task), 200   # ※※※taskはDictじゃなくてオブジェクトなのでJsonにそのまま変換はできないのでNG

if __name__ == '__main__':
    app.register_blueprint(v1)

    app.debug = True # デバッグモード有効化

    # modelとして定義した全テーブルをCreateする
    db.create_all()

    app.run(host='0.0.0.0') # どこからでもアクセス可能に
