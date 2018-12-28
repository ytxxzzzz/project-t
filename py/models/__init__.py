
import re
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlalchemy.ext.declarative import declared_attr
import sqlalchemy as sa
from datetime import datetime, date
from typing import List, Any, Tuple

# 再起呼び出しのストップ用例外
class NotTraceRecursive(Exception):
    pass

# テーブルの共通設定
class Base(object):
    @declared_attr
    def __tablename__(cls):
        return uppercamel_to_snake(cls.__name__)

    created = sa.Column('created', sa.DATETIME, default=datetime.now, nullable=False)
    updated = sa.Column('updated', sa.DATETIME, default=datetime.now, nullable=False)

    def set_attributes_from_dict(self, data: dict):
        # JSONのキーと同名だったフィールド全てに値をセット
        for camel_key in data.keys():
            snake_key = camel_to_snake(camel_key)
            if snake_key in self.__class__.__dict__:
                setattr(self, snake_key, data[camel_key])

    def to_dict(self, need_models: List[Any], traced_models: List[Any]=None):
        if traced_models is None:
            traced_models = [self.__class__]
        elif any([isinstance(self, x) for x in traced_models]):
            # 既に辿り済みのクラスの場合辿らない
            raise NotTraceRecursive()
        else:
            # 辿り済みとしてマークする
            traced_models.append(self.__class__)

        if all([not isinstance(self, x) for x in need_models]):
            # 欲しいクラスではない場合は辿らない
            raise NotTraceRecursive()

        ret_dict = {}
        for snake_key in self.__class__.__dict__:
            # SQLAlchemy管理のフィールドがあり、それらは先頭大文字なので排除する
            if len(snake_key) > 0 and snake_key[0].isupper():
                continue
            # クラス定義を調べて、SQLAlchemyのカラム型だったら、DictへKeyValueをコピーする(Key名はキャメル変更した上で)
            if hasattr(self, snake_key) and \
                        isinstance(getattr(self.__class__, snake_key), InstrumentedAttribute):
                val = getattr(self, snake_key)
                if any([isinstance(val, x) for x in [int, str, datetime, date]]):
                    ret_dict[snake_to_camel(snake_key)] = val
                elif isinstance(val, list):
                    try:
                        ret_dict[snake_to_camel(snake_key)] = [x.to_dict(need_models, traced_models) for x in val]
                    except NotTraceRecursive:
                        pass
                elif hasattr(val, 'to_dict'):
                    try:
                        ret_dict[snake_to_camel(snake_key)] = val.to_dict(need_models, traced_models)
                    except NotTraceRecursive:
                        pass

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
