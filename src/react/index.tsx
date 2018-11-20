/* reactとreact-domの読み込み */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import * as _ from "lodash";

/* アプリ本体となる「Indexコンポーネント」 */
interface IndexProps {
  hello: string
}
interface IndexState {
  inputValue: string
  outputValue: string
}
class Index extends React.Component<IndexProps, IndexState> {
  constructor(props: IndexProps) {
    super(props)
    this.state = {
      inputValue: '',
      outputValue: '',
    }
    this.handleChange = this.handleChange.bind(this)
    this.handleClick = this.handleClick.bind(this)
  }
  handleChange(e: any): void {
    this.setState({
      inputValue: e.target.value,
    })
  }
  handleClick(): void {
    this.setState({
      inputValue: '',
      outputValue: this.state.inputValue,
    })
  }
  render() {
    return (
      <div>
        <Input value={this.state.inputValue} handleChange={this.handleChange} />
        <Button caption="編集" handleClick={this.handleClick} />
        <Output hello="Hello" value={this.state.outputValue} />
      </div>
    )
  }
}

/* 入力フォームを出力する「Inputコンポーネント」 */
interface InputProps {
  value: string
  handleChange(e: any): void
}
const Input: React.StatelessComponent<InputProps> = (props) => {
  return (
    <input type="text" placeholder="Input Name" value={props.value} onChange={props.handleChange} />
  )
}

/* ボタンを出力する「Buttonコンポーネント」 */
interface ButtonProps {
  caption: string
  handleClick(): void
}
const Button: React.StatelessComponent<ButtonProps> = (props) => {
  const style = {
    "min-width": "64px",
    "line-height": "32px",
    "border-radius": "4px",
    "border": "none",
    "padding": "0 16px",
    "color": "#fff",
    "background": "#4CAF50",
    "cursor": "pointer",
  };
  return (
    <button style={style} onClick={props.handleClick}>{props.caption}</button>
  )
}

/* テキストを出力する「Outputコンポーネント」 */
interface OutputProps {
  hello: string
  value: string
}
const Output: React.StatelessComponent<OutputProps> = (props) => {
  const value = (props.value !== '') ? <h1>{props.hello} {props.value} !</h1> : ''
  return (
    <div>{value}</div>
  )
}

// action定義
interface ADD_TODO
{
  type: 'ADD_TODO',
  text: 'Build my first Redux app'
}

interface TaskGroupSchema {
  taskGroupId?: number
  taskGroupTitle: string
  tasks: TaskSchema[]
}
interface TaskSchema {
  taskId?: number
  taskTitle: string
  taskDetail: string
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
        <Button caption="タスクグループ追加" handleClick={this.handleAddTaskGroupClick.bind(this)}></Button>
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
      taskDetail: "",
    })

    this.setState({
      tasks: tasks,
    })
  }
  render() {
    return (
      <div>
        <Output hello={this.state.taskGroupTitle} value={this.state.taskGroupTitle}></Output>
        {
          this.props.taskGroup.tasks.map(task => {
            return (
              <Task task={task}></Task>
            )
          })
        }
        <Button caption="タスク追加" handleClick={this.handleAddTaskClick.bind(this)}></Button>
      </div>
    )
  }
}

interface TaskProps {
  task: TaskSchema
}
interface TaskState {
  taskTitle: string
  taskDetail: string
}
class Task extends React.Component<TaskProps, TaskState> {
  constructor(props: TaskProps) {
    super(props)
    this.state = {
      taskTitle: props.task.taskTitle,
      taskDetail: props.task.taskDetail
    }
  }
  handleEditClick() {
    this.setState({
      taskTitle: this.state.taskTitle + "_タイトル編集_",
      taskDetail: this.state.taskDetail + "_詳細編集_"
    })
  }
  render() {
    return (
      <div>
        <Output hello={this.state.taskTitle} value={this.state.taskTitle}></Output>
        <Output hello={this.state.taskDetail} value={this.state.taskDetail}></Output>
        <Button caption="タスクの編集" handleClick={this.handleEditClick.bind(this)}></Button>
      </div>
    )
  }
}


ReactDOM.render(
  <TaskListBase/>
  ,
  document.querySelector('.content')
);
