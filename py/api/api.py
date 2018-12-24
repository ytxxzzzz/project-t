# -*- coding:utf-8 -*-

from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
import jwt

from py.appbase.database import db
from py.models.task import Task
from py.models.user import User

import numpy as np

# Blueprintにて、APIパスのprefix定義
path_prefix = Blueprint('api', __name__)

@path_prefix.route('/task', methods=['POST'])
def add_new_task():
    req_data = json.loads(request.data)
    if 'taskId' in req_data:
        del(req_data['taskId'])

    task = Task(req_data)

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict()), 200

@path_prefix.route('/task', methods=['PUT'])
def update_task():
    req_data = json.loads(request.data)

    # 更新なので、PK未指定は当然エラー
    if 'taskId' not in req_data:
        abort(400, {'msg':'更新オペレーションなので、PK(taskId)の指定は必須です。'})

    # 指定されたIDをSELECT
    task: Task = db.session.query(Task).filter_by(task_id=req_data['taskId']).first()

    # 指定されたIDのデータが見つからず
    if task is None:
        abort(404, {'msg':'指定されたtaskIdのデータが見つかりませんでした。'})

    # 値の更新
    task.set_attributes_from_dict(req_data)
    db.session.commit()

    return jsonify(task.to_dict()), 200


@path_prefix.route('/task/<task_id>', methods=['GET'])
def get_task_by_id(task_id):
    task: Task = Task.query.get(task_id)

    # 指定されたIDのデータが見つからず
    if task is None:
        abort(404, {'msg':'指定されたtaskIdのデータが見つかりませんでした。'})

    return jsonify(task.to_dict()), 200

@path_prefix.route('/task/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    task: Task = Task.query.get(task_id)

    # 指定されたIDのデータが見つからず
    if task is None:
        abort(404, {'msg':'指定されたtaskIdのデータが見つかりませんでした。'})

    # 見つかったタスクの削除
    db.session.delete(task)
    db.session.commit()

    return jsonify(task.to_dict()), 200

@path_prefix.route('/task/findAll', methods=['GET'])
def find_all_tasks():
    tasks = Task.query.all()

    return jsonify([x.to_dict() for x in tasks]), 200

@path_prefix.route('/login/<token>', methods=['GET'])
def login(token):
    decoded = jwt.decode(token, 'secret', algorithms=['HS256'])

    print(decoded)
    new_token = jwt.encode({"userId": decoded['userMail']}, 'secret', algorithm='HS256')
    return jsonify({"token": new_token.decode()}), 200

# テスト用トークン発行
@path_prefix.route('/token/<user_mail>', methods=['GET'])
def generate_token(user_mail: str):
    token = jwt.encode({"userMail": user_mail}, 'secret', algorithm='HS256')

    print(token)
    print(token.decode())

    return jsonify({"token": token.decode()}), 200

@path_prefix.route('/favicon.ico', methods=['GET'])
def favicon():
    return "", 200


@path_prefix.errorhandler(400)
@path_prefix.errorhandler(404)
@path_prefix.errorhandler(500)
def error_handler(error):
    try:
        response = {'message': error.description['msg'], 'statusCode': error.code}
    except:
        response = {'message': str(error), 'statusCode': 500}
    return jsonify(response), response['statusCode']
