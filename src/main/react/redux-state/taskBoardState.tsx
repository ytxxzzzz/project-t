
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {taskBoardActions} from '../redux-actions/taskBoardActions'

export interface TaskBoardState {
  taskGroups: TaskGroupState[]
  tasks: TaskState[]
  taskStatuses: TaskStatusState[]
}

export interface TaskGroupState {
  taskGroupId?: number
  taskGroupTitle: string
  isArchived: boolean
  taskIds: number[]
  taskStatusIds?: number[]
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
  tasks: [],
  taskStatuses: [],
}

export const taskBoardReducer = reducerWithInitialState(initialState)
  .case(taskBoardActions.loadAllTasks, (state, payload) => {
    return Object.assign({}, state, payload);
  })
