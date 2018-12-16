from flask import Flask

from py.appbase.database import init_db


def create_app():
    app = Flask(__name__)
#    app.config.from_object('py.config.Config')

    app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://root:pass@localhost/project_t?charset=utf8'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = True

    init_db(app)
    app.debug = True # デバッグモード有効化

    return app

app = create_app()
