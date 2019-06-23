import {TaskBoardState} from './redux-state/taskBoardState'
import {taskBoardReducer} from './redux-reducer/taskBoardReducer'
import {taskBoardActions} from './redux-actions/taskBoardActions'
import {createStore, combineReducers, Action} from 'redux'

export default createStore(
  combineReducers({
    taskBoardReducer
  })
)
