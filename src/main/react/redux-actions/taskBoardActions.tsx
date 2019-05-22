
import actionCreatorFactory from 'typescript-fsa';
import {TaskBoardState} from '../redux-state/taskBoardState'

const actionCreator = actionCreatorFactory();

export const taskBoardActions = {
    loadAllTasks: actionCreator<TaskBoardState>('LOAD_ALL_TASKS'),
}
