
import re
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlalchemy.ext.declarative import declared_attr
from py.appbase.database import db
from datetime import datetime

# テーブルの共通設定
class Base(object):
    @declared_attr
    def __tablename__(cls):
        return uppercamel_to_snake(cls.__name__)

    created = db.Column('created', db.DATETIME, default=datetime.now, nullable=False)
    updated = db.Column('updated', db.DATETIME, default=datetime.now, nullable=False)

    def set_attributes_from_dict(self, data: dict):
        # JSONのキーと同名だったフィールド全てに値をセット
        for camel_key in data.keys():
            snake_key = camel_to_snake(camel_key)
            if snake_key in self.__class__.__dict__:
                setattr(self, snake_key, data[camel_key])

    def to_dict(self):
        ret_dict = {}
        for snake_key in self.__class__.__dict__:
            # クラス定義を調べて、SQLAlchemyのカラム型だったら、DictへKeyValueをコピーする(Key名はキャメル変更した上で)
            if hasattr(self, snake_key) and \
                    isinstance(getattr(self.__class__, snake_key), InstrumentedAttribute):
                ret_dict[snake_to_camel(snake_key)] = getattr(self, snake_key)

        return ret_dict

from sqlalchemy.ext.declarative import declarative_base

Base = declarative_base(cls=Base)


def camel_to_snake(camel):
    return re.sub("([A-Z])",lambda x:"_" + x.group(1).lower(),camel)

def uppercamel_to_snake(camel):
    camel = camel[0].lower() + camel[1:]
    return camel_to_snake(camel)

def snake_to_camel(snake):
    return re.sub("_(.)",lambda x:x.group(1).upper(),snake)
