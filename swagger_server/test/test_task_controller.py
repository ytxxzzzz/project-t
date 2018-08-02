# coding: utf-8

from __future__ import absolute_import

from flask import json
from six import BytesIO

from swagger_server.models.task import Task  # noqa: E501
from swagger_server.test import BaseTestCase


class TestTaskController(BaseTestCase):
    """TaskController integration test stubs"""

    def test_add_new_task(self):
        """Test case for add_new_task

        タスクを新規作成する
        """
        body = Task()
        response = self.client.open(
            '/v1/task',
            method='POST',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_delete_task(self):
        """Test case for delete_task

        Deletes a task
        """
        response = self.client.open(
            '/v1/task/{taskId}'.format(taskId=789),
            method='DELETE')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_find_task_all(self):
        """Test case for find_task_all

        Find All Tasks
        """
        response = self.client.open(
            '/v1/task/findAll',
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_get_task_by_id(self):
        """Test case for get_task_by_id

        Find task by ID
        """
        response = self.client.open(
            '/v1/task/{taskId}'.format(taskId=789),
            method='GET')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_task(self):
        """Test case for update_task

        タスクの情報を更新する
        """
        body = Task()
        response = self.client.open(
            '/v1/task',
            method='PUT',
            data=json.dumps(body),
            content_type='application/json')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))

    def test_update_task_with_form(self):
        """Test case for update_task_with_form

        Updates a task with form data
        """
        data = dict(title='title_example',
                    content='content_example',
                    status='status_example')
        response = self.client.open(
            '/v1/task/{taskId}'.format(taskId=789),
            method='POST',
            data=data,
            content_type='application/x-www-form-urlencoded')
        self.assert200(response,
                       'Response body is : ' + response.data.decode('utf-8'))


if __name__ == '__main__':
    import unittest
    unittest.main()
