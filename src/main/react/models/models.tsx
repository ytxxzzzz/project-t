interface TaskGroupSchema {
  taskGroupId?: number
  taskGroupTitle: string
  tasks: TaskSchema[]
}
interface TaskSchema {
  taskId?: number
  taskTitle: string
  taskDetail: string
}

interface TaskSchema {
  [key: string]: any  // シグネチャを追加して、フィールドの動的アクセスを許可
  taskId?: number
  taskTitle: string
  taskDetail: string
}

interface ModalFuncPropsSchema<TargetScema> {
  show: boolean
  onSave?: (newValues: TargetScema)=>void
  onCancel?: ()=>void
  onClose: ()=>void
}

interface ModalStylePropsSchema {
  modalStyle: any
  backdropStyle: any
}
