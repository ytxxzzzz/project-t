# -*- coding:utf-8 -*-

# Flask などの必要なライブラリをインポートする
from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify
from flask_sqlalchemy import SQLAlchemy
import json
import numpy as np

app = Flask(__name__)

v1 = Blueprint('v1', __name__, url_prefix='/v1')

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
    return jsonify(req_data), 200


if __name__ == '__main__':
    app.register_blueprint(v1)

    app.debug = True # デバッグモード有効化
    app.run(host='0.0.0.0') # どこからでもアクセス可能に
