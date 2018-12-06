import './css/base.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import { Router, Route } from "react-router";
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import * as _ from "lodash";

import * as Element from './elements/element'
import {TaskDialog} from './pageparts/dialogs';

const history = createHistory();

interface AppProps {
}
interface AppState {
}
class App extends React.Component<AppProps, AppState> {
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/messages/10">Message</Link></li>
        </ul>
      </div>
    )
  }}

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
      <div className="task-list-base">
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
      <div className="task-group-base">
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
  isOpen: boolean
  task: TaskSchema
}
class Task extends React.Component<TaskProps, TaskState> {
  constructor(props: TaskProps) {
    super(props)
    this.state = {
      task: {
        taskTitle: props.task.taskTitle,
        taskDetail: props.task.taskDetail,
      },
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
  onSave(newValues: TaskSchema) {
    this.setState({
      task: newValues
    })
  }
  render() {
    const modalFuncProps: ModalFuncPropsSchema<TaskSchema> = {
      show: this.state.isOpen,
      onClose: this.toggleModal.bind(this),
      onSave: this.onSave.bind(this),
    }
    return (
      <div className="task-base" onClick={this.handleEditClick.bind(this)}>
        <Element.Output value={this.state.task.taskTitle}></Element.Output>

        <TaskDialog task={this.state.task} modalFuncProps={modalFuncProps}>
        </TaskDialog>
      </div>
    )
  }
}

/*
ReactDOM.render(
  <TaskListBase/>
  ,
  document.querySelector('.content')
);
*/

export class About extends React.Component {
  render() {
    return <h3>About</h3>
  }
}

export class Message extends React.Component {
  render() {
//    return <h3>Message {this.props.match.params.id}</h3>
    return <h3>Message</h3>
  }
}


ReactDOM.render(
  <Router history={history}>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/about" component={About} />
      <Route path="/messages/:id" component={Message} />
    </div>
  </Router>,
  document.querySelector('.content')
);