
import re
from sqlalchemy.orm.attributes import InstrumentedAttribute
from py.appbase.database import db
from datetime import datetime

class CommonColumnsMixin(object):
    created = db.Column('created', db.DATETIME, default=datetime.now, nullable=False)
    updated = db.Column('updated', db.DATETIME, default=datetime.now, nullable=False)

def set_attributes_from_dict(obj, data: dict):
    # JSONのキーと同名だったフィールド全てに値をセット
    for camel_key in data.keys():
        snake_key = camel_to_snake(camel_key)
        if snake_key in obj.__class__.__dict__:
            setattr(obj, snake_key, data[camel_key])

def to_dict(obj):
    ret_dict = {}
    for snake_key in obj.__class__.__dict__:
        # クラス定義を調べて、SQLAlchemyのカラム型だったら、DictへKeyValueをコピーする(Key名はキャメル変更した上で)
        if hasattr(obj, snake_key) and \
                isinstance(getattr(obj.__class__, snake_key), InstrumentedAttribute):
            ret_dict[snake_to_camel(snake_key)] = getattr(obj, snake_key)

    return ret_dict

def camel_to_snake(camel):
    return re.sub("([A-Z])",lambda x:"_" + x.group(1).lower(),camel)

def snake_to_camel(snake):
    return re.sub("_(.)",lambda x:x.group(1).upper(),snake)
