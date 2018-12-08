import './css/base.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import { Router, Route, RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';

import * as _ from "lodash";

import * as Element from './elements/element';
import { TaskListPage} from './pages/tasklist';
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
          <li><Link to="/task">Task</Link></li>
          <li><Link to="/messages/10">Message</Link></li>
        </ul>
      </div>
    )
  }
}

export class About extends React.Component {
  render() {
    return <h3>About</h3>
  }
}

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


ReactDOM.render(
  <Router history={history}>
    <div>
      <Route exact path="/" component={App} />
      <Route path="/about" component={About} />
      <Route path="/task" component={TaskListPage} />
      <Route path="/messages/:id" component={Message} />
    </div>
  </Router>,
  document.querySelector('.content')
);