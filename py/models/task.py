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
    is_archived = db.Column(db.Boolean, default=False)

    # One-to-Many relation
    tasks = db.relationship('Task', backref='TaskGroup', lazy=True)

    # One-to-One relation
    user_group = db.relationship('UserGroup', backref='TaskGroup', lazy=True)

    # One-to-Many relation
    task_statuses = db.relationship('TaskStatus', backref='TaskGroup', lazy=True)

class Task(Base):
    task_id = db.Column(db.Integer, primary_key=True)
    task_title = db.Column(db.String(200), unique=False)
    task_detail = db.Column(db.Text, unique=False)
    deadline = db.Column(db.DATETIME, nullable=True)

    task_group_id = db.Column(db.Integer, db.ForeignKey('task_group.task_group_id'))
    task_status_id = db.Column(db.Integer, db.ForeignKey('task_status.task_status_id'))

    # One-to-One relation
    task_group = db.relationship('TaskGroup', backref='Task', lazy=True)
    # One-to-One relation
    task_status = db.relationship('TaskStatus', backref='Task', lazy=True)

    def __repr__(self):
        return '<Task %r, %s>' % (self.task_id, self.title)

class TaskStatus(Base):
    task_status_id = db.Column(db.Integer, primary_key=True)
    task_status_name = db.Column(db.String(200), unique=False)
    is_done = db.Column(db.Boolean)

    task_group_id = db.Column(db.Integer, db.ForeignKey('task_group.task_group_id'))

    # One-to-One relation
    task_group = db.relationship('TaskGroup', backref='TaskStatus', lazy=True)

    def __init__(self, task_status_name, is_done, task_group_id):
        self.task_status_name = task_status_name
        self.is_done = is_done
        self.task_group_id = task_group_id
