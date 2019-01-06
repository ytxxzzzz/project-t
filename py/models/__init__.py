
import re
from sqlalchemy.orm.attributes import InstrumentedAttribute
from sqlalchemy.ext.declarative import declared_attr
import sqlalchemy as sa
from datetime import datetime, date
import copy
from typing import List, Any, Tuple, Dict

# Base.to_dict()の再起呼び出しのストップ用例外
class NotTraceRecursive(Exception):
    pass

# テーブルの共通設定
class Base(object):

    DATETIME_FORMAT = "%Y/%m/%d %H:%M:%S"

    @declared_attr
    def __tablename__(cls):
        return uppercamel_to_snake(cls.__name__)

    created = sa.Column('created', sa.DATETIME, default=datetime.now, nullable=False)
    updated = sa.Column('updated', sa.DATETIME, default=datetime.now, nullable=False)

    def set_attributes_from_dict(self, data: Dict):
        # JSONのキーと同名だったフィールド全てに値をセット
        for camel_key in data.keys():
            snake_key = camel_to_snake(camel_key)
            if snake_key in self.__class__.__dict__:
                if any([isinstance(getattr(self, snake_key), x) for x in [datetime, date]]):
                    setattr(self, snake_key, datetime.strptime(data[camel_key], self.__class__.DATETIME_FORMAT))
                else:
                    setattr(self, snake_key, data[camel_key])

    def to_dict(self, need_models: List[Any]):
        return self._to_dict(need_models, [])

    def _to_dict(self, need_models: List[Any], traced_models: List[Any]):
        traced_models_copy = copy.deepcopy(traced_models)
        if any([isinstance(self, x) for x in traced_models_copy]):
            # 既に辿り済みのクラスの場合辿らない
            raise NotTraceRecursive()
        else:
            # 辿り済みとしてマークする
            traced_models_copy.append(self.__class__)

        if all([not isinstance(self, x) for x in need_models]):
            # 欲しいクラスではない場合は辿らない
            raise NotTraceRecursive()

        ret_dict = {}
        for snake_key in self.__class__.__dict__:
            try:
                # SQLAlchemy管理のフィールドがあり、それらは先頭大文字なので排除する
                if len(snake_key) > 0 and snake_key[0].isupper():
                    continue
                # クラス定義を調べて、SQLAlchemyのカラム型だったら、DictへKeyValueをコピーする(Key名はキャメル変更した上で)
                if hasattr(self, snake_key) and \
                            isinstance(getattr(self.__class__, snake_key), InstrumentedAttribute):
                    val = getattr(self, snake_key)
                    if any([isinstance(val, x) for x in [int, str]]):
                        ret_dict[snake_to_camel(snake_key)] = val
                    elif any([isinstance(val, x) for x in [datetime, date]]):
                        ret_dict[snake_to_camel(snake_key)] = val.strftime(self.__class__.DATETIME_FORMAT)
                    elif isinstance(val, list):
                        ret_dict[snake_to_camel(snake_key)] = [x._to_dict(need_models, traced_models_copy) for x in val]
                    elif hasattr(val, '_to_dict'):
                        ret_dict[snake_to_camel(snake_key)] = val._to_dict(need_models, traced_models_copy)
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
