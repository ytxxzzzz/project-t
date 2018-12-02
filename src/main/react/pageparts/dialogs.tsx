import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from "lodash";

import * as Element from '../elements/element'
import ModalDialogBase from '../dialogbase/modal'

interface TaskDialogItems {
  taskTitle: string
  taskDetail: string
}
interface TaskDialogProps extends TaskDialogItems {
  show: boolean
  onSave?: Function
  onCancel?: Function
}
interface TaskDialogState extends TaskDialogItems {
  isOpen: boolean
}
export class TaskDialog extends React.Component<TaskDialogProps, TaskDialogState> {
  constructor(props: TaskDialogProps) {
    super(props)
    this.state = {
      isOpen: props.show,
      taskTitle: props.taskTitle,
      taskDetail: props.taskDetail,
    }
  }
  toggleModal = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }
  render() {
    return (
      <ModalDialogBase onClose={()=>{}} show={true} >
        <ul>
          <li>
            <label htmlFor="title">タイトル</label>
            <Element.Input name="taskTitle" value={this.state.taskTitle} handleChange={this..bind(this)}></Input>
          </li>
          <li>
            <label htmlFor="detail">詳細</label>
            <Element.Input name="taskDetail" value={this.state.taskDetail} handleChange={this.handleModalInput.bind(this)}></Input>
          </li>
        </ul>
      </ModalDialogBase>
    )
  }
}
