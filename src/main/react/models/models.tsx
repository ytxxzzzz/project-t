export interface TaskGroupSchema {
  taskGroupId?: number
  taskGroupTitle: string
  tasks: TaskSchema[]
}
export interface TaskSchema {
  taskId?: number
  taskTitle: string
  taskDetail: string
}

export interface TaskSchema {
  [key: string]: any  // シグネチャを追加して、フィールドの動的アクセスを許可
  taskId?: number
  taskTitle: string
  taskDetail: string
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
