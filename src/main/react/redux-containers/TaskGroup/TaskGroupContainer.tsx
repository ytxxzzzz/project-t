import {TaskGroup} from './TaskGroup'
import {connect} from 'react-redux'
import {Dispatch} from 'redux'
import { Action } from 'typescript-fsa'
import {taskBoardActions} from '../../redux-actions/taskBoardActions'
import {TaskBoardState, TaskGroupState, TaskState, TaskBoardStates} from '../../redux-state/taskBoardState'

export interface TaskGroupContainerProps {
  addTask: (x: TaskState) => Action<TaskState>
  updateTaskGroup: (x: TaskGroupState) => Action<TaskGroupState>
}

function mapDispatchToProps(dispatch: Dispatch<Action<TaskBoardStates>>): TaskGroupContainerProps {
  return {
    addTask: (task: TaskState) => dispatch(taskBoardActions.addTask(task)),
    updateTaskGroup: (taskGroup: TaskGroupState) => dispatch(taskBoardActions.updateTaskGroup(taskGroup))
  };
}

function mapStateToProps(appState: TaskBoardState) {
  return Object.assign({}, appState);
}

export default connect(mapStateToProps, mapDispatchToProps)(TaskGroup);
