# -*- coding:utf-8 -*-

from flask import Flask, Blueprint, render_template, request, redirect, url_for, jsonify, abort
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
import json
import jwt
import datetime
import os
from distutils.util import strtobool
from functools import wraps
from typing import List, Any, Tuple, Dict

from py.appbase.database import db
from py.models.task import Task, TaskGroup, TaskStatus
from py.models.user import User, UserGroup
from py.utils.mail import send_mail

import numpy as np

SECRET = os.environ['login_secret']

# Blueprintにて、APIパスのprefix定義
api = Blueprint('api', __name__)

# ログイン用のデコレータ
# ログイン必須のアクションメソッドにこれを付ける
# これを付けたメソッドの第１引数にログインユーザが指定される
def login_required(method):
    @wraps(method)
    def wrapper(*args, **kwargs):
        authorization = request.headers.get('Authorization')
        user_agent = request.headers.get('User-Agent')
        _, token = authorization.split()
        try:
            decoded = jwt.decode(token, SECRET, algorithms='HS256')
        except jwt.DecodeError:
            abort(400, {'msg':'不正なトークン'})
        except jwt.ExpiredSignatureError:
            abort(400, {'msg':'トークン有効期限切れ'})
        if decoded.get('userAgent') != user_agent:
            # TODO: たぶんデバイスエラーは教えない方が良い→本番環境ではエラー理由を隠す
            abort(400, {'msg':'未知のデバイス'})
        user = User.query.filter_by(user_id=decoded['userId'], e_mail=decoded['eMail']).first()
        if user is None:
            abort(400, {'msg':'存在しないユーザでログインが試行されました'})

        # 元のメソッドの第１引数にログインユーザを付与してコールする
        return method(*((user,) + args), **kwargs)
    return wrapper

@api.route('/login/<token>', methods=['GET'])
def login(token):
    decoded = jwt.decode(token, SECRET, algorithms=['HS256'])
    user_agent = request.headers.get('User-Agent')

    # ログイン後のトークン有効期限 TODO:仮決め有効期限30日
    exp = datetime.datetime.utcnow() + datetime.timedelta(days=30)

    new_token = jwt.encode({
        "userId": decoded['user_id'], 
        "eMail": decoded['e_mail'], 
        "userAgent": user_agent,
        "exp": exp
        }, SECRET, algorithm='HS256')
    return jsonify({"token": new_token.decode()}), 200

@api.route('/entry', methods=['POST'])
def entry():
    req_data = json.loads(request.data)
    user: User = User.query.filter_by(e_mail=req_data['eMail']).first()
    if user is None:
        abort(400, {'msg':'存在しないユーザでログインが試行されました'})

    # 一時トークンの有効期限 10分
    exp = datetime.datetime.utcnow() + datetime.timedelta(minutes=10)
    token = jwt.encode({"user_id": user.user_id, "e_mail": user.e_mail, "exp": exp}, SECRET, algorithm='HS256')

    print(token)
    print(token.decode())
    # TODO: ログインURLが決め打ちなので、ちゃんと環境変化に強くする必要がある
    send_mail(user.e_mail, 'ログインURL', f"http://localhost:8080/login/{token.decode()}")

    return jsonify(user.to_dict([User])), 200


# テスト用トークン発行
@api.route('/token/<user_id>', methods=['GET'])
def generate_token(user_id: int):
    user: User = User.query.get(user_id)
    # トークンの有効期限 １時間
    exp = datetime.datetime.utcnow() + datetime.timedelta(hours=1)
    token = jwt.encode({"user_id": user_id, "e_mail": user.e_mail, "exp": exp}, SECRET, algorithm='HS256')

    print(token)
    print(token.decode())

    return jsonify({"token": token.decode()}), 200

@api.route('/taskGroup/findAll', methods=['GET'])
@login_required
def find_all_task_groups(login_user: User):
    is_archived = strtobool(request.args.get("isArchived", default='False', type=str))

    task_groups: List[TaskGroup] = \
        TaskGroup.query.filter(
            TaskGroup.user_group_id.in_([x.user_group_id for x in login_user.user_groups]),
            TaskGroup.is_archived==is_archived
            ).all()
    task_groups_dict_list = [x.to_dict([TaskGroup, TaskStatus, Task, UserGroup, User]) for x in task_groups]
    return jsonify(task_groups_dict_list), 200

# タスクの新規追加
@api.route('/task', methods=['POST'])
@login_required
def add_new_task(login_user: User):
    req_data = json.loads(request.data)
    if 'taskId' in req_data:
        del(req_data['taskId'])

    # TODO: task_group_idが本当にログインユーザに紐づくものかのチェックが必要

    task: Task = Task.get_instance(req_data)
    db.session.add(task)

    # DBのデータを取得
    db.session.merge(task)
    for status in task.task_group.task_statuses:
        if not status.is_done:
            task.task_status_id = status.task_status_id
            break

    db.session.commit()

    return jsonify(task.to_dict([Task, TaskStatus])), 200

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

    return jsonify(task.to_dict([Task, TaskStatus])), 200

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

    # TaskGroupの作成
    task_group: TaskGroup = TaskGroup.get_instance(req_data)
    task_group.user_group_id = login_user.user_groups[0].user_group_id
    db.session.add(task_group)

    # 子レコード登録のために、一旦DBに問い合わせてTaskGroupのPKを確定する
    db.session.merge(task_group)

    # TaskStatusの作成(デフォルトの2状態todo,doneを作成)
    task_status_todo: TaskStatus = TaskStatus('todo', False, task_group.task_group_id)
    task_status_done: TaskStatus = TaskStatus('done', True, task_group.task_group_id)
    db.session.add_all([task_status_todo, task_status_done])

    db.session.commit()

    return jsonify(task_group.to_dict([TaskGroup, TaskStatus])), 200

# タスクグループの更新
@api.route('/taskGroup', methods=['PUT'])
@login_required
def update_task_group(login_user: User):
    req_data = json.loads(request.data)

    # 更新なので、PK未指定は当然エラー
    if 'taskGroupId' not in req_data:
        abort(400, {'msg':'更新オペレーションなので、PK(taskGroupId)の指定は必須です。'})

    # TODO: task_group_idが本当にログインユーザに紐づくものかのチェックが必要

    # 指定されたIDをSELECT
    task_group: TaskGroup = db.session.query(TaskGroup).filter_by(task_group_id=req_data['taskGroupId']).first()

    # 指定されたIDのデータが見つからず
    if task_group is None:
        abort(404, {'msg':'指定されたtaskGroupIdのデータが見つかりませんでした。'})

    # 値の更新
    task_group.set_attributes_from_dict(req_data)
    db.session.commit()

    return jsonify(task_group.to_dict([TaskGroup, Task])), 200


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
