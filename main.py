# -*- coding:utf-8 -*-

# Flask などの必要なライブラリをインポートする
from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
import json
import numpy as np

app = Flask(__name__)
v1 = Blueprint('v1', __name__, url_prefix='/v1')

app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:pass@localhost/project_t?charset=utf8'
db = SQLAlchemy(app)

class Task(db.Model):
    taskId = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(100), unique=False)
    content = db.Column(db.Text, unique=False)
    status = db.Column(db.String(10))

    def __init__(self, taskId, title, content, status):
        self.taskId = taskId
        self.title = title
        self.content = content
        self.status = status

    def __repr__(self):
        return '<Task %r, %s>' % (self.taskId, self.title)


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


if __name__ == '__main__':
    app.register_blueprint(v1)

    app.debug = True # デバッグモード有効化

    # modelとして定義した全テーブルをCreateする
    db.create_all()

    app.run(host='0.0.0.0') # どこからでもアクセス可能に
