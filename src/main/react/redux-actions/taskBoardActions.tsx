
import actionCreatorFactory from 'typescript-fsa';
import {TaskBoardState, TaskGroupState} from '../redux-state/taskBoardState'

const actionCreator = actionCreatorFactory();

export const taskBoardActions = {
    loadAllTasks: actionCreator<TaskBoardState>('taskboard/loadAllTasks'),
    addTaskGroup: actionCreator<TaskGroupState>('taskboard/addTaskGroup')
}
