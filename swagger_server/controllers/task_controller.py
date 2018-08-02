import connexion
import six

from swagger_server.models.task import Task  # noqa: E501
from swagger_server import util


def add_new_task(body=None):  # noqa: E501
    """タスクを新規作成する

     # noqa: E501

    :param body: タスクの初期値があればbodyに指定する。なければ空のタスクを新規作成する
    :type body: dict | bytes

    :rtype: Task
    """
    if connexion.request.is_json:
        body = Task.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def delete_task(taskId):  # noqa: E501
    """Deletes a task

     # noqa: E501

    :param taskId: Task id to delete
    :type taskId: int

    :rtype: None
    """
    return 'do some magic!'


def find_task_all():  # noqa: E501
    """Find All Tasks

    タスク全件取得 # noqa: E501


    :rtype: List[Task]
    """
    return 'do some magic!'


def get_task_by_id(taskId):  # noqa: E501
    """Find task by ID

    Returns a single task # noqa: E501

    :param taskId: ID of task to return
    :type taskId: int

    :rtype: Task
    """
    return 'do some magic!'


def update_task(body):  # noqa: E501
    """タスクの情報を更新する

     # noqa: E501

    :param body: 更新したい項目をパラメータのオブジェクトへ指定する
    :type body: dict | bytes

    :rtype: Task
    """
    if connexion.request.is_json:
        body = Task.from_dict(connexion.request.get_json())  # noqa: E501
    return 'do some magic!'


def update_task_with_form(taskId, title=None, content=None, status=None):  # noqa: E501
    """Updates a task with form data

     # noqa: E501

    :param taskId: ID of pet that needs to be updated
    :type taskId: int
    :param title: Updated title of the task
    :type title: str
    :param content: Updated content of the task
    :type content: str
    :param status: Updated status of the task
    :type status: str

    :rtype: None
    """
    return 'do some magic!'
