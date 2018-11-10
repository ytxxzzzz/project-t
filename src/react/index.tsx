/* reactとreact-domの読み込み */
import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";

/* アプリ本体となる「Indexコンポーネント」 */
interface IndexProps {
  hello: string;
}
interface IndexState {
  inputValue: string;
  outputValue: string;
}
class Index extends React.Component<IndexProps, IndexState> {
  constructor(props: IndexProps) {
    super(props);
    this.state = {
      inputValue: '',
      outputValue: '',
    }
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  handleChange(e: any): void {
    this.setState({
      inputValue: e.target.value,
    });
  }
  handleClick(): void {
    this.setState({
      inputValue: '',
      outputValue: this.state.inputValue,
    });
  }
  render() {
    return (
      <div>
        <Input value={this.state.inputValue} handleChange={this.handleChange} />
        <Button handleClick={this.handleClick} />
        <Output hello="Hello" value={this.state.outputValue} />
      </div>
    );
  }
}

/* 入力フォームを出力する「Inputコンポーネント」 */
interface InputProps {
  value: string;
  handleChange(e: any): void;
}
const Input: React.StatelessComponent<InputProps> = (props) => {
  return (
    <input type="text" placeholder="Input Name" value={props.value} onChange={props.handleChange} />
  );
}

/* ボタンを出力する「Buttonコンポーネント」 */
interface ButtonProps {
  handleClick(): void;
}
const Button: React.StatelessComponent<ButtonProps> = (props) => {
  return (
    <button onClick={props.handleClick}>Send</button>
  );
}

/* テキストを出力する「Outputコンポーネント」 */
interface OutputProps {
  hello: string;
  value: string;
}
const Output: React.StatelessComponent<OutputProps> = (props) => {
  const value = (props.value !== '') ? <h1>{props.hello} {props.value} !</h1> : '';
  return (
    <div>{value}</div>
  );
}

// action定義
interface ADD_TODO
{
  type: 'ADD_TODO',
  text: 'Build my first Redux app'
}

interface TaskGroupSchema {
  id: number;
  title: string;
  tasks: TaskSchema[];
}
interface TaskSchema {
  id: number;
  title: string;
  detail: string;
}
interface TaskListBaseProps {
}
interface TaskListBaseState {
  taskGroups: TaskGroupSchema[];
}
class TaskListBase extends React.Component<TaskListBaseProps, TaskListBaseState> {
  constructor(props: TaskListBaseProps) {
    super(props);
    this.state = {
      taskGroups: [],
    }
    
    this.handleChange = this.handleChange.bind(this);
    this.handleClick = this.handleClick.bind(this);
  }
  reloadTaskGroups() {
    this.setState({
      taskGroups: [{
        id: 1,
        title: "taskGroup_title",
        tasks: [{
          id: 1,
          title: "task_title",
          detail: "task_detail",
        }]
  }]})
    this.state.taskGroups
  }
  handleChange(e: any): void {
    this.setState({
      inputValue: e.target.value,
    });
  }
  handleClick(): void {
    this.setState({
      inputValue: '',
      outputValue: this.state.inputValue,
    });
  }
  render() {
    return (
      <div>
        {
          this.state.taskGroups.map((taskGroup, index)=> {
          })
        }
        <Input value={this.state.inputValue} handleChange={this.handleChange} />
        <Button handleClick={this.handleClick} />
        <Output hello="Hello" value={this.state.outputValue} />
      </div>
    );
  }
}


interface TaskGroupProps {
  taskGroups: TaskGroup[];
}
interface TaskGroupState {
}
class TaskGroup extends React.Component<TaskGroupProps, TaskGroupState> {

}



ReactDOM.render(
  <Index hello="Hello" />,
  document.querySelector('.content')
);
