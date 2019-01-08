# -*- coding:utf-8 -*-

from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
import jwt
import datetime
from functools import wraps

from py.appbase.database import db
from py.models.task import Task, TaskGroup
from py.models.user import User, UserGroup

import numpy as np

# Blueprintにて、APIパスのprefix定義
api = Blueprint('api', __name__)

# ログイン用のデコレータ
# ログイン必須のアクションメソッドにこれを付ける
# これを付けたメソッドの第１引数にログインユーザが指定される
def login_required(method):
    @wraps(method)
    def wrapper(*args, **kwargs):
        header = request.headers.get('Authorization')
        _, token = header.split()
        try:
            # TODO: シークレット固定
            decoded = jwt.decode(token, 'secret', algorithms='HS256')
        except jwt.DecodeError:
            abort(400, {'msg':'不正なトークン'})
        except jwt.ExpiredSignatureError:
            abort(400, {'msg':'トークン有効期限切れ'})
        user = User.query.filter_by(user_id=decoded['userId'], e_mail=decoded['eMail']).first()
        if user is None:
            abort(400, {'msg':'存在しないユーザでログインが試行されました'})

        # 元のメソッドの第１引数にログインユーザを付与してコールする
        return method(*((user,) + args), **kwargs)
    return wrapper

@api.route('/login/<token>', methods=['GET'])
def login(token):
    # TODO: シークレット固定
    decoded = jwt.decode(token, 'secret', algorithms=['HS256'])

    # ログイン後のトークン有効期限 TODO:仮決め有効期限7日
    exp = datetime.datetime.utcnow() + datetime.timedelta(days=7)

    new_token = jwt.encode({"userId": decoded['user_id'], "eMail": decoded['e_mail'], "exp": exp}, 'secret', algorithm='HS256')
    return jsonify({"token": new_token.decode()}), 200

# テスト用トークン発行
@api.route('/token/<user_id>', methods=['GET'])
def generate_token(user_id: int):
    user: User = User.query.get(user_id)
    # トークンの有効期限 TODO:仮決め有効期限1日
    exp = datetime.datetime.utcnow() + datetime.timedelta(days=1)
    # TODO: シークレット固定
    token = jwt.encode({"user_id": user_id, "e_mail": user.e_mail, "exp": exp}, 'secret', algorithm='HS256')

    print(token)
    print(token.decode())

    return jsonify({"token": token.decode()}), 200

@api.route('/taskGroup/findAll', methods=['GET'])
@login_required
def find_all_task_groups(login_user: User):
    task_groups: list[TaskGroup] = TaskGroup.query.filter(TaskGroup.user_group_id.in_([x.user_group_id for x in login_user.user_groups])).all()
    task_groups_dict_list = [x.to_dict([TaskGroup, Task, UserGroup, User]) for x in task_groups]
    return jsonify(task_groups_dict_list), 200

# タスクの新規追加
@api.route('/task', methods=['POST'])
@login_required
def add_new_task(login_user: User):
    req_data = json.loads(request.data)
    if 'taskId' in req_data:
        del(req_data['taskId'])

    # TODO: task_group_idが本当にログインユーザに紐づくものかのチェックが必要

    task = Task.get_instance(req_data)

    db.session.add(task)
    db.session.commit()

    return jsonify(task.to_dict([Task])), 200

# タスクの更新
@api.route('/task', methods=['PUT'])
@login_required
def update_task(login_user: User):
    req_data = json.loads(request.data)

    # 更新なので、PK未指定は当然エラー
    if 'taskId' not in req_data:
        abort(400, {'msg':'更新オペレーションなので、PK(taskId)の指定は必須です。'})

    # TODO: task_group_idが本当にログインユーザに紐づくものかのチェックが必要

    # 指定されたIDをSELECT
    task: Task = db.session.query(Task).filter_by(task_id=req_data['taskId']).first()

    # 指定されたIDのデータが見つからず
    if task is None:
        abort(404, {'msg':'指定されたtaskIdのデータが見つかりませんでした。'})

    # 値の更新
    task.set_attributes_from_dict(req_data)
    db.session.commit()

    return jsonify(task.to_dict([Task])), 200

# タスクグループの新規追加
@api.route('/taskGroup', methods=['POST'])
@login_required
def add_new_task_group(login_user: User):
    req_data = json.loads(request.data)
    if 'taskGroupId' in req_data:
        del(req_data['taskGroupId'])

    if len(login_user.user_groups) != 1:
        # TODO: １ユーザに対し複数のユーザグループは現在未対応です
        abort(400, {'msg': '１ユーザに対し複数のユーザグループは現在未対応です'})

    # TODO: task_group_idが本当にログインユーザに紐づくものかのチェックが必要

    task_group: TaskGroup = TaskGroup.get_instance(req_data)
    task_group.user_group_id = login_user.user_groups[0].user_group_id

    db.session.add(task_group)
    db.session.commit()

    return jsonify(task_group.to_dict([TaskGroup])), 200


@api.route('/task/<task_id>', methods=['GET'])
def get_task_by_id(task_id):
    task: Task = Task.query.get(task_id)

    # 指定されたIDのデータが見つからず
    if task is None:
        abort(404, {'msg':'指定されたtaskIdのデータが見つかりませんでした。'})

    return jsonify(task.to_dict()), 200

@api.route('/task/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    task: Task = Task.query.get(task_id)

    # 指定されたIDのデータが見つからず
    if task is None:
        abort(404, {'msg':'指定されたtaskIdのデータが見つかりませんでした。'})

    # 見つかったタスクの削除
    db.session.delete(task)
    db.session.commit()

    return jsonify(task.to_dict()), 200

@api.route('/favicon.ico', methods=['GET'])
def favicon():
    return "", 200


@api.errorhandler(400)
@api.errorhandler(404)
@api.errorhandler(500)
def error_handler(error):
    try:
        response = {'message': error.description['msg'], 'statusCode': error.code}
    except:
        response = {'message': str(error), 'statusCode': 500}
    return jsonify(response), response['statusCode']
