
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {taskBoardActions} from '../redux-actions/taskBoardActions'
import {initialState} from '../redux-state/taskBoardState';

export const taskBoardReducer = reducerWithInitialState(initialState)
  .case(taskBoardActions.loadAllTasks, (state, payload) => {
    return Object.assign({}, state, payload);
  })
  .case(taskBoardActions.addTaskGroup, (state, payload) => {
    return Object.assign({}, state, payload);
  })
