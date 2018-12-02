import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from "lodash";

import * as Element from '../elements/element'
import ModalDialogBase from '../dialogbase/modal'

interface TaskDialogProps {
  task: TaskSchema
  modalProps: ModalPropsSchema
}
interface TaskDialogState {
  task: TaskSchema
}
export class TaskDialog extends React.Component<TaskDialogProps, TaskDialogState> {
  constructor(props: TaskDialogProps) {
    super(props)
    this.state = {
      task: {
        taskTitle: props.task.taskTitle,
        taskDetail: props.task.taskDetail,
      }
    }
  }
  render() {
    // The gray background
    const backdropStyle = {
      position: 'fixed' as 'fixed',
      top: 0,
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: 'rgba(0,0,0,0.3)',
      padding: 50
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30
    };
    return (
      <ModalDialogBase modalProps={this.props.modalProps} modalStyleProps={{backdropStyle: backdropStyle, modalStyle: modalStyle}} >
        <ul>
          <li>
            <label htmlFor="title">タイトル</label>
            <Element.Input name="taskTitle" value={this.state.task.taskTitle}></Element.Input>
          </li>
          <li>
            <label htmlFor="detail">詳細</label>
            <Element.Input name="taskDetail" value={this.state.task.taskDetail} ></Element.Input>
          </li>
        </ul>
      </ModalDialogBase>
    )
  }
}