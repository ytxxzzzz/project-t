from sqlalchemy.orm.attributes import InstrumentedAttribute
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

from py.appbase.database import db
from py.models import Base
from py.models.user import UserGroup


class TaskGroup(Base):
    task_group_id = db.Column(db.Integer, primary_key=True)
    task_group_title = db.Column(db.String(200), unique=False)
    user_group_id = db.Column(db.Integer, db.ForeignKey('user_group.user_group_id'))
    archived = db.Column(db.DateTime)

    # One-to-Many relation
    tasks = db.relationship('Task', backref='TaskGroup', lazy=True)

    # One-to-One relation
    user_group = db.relationship('UserGroup', backref='TaskGroup', lazy=True)


class Task(Base):
    task_id = db.Column(db.Integer, primary_key=True)
    task_title = db.Column(db.String(200), unique=False)
    task_detail = db.Column(db.Text, unique=False)
    status = db.Column(db.String(30))
    deadline = db.Column(db.DATETIME, nullable=True)

    task_group_id = db.Column(db.Integer, db.ForeignKey('task_group.task_group_id'))

    # One-to-One relation
    task_group = db.relationship('TaskGroup', backref='Task', lazy=True)

    def __repr__(self):
        return '<Task %r, %s>' % (self.task_id, self.title)
