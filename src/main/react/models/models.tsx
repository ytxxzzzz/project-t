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
  taskId?: number
  taskTitle: string
  taskDetail: string
}

interface ModalPropsSchema {
  show: boolean
  onSave?: Function
  onCancel?: Function
  onClose: Function
}

interface ModalStylePropsSchema {
  modalStyle: any
  backdropStyle: any
}
