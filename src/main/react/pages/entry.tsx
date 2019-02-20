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
  eMail: string
}
export class EntryPage extends React.Component<EntryPageProps, EntryPageState> {
  constructor(props: EntryPageProps) {
    super(props)
    this.state = {
      eMail: "",
    }
  }
  handleModalInput(e: any) {
    const newState: EntryPageState = _.cloneDeep(this.state)
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }
  async onEntry() {
    if(this.state.eMail.length == 0) {
      return
    }
    alert(`${this.state.eMail}`)
    const response = await axios.post(`/entry`, {
      eMail: this.state.eMail,
    })
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
            <label htmlFor="eMail">メールアドレス</label>
            <Element.Input 
              name="eMail"
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
