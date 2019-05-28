
import actionCreatorFactory from 'typescript-fsa';
import {TaskBoardState} from '../redux-state/taskBoardState'

const actionCreator = actionCreatorFactory();

export const taskBoardActions = {
    loadAllTasks: actionCreator<TaskBoardState>('taskboard/load_all_tasks'),
}
