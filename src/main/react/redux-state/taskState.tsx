
import { reducerWithInitialState } from 'typescript-fsa-reducers';
import {taskActions} from '../redux-actions/taskActions'

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

export const AllTasks = reducerWithInitialState({});
