import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import { Router, Route, RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import axios from 'axios';

import * as _ from "lodash";

import {TaskGroupSchema, 
        TaskSchema,
        TaskStatusSchema,
        ModalFuncPropsSchema} from '../models/models';
import * as Element from '../elements/element';
import {TaskDialog} from '../pageparts/dialogs';

interface ErrorBoundaryProps {
}
interface ErrorBoundaryState {
  hasError: boolean
}
export class ErrorBoundary extends React.Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  /********* これが新しく追加 ************/
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    // Display fallback UI
    this.setState({ hasError: true });
    // You can also log the error to an error reporting service
    console.log(`${JSON.stringify(error)}¥n ${JSON.stringify(errorInfo)}`)
    console.log()
  }

  render() {
    if (this.state.hasError) {
      return
    }
    return this.props.children;
  }
}

interface TaskListPageProps {
}
interface TaskListPageState {
  taskGroups: TaskGroupSchema[]
}
export class TaskListPage extends React.Component<TaskListPageProps, TaskListPageState> {
  constructor(props: TaskListPageProps) {
    super(props)
    this.state = {
      taskGroups: [],
    }
  }
  componentWillMount() {
    this.onInit()
  }
  async onInit() {
      const result = await axios.get(`/taskGroup/findAll`, {
        params: {
          isArchived: false
        }
      })
      this.setState({taskGroups: result.data})
  }
  async handleAddTaskGroupClick() {
    const taskGroups = this.state.taskGroups

    const newTaskGroup: TaskGroupSchema = {
      taskGroupTitle: "新しいリスト",
      isArchived: false,
      tasks: [],
    }

    const addedResponse = await axios.post(`/taskGroup`, newTaskGroup)
    taskGroups.push(addedResponse.data)

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
        <Element.Button caption="タスクリスト追加" handleClick={this.handleAddTaskGroupClick.bind(this)}></Element.Button>
      </div>
    )
  }
}

interface TaskGroupProps {
  taskGroup: TaskGroupSchema
}
interface TaskGroupState {
  taskGroup: TaskGroupSchema
  isShowTaskAdding: boolean,
  taskAddingTitle: string,
}
class TaskGroup extends React.Component<TaskGroupProps, TaskGroupState> {
  constructor(props: TaskGroupProps) {
    super(props)
    this.state = {
      taskGroup: props.taskGroup,
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

interface TaskAddingPartProps {
  isShow: boolean,
  handleTaskDecision?(newTaskTitle: string): void
}
interface TaskAddingPartState {
  taskTitle: string,
}
class TaskAddingPart extends React.Component<TaskAddingPartProps, TaskAddingPartState> {
  handleBlur(e: React.FormEvent<HTMLTextAreaElement>) {
    this.props.handleTaskDecision(e.currentTarget.value)
  }
  render() {
    if(!this.props.isShow) {
      return null;
    }
    return(
      <div className="task-adding-part">
        <Element.MultiLineInput handleBlur={this.handleBlur.bind(this)} />
      </div>
    )
  }
}


interface TaskProps {
  task: TaskSchema
  taskStatuses: TaskStatusSchema[]
}
interface TaskState {
  isOpen: boolean
  task: TaskSchema
}
class Task extends React.Component<TaskProps, TaskState> {
  constructor(props: TaskProps) {
    super(props)
    this.state = {
      task: props.task,
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
  async onSave(newTask: TaskSchema) {
    const response = await axios.put(`/task`, newTask)
    this.setState({
      task: response.data
    })
  }
  async handleCheck() {
    const isDone = this.state.task.taskStatus.isDone
    const newStatusId = this.props.taskStatuses.map((status)=>{
      return (status.isDone == !isDone)? status.taskStatusId : null
    }).filter((statusId)=>statusId != null).pop()
    
    const newTask = _.cloneDeep(this.state.task)
    newTask.taskStatusId = newStatusId

    const response = await axios.put(`/task`, newTask)
    this.setState({
      task: response.data
    })
  }
  getCheckboxId() {
    return `task-checkbox-${this.props.task.taskId}`
  }
  async handleTaskArchive(e: React.FormEvent<HTMLDivElement>) {
    e.stopPropagation()
    const doArchive = confirm(`"${this.state.task.taskTitle}" をアーカイブしますか？`)

    if(doArchive) {
      const response = await axios.put(`/task`, {
        taskId: this.state.task.taskId,
        isArchived: true,
      })
      this.setState({
        task: response.data
      })
    }
  }
  render() {
    if(this.state.task.isArchived) {
      return null
    }
    const modalFuncProps: ModalFuncPropsSchema<TaskSchema> = {
      show: this.state.isOpen,
      onClose: this.toggleModal.bind(this),
      onSave: this.onSave.bind(this),
    }
    return (
      <div className="task-base" onClick={this.handleEditClick.bind(this)}>
        <input type="checkbox" className="task-checkbox"
          id={this.getCheckboxId()}
          defaultChecked={this.state.task.taskStatus.isDone}
          onChange={this.handleCheck.bind(this)}
          onClick={(e)=>{e.stopPropagation()/*親要素へのクリックイベント伝播阻止*/}}
        />
        <label htmlFor={this.getCheckboxId()}
          onClick={(e)=>{e.stopPropagation()/*親要素へのクリックイベント伝播阻止*/}}
        >{"　"}
        </label>
        {this.state.task.taskTitle}
        <div className="fas fa-times fa-2x taskgroup-close-btn" onClick={this.handleTaskArchive.bind(this)} ></div>
        <TaskDialog task={this.state.task} modalFuncProps={modalFuncProps}>
        </TaskDialog>
      </div>
    )
  }
}
