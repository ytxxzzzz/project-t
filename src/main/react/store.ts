import {taskBoardReducer, TaskBoardState} from './redux-state/taskBoardState'
import {taskBoardActions} from './redux-actions/taskBoardActions'
import {createStore, combineReducers, Action} from 'redux'

export default createStore(
  combineReducers({
    taskBoardReducer
  })
)
