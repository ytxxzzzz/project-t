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
import {TaskBoardProps} from '../TaskListPage/TaskListPageContainer';
import {TaskBoardState, TaskGroupState, TaskState, TaskStatusState} from '../../redux-state/taskBoardState'

interface TaskGroupProps {
  taskGroupId: number,
}
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
    const newTask: TaskSchema = {
      taskTitle: newTaskTitle,
      taskDetail: "",
      taskGroupId: this.props.taskGroup.taskGroupId,
    }
    const addedResponse = await axios.post(`/task`, newTask)
    const addedTask: TaskSchema = addedResponse.data

    const tasks = this.state.taskGroup.tasks
    tasks.push(addedTask)
    const taskGroup = this.state.taskGroup
    taskGroup.tasks = tasks
    
    this.setState({
      taskGroup: taskGroup,
      isShowTaskAdding: false,
    })
  }
  async handleTaskGroupArchive(e: React.FormEvent<HTMLDivElement>) {
    const doArchive = confirm(`"${this.state.taskGroup.taskGroupTitle}" をアーカイブしますか？`)

    if(doArchive) {
      const response = await axios.put(`/taskGroup`, {
        taskGroupId: this.state.taskGroup.taskGroupId,
        isArchived: true,
      })
      this.setState({
        taskGroup: response.data
      })
    }
  }
  async handleTaskGroupNameChanged(newTaskGroupName: string) {
    const response = await axios.put(`/taskGroup`, {
      taskGroupId: this.state.taskGroup.taskGroupId,
      taskGroupTitle: newTaskGroupName,
    })
    this.setState({
      taskGroup: response.data
    })
  }
  render() {
    if(this.state.taskGroup.isArchived) {
      return null
    }
    return (
      <div className="task-group-base">
        <div className="fas fa-times fa-2x taskgroup-close-btn" onClick={this.handleTaskGroupArchive.bind(this)} ></div>
        <Element.EditableDiv
          defaultValue={this.state.taskGroup.taskGroupTitle}
          handleValueDetermined={this.handleTaskGroupNameChanged.bind(this)}
        />
        {
          this.state.taskGroup.tasks.map(task => {
            return (
              <Task task={task} taskStatuses={this.state.taskGroup.taskStatuses}></Task>
            )
          })
        }
        <TaskAddingPart 
          isShow={this.state.isShowTaskAdding}
          handleTaskDecision={this.handleTaskAddingDecision.bind(this)}
        />
        <Element.Button caption="タスク追加" handleClick={this.handleAddTaskClick.bind(this)}></Element.Button>
      </div>
    )
  }
}
