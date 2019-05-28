import './css/base.css';

import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import { Router, Route, RouteComponentProps } from "react-router";
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import axios, { AxiosResponse } from 'axios';
import {AxiosRequestConfig} from 'axios';
import {createStore, combineReducers, Action} from 'redux'
import { Provider } from 'react-redux';

import * as _ from "lodash";

import * as Element from './elements/element';
import { TaskListPage} from './pages/tasklist';
import {LoginPage} from './pages/login';
import {EntryPage} from './pages/entry';
import {TaskDialog} from './pageparts/dialogs';
import {LocalStorageKeys} from './models/models'

import {taskBoardReducer, TaskBoardState} from './redux-state/taskBoardState'
import {taskBoardActions} from './redux-actions/taskBoardActions'


// ビルド時に決まる定数定義
// ※ビルド時に使われるだけなのでクライアントに配布されるコードに定数値は展開されず
// 　ビルド時の判断結果だけが展開されることに注意。
// 　(ブラウザのデバッガから見れるTypescriptコードにはあたかも定数がソースにあるように見えるが、実際には定数値は見れない)
// 関連箇所：
//   - webpack.config.jsのwebpack.DefinePlugin
//   - package.jsonのNODE_ENV
declare var NODE_ENV: string;

const history = createHistory();

// バックエンド側のURL
// デバッグ時はFlaskデバッグ用ポート
// 本番はバックエンドとフロントは同じポート
const apiPort = (NODE_ENV == 'dev')? 5000 : window.location.port
const apiHost = `${location.protocol}//${window.location.hostname}:${apiPort}`
axios.defaults.baseURL = `${apiHost}/api`
axios.defaults.withCredentials = false  // 当面Cookieのやりとりは無し
axios.interceptors.request.use((value: AxiosRequestConfig)=>{
  // 非効率だがリクエストのときに認証キーを毎回ローカルストレージより転記
  const token = localStorage.getItem(LocalStorageKeys.authToken)
  value.headers.common['Authorization'] = `Bearer ${token}`
  return value
})
axios.interceptors.response.use((response: AxiosResponse<any>)=>{
  console.log(`index.tsx: ${JSON.stringify(response.data)}`)
  return response
})

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

const store = createStore(
  combineReducers({
    taskBoardReducer
  })
)


ReactDOM.render(
  <Provider store={store}>
    <Router history={history}>
      <div>
        <Header />
        <Route exact path="/" component={EntryPage} />
        <Route path="/login/:token" component={LoginPage} />
        <Route path="/task" component={TaskListPage} />
        <Route path="/messages/:id" component={Message} />
      </div>
    </Router>
  </Provider>,
  document.querySelector('.content')
);