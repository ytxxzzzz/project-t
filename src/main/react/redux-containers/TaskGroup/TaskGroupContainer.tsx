import {TaskGroup} from './TaskGroup'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import { Action } from 'typescript-fsa'
import {taskBoardActions} from '../../redux-actions/taskBoardActions'
import {TaskBoardState, TaskGroupState, TaskBoardStates} from '../../redux-state/taskBoardState'

export interface TaskBoardProps {
  loadAllTasks: (x: TaskBoardState) => Action<TaskBoardState>
  addTaskGroup: (x: TaskGroupState) => Action<TaskGroupState>
}

function mapDispatchToProps(dispatch: Dispatch<Action<TaskBoardStates>>): TaskBoardProps {
  return {
    loadAllTasks: (newState: TaskBoardState) => dispatch(taskBoardActions.loadAllTasks(newState)),
    addTaskGroup: (taskGroup: TaskGroupState) => dispatch(taskBoardActions.addTaskGroup(taskGroup)),
  };
}

function mapStateToProps(appState: TaskBoardState) {
  return Object.assign({}, appState);
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskGroup);
