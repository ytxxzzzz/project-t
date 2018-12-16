from sqlalchemy.orm.attributes import InstrumentedAttribute
from flask_sqlalchemy import SQLAlchemy
from py.appbase.database import db


class Task(db.Model):
    task_id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(200), unique=False)
    content = db.Column(db.Text, unique=False)
    status = db.Column(db.String(30))

    def __init__(self, task: dict):
        self.set_attributes_from_dict(task)

    def set_attributes_from_dict(self, task: dict):
        # JSONのキーと同名だったフィールド全てに値をセット
        for camel_key in task.keys():
            snake_key = self.camel_to_snake(camel_key)
            if snake_key in self.__class__.__dict__:
                setattr(self, snake_key, task[camel_key])

    def to_dict(self):
        ret_dict = {}
        for snake_key in self.__class__.__dict__:
            # クラス定義を調べて、SQLAlchemyのカラム型だったら、DictへKeyValueをコピーする(Key名はキャメル変更した上で)
            if hasattr(self, snake_key) and \
                    isinstance(getattr(self.__class__, snake_key), InstrumentedAttribute):
                ret_dict[self.snake_to_camel(snake_key)] = getattr(self, snake_key)

        return ret_dict

    def __repr__(self):
        return '<Task %r, %s>' % (self.task_id, self.title)

    def camel_to_snake(self, camel):
        return re.sub("([A-Z])",lambda x:"_" + x.group(1).lower(),camel)

    def snake_to_camel(self, snake):
        return re.sub("_(.)",lambda x:x.group(1).upper(),snake)
