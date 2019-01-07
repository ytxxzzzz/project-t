from sqlalchemy.orm.attributes import InstrumentedAttribute
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

from py.appbase.database import db
from py.models import Base


# UserとUserGroupのN:Nリレーションテーブル
user_group_rel = db.Table('user_group_rel',
    db.Column('user_group_id', db.Integer, db.ForeignKey('user_group.user_group_id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
)


class UserGroup(Base):
    user_group_id = db.Column(db.Integer, primary_key=True)
    user_group_name = db.Column(db.String(200), unique=False)

    # Many-to-Many relation
    users = db.relationship('User', secondary=user_group_rel, lazy='subquery',
                            backref=db.backref('UserGroup', lazy=True))
    # One-to-Many relation
    task_groups = db.relationship('TaskGroup', backref='UserGroup', lazy=True)

class User(Base):
    user_id = db.Column(db.Integer, primary_key=True)
    e_mail = db.Column(db.String(256), unique=True)

    # Many-to-Many relation
    user_groups = db.relationship('UserGroup', secondary=user_group_rel, lazy='subquery',
                                backref=db.backref('User', lazy=True))
