from sqlalchemy.orm.attributes import InstrumentedAttribute
from flask_sqlalchemy import SQLAlchemy

from datetime import datetime

from py.appbase.database import db
from py.models import set_attributes_from_dict

class Task(db.Model):
    task_id = db.Column(db.Integer, primary_key=True)
    task_title = db.Column(db.String(200), unique=False)
    task_detail = db.Column(db.Text, unique=False)
    status = db.Column(db.String(30))
    created = db.Column('created', db.DATETIME, default=datetime.now, nullable=False)
    modified = db.Column('modified', db.DATETIME, default=datetime.now, nullable=False)

    def __init__(self, task: dict):
        set_attributes_from_dict(self, task)

    def __repr__(self):
        return '<Task %r, %s>' % (self.task_id, self.title)
