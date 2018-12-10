import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import { Router, Route, RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import * as _ from "lodash";

import * as Element from '../elements/element'
import {TaskDialog} from '../pageparts/dialogs';

interface LoginPageProps {
}
interface LoginPageState {
  [key: string]: any  // シグネチャを追加して、フィールドの動的アクセスを許可
  userId: string
  password: string
}
export class LoginPage extends React.Component<LoginPageProps, LoginPageState> {
  constructor(props: LoginPageProps) {
    super(props)
    this.state = {
      userId: "",
      password: "",
    }
  }
  handleModalInput(e: any) {
    const newState: LoginPageState = _.cloneDeep(this.state)
    newState[e.target.name] = e.target.value
    this.setState(newState)
  }
  onLogin() {
    alert(`${this.state.userId}   ${this.state.password}`)
  }
  render() {
    return (
      <div>
        <h1>App</h1>
        <ul>
          <li><Link to="/about">About</Link></li>
          <li><Link to="/task">Task</Link></li>
          <li><Link to="/messages/10">Message</Link></li>
        </ul>
        <ul>
          <li>
            <label htmlFor="title">ユーザID</label>
            <Element.Input 
              name="userId"
              handleChange={this.handleModalInput.bind(this)}
            />
          </li>
          <li>
            <label htmlFor="detail">パスワード</label>
            <Element.Input
              name="password" 
              handleChange={this.handleModalInput.bind(this)}
              />
          </li>
        </ul>
        <div>
          <button onClick={this.onLogin.bind(this)}>
            ログイン
          </button>
        </div>
      </div>
    )
  }
}
