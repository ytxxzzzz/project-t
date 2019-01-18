export interface TaskGroupSchema {
  taskGroupId?: number
  taskGroupTitle: string
  isArchived: boolean
  tasks: TaskSchema[]
  taskStatuses?: TaskStatusSchema[]
}

export interface TaskSchema {
  [key: string]: any  // シグネチャを追加して、フィールドの動的アクセスを許可
  taskId?: number
  taskTitle: string
  taskDetail: string
  taskGroupId: number
  taskStatusId: number
  taskStatus: TaskStatusSchema
}

export interface TaskStatusSchema {
  taskStatusId: number
  taskStatusName: string
  isDone: boolean
  taskGroupId: number
}

export interface ModalFuncPropsSchema<TargetScema> {
  show: boolean
  onSave?: (newValues: TargetScema)=>void
  onCancel?: ()=>void
  onClose: ()=>void
}

export interface ModalStylePropsSchema {
  modalStyle: any
  backdropStyle: any
}

export const LocalStorageKeys =  {
  authToken: "authToken",
}
