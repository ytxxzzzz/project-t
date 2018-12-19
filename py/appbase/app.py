from flask import Flask, Blueprint
from flask_cors import CORS

from py.appbase.database import init_db
from py.views.mainview import path_prefix

def create_app():
    app = Flask(__name__)
    # パスのPrefixを登録
    app.register_blueprint(path_prefix, url_prefix='/api')
    # cors対策
    CORS(app)

    # 設定は別ファイルに書いた方が良さそう→そのうち対応
#    app.config.from_object('py.config.Config')
    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:pass@localhost/project_t?charset=utf8'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

    init_db(app)
    app.debug = True # デバッグモード有効化

    return app

app = create_app()
