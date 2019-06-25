import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import { Router, Route, RouteComponentProps, Redirect } from "react-router";
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import axios from 'axios';

import * as _ from "lodash";

import * as Element from '../../elements/element';
import {TaskDialog} from '../../pageparts/dialogs';
import {TaskListPageContainerProps} from '../TaskListPage/TaskListPageContainer';
import {TaskBoardState, TaskGroupState, TaskState, TaskStatusState} from '../../redux-state/taskBoardState'
import {TaskGroupContainerProps} from './TaskGroupContainer'

type TaskGroupProps = TaskGroupContainerProps & TaskGroupState & TaskBoardState
interface TaskGroupUIState {
  isShowTaskAdding: boolean,
  taskAddingTitle: string,
}
export class TaskGroup extends React.Component<TaskGroupProps, TaskGroupUIState> {
  constructor(props: TaskGroupProps) {
    super(props)
    this.state = {
      isShowTaskAdding: false,
      taskAddingTitle: null,
    }
  }
  handleAddTaskClick() {
    this.setState({
      isShowTaskAdding: true,
    })
  }
  // タスク追加編集が確定されたとき
  async handleTaskAddingDecision(newTaskTitle: string) {
    // タイトルが指定されていなかったらタスク入力欄を非表示に
    if(newTaskTitle.trim().length == 0) {
      this.setState({
        isShowTaskAdding: false,
      })
      return
    }

    // タスクの登録
    const newTask: TaskState = {
      taskTitle: newTaskTitle,
      taskDetail: "",
      taskGroupId: this.props.taskGroupId,
    }
    const addedResponse = await axios.post(`/task`, newTask)
    const addedTask: TaskState = addedResponse.data

    this.props.addTask(addedTask)
    this.setState({
      isShowTaskAdding: false,
    })
  }
  async handleTaskGroupArchive(e: React.FormEvent<HTMLDivElement>) {
    const doArchive = confirm(`"${this.props.taskGroupTitle}" をアーカイブしますか？`)

    if(doArchive) {
      const response = await axios.put(`/taskGroup`, {
        taskGroupId: this.props.taskGroupId,
        isArchived: true,
      })
      this.props.updateTaskGroup(response.data)
    }
  }
  async handleTaskGroupNameChanged(newTaskGroupName: string) {
    const response = await axios.put(`/taskGroup`, {
      taskGroupId: this.props.taskGroupId,
      taskGroupTitle: newTaskGroupName,
    })
    this.props.updateTaskGroup(response.data)
  }
  render() {
    if(this.props.isArchived) {
      return null
    }
    return (
      <div className="task-group-base">
        <div className="fas fa-times fa-2x taskgroup-close-btn" onClick={this.handleTaskGroupArchive.bind(this)} ></div>
        <Element.EditableDiv
          defaultValue={this.props.taskGroupTitle}
          handleValueDetermined={this.handleTaskGroupNameChanged.bind(this)}
        />
        {
          this.props.tasks
            .filter(task => task.taskGroupId == this.props.taskGroupId)
            .map(task => {
              return (
                <Element.Output value={task.taskTitle}></Element.Output>
              )
            })
        }
        <Element.Button caption="タスク追加" handleClick={this.handleAddTaskClick.bind(this)}></Element.Button>
      </div>
    )
  }
}
