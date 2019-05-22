
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {taskBoardActions} from '../redux-actions/taskBoardActions'

export interface TaskBoardState {
  taskGroups: TaskGroupState[]
}

export interface TaskGroupState {
  taskGroupId?: number
  taskGroupTitle: string
  isArchived: boolean
  tasks: TaskState[]
  taskStatuses?: TaskStatusState[]
}
  
export interface TaskState {
  [key: string]: any  // シグネチャを追加して、フィールドの動的アクセスを許可
  taskId?: number
  taskTitle: string
  taskDetail: string
  taskGroupId: number
  taskStatusId?: number
  taskStatus?: TaskStatusState
  isArchived?: boolean
}
  
export interface TaskStatusState {
  taskStatusId: number
  taskStatusName: string
  isDone: boolean
  taskGroupId: number
}

const initialState: TaskBoardState = {
  taskGroups: [],
}

export const taskReducer = reducerWithInitialState(initialState)
  .case(taskBoardActions.loadAllTasks, (state, newState) => {
    return Object.assign({}, state, newState);
  })
