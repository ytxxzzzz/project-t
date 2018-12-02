import './css/base.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import * as _ from "lodash";

import * as Element from './elements/element'
import {TaskDialog} from './pageparts/dialogs';

// action定義
interface ADD_TODO
{
  type: 'ADD_TODO',
  text: 'Build my first Redux app'
}

interface TaskListBaseProps {
}
interface TaskListBaseState {
  taskGroups: TaskGroupSchema[]
}
class TaskListBase extends React.Component<TaskListBaseProps, TaskListBaseState> {
  constructor(props: TaskListBaseProps) {
    super(props)
    this.state = {
      taskGroups: [{
        taskGroupId: 1,
        taskGroupTitle: "taskGroup_title",
        tasks: [
          {
            taskId: 1,
            taskTitle: "task_title",
            taskDetail: "task_detail",
          },
          {
            taskId: 2,
            taskTitle: "task_titleその２",
            taskDetail: "task_detailその２",
          }
        ]
      }],
    }
  }
  reloadTaskGroups() {
    this.setState({
      taskGroups: [{
        taskGroupId: 1,
        taskGroupTitle: "taskGroup_title",
        tasks: [{
          taskId: 1,
          taskTitle: "task_title",
          taskDetail: "task_detail",
        }]
      }]
    })
  }
  handleAddTaskGroupClick() {
    const taskGroups = this.state.taskGroups

    taskGroups.push({
      taskGroupTitle: "新しいタスクグループ",
      tasks: [],
    })

    this.setState({
      taskGroups: taskGroups,
    })
  }
  render() {
    return (
      <div>
        {
          this.state.taskGroups.map(taskGroup => {
            return (
              <TaskGroup taskGroup={taskGroup}></TaskGroup>
            )
          })
        }
        <Element.Button caption="タスクグループ追加" handleClick={this.handleAddTaskGroupClick.bind(this)}></Element.Button>
      </div>
    )
  }
}

interface TaskGroupProps {
  taskGroup: TaskGroupSchema
}
interface TaskGroupState {
  taskGroupTitle: string,
  tasks: TaskSchema[],
}
class TaskGroup extends React.Component<TaskGroupProps, TaskGroupState> {
  constructor(props: TaskGroupProps) {
    super(props)
    this.state = {
      taskGroupTitle: props.taskGroup.taskGroupTitle,
      tasks: props.taskGroup.tasks,
    }
  }
  handleAddTaskClick() {
    const tasks = this.state.tasks

    tasks.push({
      taskTitle: "新しいタスク",
      taskDetail: "タスクの詳細",
    })

    this.setState({
      tasks: tasks,
    })
  }
  render() {
    return (
      <div>
        <Element.Output value={this.state.taskGroupTitle}></Element.Output>
        {
          this.props.taskGroup.tasks.map(task => {
            return (
              <Task task={task}></Task>
            )
          })
        }
        <Element.Button caption="タスク追加" handleClick={this.handleAddTaskClick.bind(this)}></Element.Button>
      </div>
    )
  }
}

interface TaskProps {
  task: TaskSchema
}
interface TaskState {
  [key: string]: any  // シグネチャを追加して、フィールドの動的アクセスを許可
  taskTitle: string
  taskDetail: string
  isOpen: boolean
}
class Task extends React.Component<TaskProps, TaskState> {
  constructor(props: TaskProps) {
    super(props)
    this.state = {
      taskTitle: props.task.taskTitle,
      taskDetail: props.task.taskDetail,
      isOpen: false,
    }
  }
  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  handleEditClick() {
    this.toggleModal()
  }
  handleModalInput(e: any) {
    const newState: TaskState = _.cloneDeep(this.state)
    newState[e.target.name] = e.target.value
    var validateFunc = null
    this.setState(newState, validateFunc)
  }
  render() {
    return (
      <div>
        <Element.Output value={this.state.taskTitle}></Element.Output>
        <Element.Output value={this.state.taskDetail}></Element.Output>
        <Element.Button caption="タスクの編集" handleClick={this.handleEditClick.bind(this)}></Element.Button>

        <TaskDialog show={this.state.isOpen} onClose={this.toggleModal}>
        </TaskDialog>
      </div>
    )
  }
}


ReactDOM.render(
  <TaskListBase/>
  ,
  document.querySelector('.content')
);
