from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify, abort

# Blueprintにて、APIパスのprefix定義
front = Blueprint('', __name__)

# トップページをフロント側へルーティング(デコレータ１番め)
# URL１階層目だけ指定された場合はページを差すのでフロントへルーティング(デコレータ2番目)
# それ以外は、APIへのアクセスかログインだけとなる。
# APIへのアクセスはここではルーティングせず、APIのBlueprintの方で実施
# ログイン処理も受付の頭はフロント側なので、フロントへルーティング(デコレータ3番目)
@front.route('/', defaults={'path': ''})
@front.route('/<path>')
@front.route('/login/<path>')
def catch_all(path):
    return render_template("index.html")
