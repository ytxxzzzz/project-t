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
  