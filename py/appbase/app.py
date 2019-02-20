from flask import Flask, Blueprint, redirect
from flask_cors import CORS

from py.appbase.database import init_db
from py.urls.api import api
from py.urls.front import front

def create_app():
    app = Flask(__name__, 
                static_folder='../../dist',
                template_folder='../../dist',
                static_url_path='')
    print(app.url_map)
    # パスのPrefixを登録
    app.register_blueprint(api, url_prefix='/api')
    app.register_blueprint(front, url_prefix='/')
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
