
import actionCreatorFactory from 'typescript-fsa';
import {TaskBoardState, TaskGroupState, TaskState} from '../redux-state/taskBoardState'

const actionCreator = actionCreatorFactory();

export const taskBoardActions = {
    loadAllTasks: actionCreator<TaskBoardState>('taskboard/loadAllTasks'),
    addTaskGroup: actionCreator<TaskGroupState>('taskboard/addTaskGroup'),
    addTask: actionCreator<TaskState>('taskboard/addTask'),
    updateTaskGroup: actionCreator<TaskGroupState>('taskboard/updateTaskGroup')
}
