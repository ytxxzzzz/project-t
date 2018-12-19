import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import { Router, Route, RouteComponentProps, Redirect } from "react-router";
import { Link } from 'react-router-dom';
import axios from 'axios';

import * as _ from "lodash";

import * as Element from '../elements/element'

interface LoginParam {
  token: string,
}
interface LoginPageState {
  isLogin: boolean
}
export class LoginPage extends React.Component<RouteComponentProps<LoginParam>, LoginPageState> {
  constructor(props: RouteComponentProps<LoginParam>) {
    super(props)
    this.state = {
      isLogin: false,
    }
  }
  async onLogin() {
    const result = await axios.get(`/login/${this.props.match.params.token}`)
    alert(result.data.token)
  }
  async render() {
    await this.onLogin()
    if(this.state.isLogin) {
      return (
        <Redirect to={'/task'} />
      )
    } else {
      return (
        <Redirect to={'/entry'} />
      )
    }
  }
}
