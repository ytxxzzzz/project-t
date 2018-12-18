import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import { Router, Route, RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import axios from 'axios';

import * as _ from "lodash";

import * as Element from '../elements/element'

interface EntryPageProps {
}
interface EntryPageState {
  [key: string]: any  // シグネチャを追加して、フィールドの動的アクセスを許可
  userId: string
}
export class EntryPage extends React.Component<EntryPageProps, EntryPageState> {
  constructor(props: EntryPageProps) {
    super(props)
    this.state = {
      userId: "",
    }
  }
  handleModalInput(e: any) {
    const newState: EntryPageState = _.cloneDeep(this.state)
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }
  async onEntry() {
    alert(`${this.state.userId}`)
    await axios.get(`http://localhost:5000/Entry/${this.state.userId}`)
  }
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/task">Task</Link></li>
          <li><Link to="/messages/10">Message</Link></li>
        </ul>
        <ul>
          <li>
            <label htmlFor="userId">ユーザID</label>
            <Element.Input 
              name="userId"
              handleChange={this.handleModalInput.bind(this)}
            />
          </li>
        </ul>
        <div>
          <button onClick={this.onEntry.bind(this)}>
            ログインメール送信
          </button>
        </div>
      </div>
    )
  }
}
