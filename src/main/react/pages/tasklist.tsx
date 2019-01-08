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
        ModalFuncPropsSchema} from '../models/models';
import * as Element from '../elements/element';
import {TaskDialog} from '../pageparts/dialogs';

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
    try{
      const result = await axios.get(`/taskGroup/findAll`)
      this.setState({taskGroups: result.data})
    } catch(e) {
      try{
        alert(JSON.stringify(e.response.data, null, " "))
      } catch(e2) {
        alert(e.message)
      }
    }
  }
  async handleAddTaskGroupClick() {
    const taskGroups = this.state.taskGroups

    const newTaskGroup: TaskGroupSchema = {
      taskGroupTitle: "新しいグループ",
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
  isShowTaskAdding: boolean,
  taskAddingTitle: string,
  tasks: TaskSchema[],
}
class TaskGroup extends React.Component<TaskGroupProps, TaskGroupState> {
  constructor(props: TaskGroupProps) {
    super(props)
    this.state = {
      taskGroupTitle: props.taskGroup.taskGroupTitle,
      isShowTaskAdding: false,
      taskAddingTitle: null,
      tasks: props.taskGroup.tasks,
    }
  }
  handleAddTaskClick() {
    this.setState({
      isShowTaskAdding: true,
    })
  }
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

    const tasks = this.state.tasks
    tasks.push(addedTask)

    this.setState({
      tasks: tasks,
      isShowTaskAdding: false,
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
  async onSave(newValues: TaskSchema) {
    const response = await axios.put(`/task`, newValues)
    this.setState({
      task: response.data
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
