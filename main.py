# -*- coding:utf-8 -*-

from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
import jwt

from py.appbase.database import db, init_db
from py.appbase.app import app


if __name__ == '__main__':
    init_db(app)
    app.run(host='0.0.0.0') # どこからでもアクセス可能に
