# -*- coding:utf-8 -*-

# Flask などの必要なライブラリをインポートする
from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
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

    def __init__(self, task_id, title, content, status):
        self.task_id = task_id
        self.title = title
        self.content = content
        self.status = status

    def __repr__(self):
        return '<Task %r, %s>' % (self.task_id, self.title)


# メッセージをランダムに表示するメソッド
def picked_up():
    messages = [
        "こんにちは、あなたの名前を入力してください",
        "やあ！お名前は何ですか？",
        "あなたの名前を教えてね"
    ]
    # NumPy の random.choice で配列からランダムに取り出し
    return np.random.choice(messages)

@v1.route('/task', methods=['POST'])
def addNewTask():
    req_data = json.loads(request.data)

    newTask = Task(req_data['taskId'],
                    req_data['title'],
                    req_data['content'],
                    req_data['status'])

    db.session.add(newTask)
    db.session.commit()

    return jsonify(req_data), 200


@v1.route('/task/<task_id>', methods=['GET'])
def getTaskById(task_id):
    task = Task.query.get(task_id)
    return jsonify(task), 200   # ※※※taskはDictじゃなくてオブジェクトなのでJsonにそのまま変換はできないのでNG

if __name__ == '__main__':
    app.register_blueprint(v1)

    app.debug = True # デバッグモード有効化

    # modelとして定義した全テーブルをCreateする
    db.create_all()

    app.run(host='0.0.0.0') # どこからでもアクセス可能に
