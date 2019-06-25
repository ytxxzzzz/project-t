import * as React from 'react';
import * as ReactDOM from 'react-dom';
import { DragSource } from "react-dnd";
import { Router, Route, RouteComponentProps, Redirect } from "react-router";
import { Link } from 'react-router-dom';
import createHistory from 'history/createBrowserHistory';
import axios from 'axios';

import * as _ from "lodash";

import * as Element from '../../elements/element';
import {TaskDialog} from '../../pageparts/dialogs';
import {TaskListPageContainerProps} from '../../redux-containers/TaskListPage/TaskListPageContainer';
import {TaskBoardState, TaskGroupState, TaskState, TaskStatusState} from '../../redux-state/taskBoardState'
import TaskGroupContainer from '../TaskGroup/TaskGroupContainer'

type TaskListPageProps = TaskListPageContainerProps & TaskBoardState
interface TaskListPageUIState {
  hasError: boolean
}
export class TaskListPage extends React.Component<TaskListPageProps, TaskListPageUIState> {
  constructor(props: TaskListPageProps) {
    super(props)
    this.state = {
      hasError: false,
    }
  }
  componentDidMount() {
    this.onInit()
  }
  async onInit() {
    try{
      const result = await axios.get(`/taskGroup/findAll`, {
        params: {
          isArchived: false
        }
      })
      this.props.loadAllTasks({taskGroups: result.data, tasks: null, taskStatuses: null})
    } catch(e) {
      console.log(`onInitでキャッチ: ${JSON.stringify(e, null, 1)}`)
      alert(e.response.data.message?e.response.data.message: JSON.stringify(e))
      this.setState({hasError: true})
    }
  }
  async handleAddTaskGroupClick() {
    const newTaskGroup: TaskGroupState = {
      taskGroupId: null,
      taskGroupTitle: "新しいリスト",
      isArchived: false,
      taskIds: [],
    }

    const addedResponse = await axios.post(`/taskGroup`, newTaskGroup)
    this.props.addTaskGroup(addedResponse.data)
  }
  render() {
    if(this.state.hasError) return <Redirect to="/" />
    return (
      <div className="task-list-base">
        {
          this.props.taskGroups.map(taskGroup => {
            return (
              <TaskGroupContainer></TaskGroupContainer>
            )
          })
        }
        <Element.Button caption="タスクリスト追加" handleClick={this.handleAddTaskGroupClick.bind(this)}></Element.Button>
      </div>
    )
  }
}
