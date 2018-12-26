import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from "lodash";

import {TaskSchema,
        ModalFuncPropsSchema} from '../models/models';
import * as Element from '../elements/element'
import ModalDialogBase from '../dialogbase/modal'

interface TaskDialogProps {
  task: TaskSchema
  modalFuncProps: ModalFuncPropsSchema<TaskSchema>
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
  handleModalInput(e: any) {
    const newState: TaskDialogState = _.cloneDeep(this.state)
    newState.task[e.target.name] = e.target.value
    this.setState(newState)
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
      padding: 50,
      cursor: 'auto',
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#fff',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 30,
      cursor: 'auto',
    };
    const modalFuncProps = _.cloneDeep(this.props.modalFuncProps)
    modalFuncProps.onSave = () => {
      if(this.props.modalFuncProps.onSave) {
        this.props.modalFuncProps.onSave(this.state.task)
      }
    }
    return (
      <ModalDialogBase modalFuncProps={modalFuncProps} modalStyleProps={{backdropStyle: backdropStyle, modalStyle: modalStyle}} >
        <ul>
          <li>
            <label htmlFor="title">タイトル</label>
            <Element.Input 
              name="taskTitle" 
              defaultValue={this.props.task.taskTitle}
              handleChange={this.handleModalInput.bind(this)}
            />
          </li>
          <li>
            <label htmlFor="detail">詳細</label>
            <Element.Input
              name="taskDetail" 
              defaultValue={this.props.task.taskDetail}
              handleChange={this.handleModalInput.bind(this)}
              />
          </li>
        </ul>
      </ModalDialogBase>
    )
  }
}
