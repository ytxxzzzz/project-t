from sqlalchemy.orm.attributes import InstrumentedAttribute
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

from py.appbase.database import db
from py.models import CommonColumnsMixin, set_attributes_from_dict

user_group_rel = db.Table('user_group_rel',
    db.Column('user_group_id', db.Integer, db.ForeignKey('user_group.user_group_id'), primary_key=True),
    db.Column('user_id', db.Integer, db.ForeignKey('user.user_id'), primary_key=True)
)


class UserGroup(db.Model, CommonColumnsMixin):
    user_group_id = db.Column(db.Integer, primary_key=True)

    users = db.relationship('User', secondary=user_group_rel, lazy='subquery')


class User(db.Model, CommonColumnsMixin):
    user_id = db.Column(db.Integer, primary_key=True)
    e_mail = db.Column(db.String(256), unique=True)

    user_groups = db.relationship('UserGroup', secondary=user_group_rel, lazy='subquery')
