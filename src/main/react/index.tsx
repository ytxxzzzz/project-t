import './css/base.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import { Router, Route, RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import axios from 'axios';

import * as _ from "lodash";

import * as Element from './elements/element';
import { TaskListPage} from './pages/tasklist';
import {LoginPage} from './pages/login';
import {EntryPage} from './pages/entry';
import {TaskDialog} from './pageparts/dialogs';


const history = createHistory();

// TODO: バックエンドのURLを仮決めハードコード
const apiHost = `http://${window.location.hostname}:5000`
axios.defaults.baseURL = `${apiHost}/api`
axios.defaults.withCredentials = false  // 当面Cookieのやりとりは無し

interface MessageParams {
  id: string,
}
export class Message extends React.Component<RouteComponentProps<MessageParams>, any> {
  render() {
    return (
      <div>
        <h3>Message {this.props.match.params.id}</h3>
        <li><Link to="/">トップへ戻るわよ！</Link></li>
      </div>
    )
  }
}

interface HeaderProps {
}
interface HeaderStates {
}
export class Header extends React.Component<HeaderProps, HeaderStates> {
  render() {
    return (
      <div style={{backgroundColor: "#777", height: "30px", color: "#fff"}}>
      ヘッダ領域でっす
      </div>
    )
  }
}


ReactDOM.render(
  <Router history={history}>
    <div>
      <Header />
      <Route exact path="/" component={EntryPage} />
      <Route path="/login/:token" component={LoginPage} />
      <Route path="/task" component={TaskListPage} />
      <Route path="/messages/:id" component={Message} />
    </div>
  </Router>,
  document.querySelector('.content')
);