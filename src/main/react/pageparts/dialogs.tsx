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
  componentWillReceiveProps(nextProps: Readonly<TaskDialogProps>) {
    // ダイアログが再表示された時に、新しいpropsで
    this.setState({
      task: {
        taskTitle: nextProps.task.taskTitle,
        taskDetail: nextProps.task.taskDetail,
      }
    })
  }
  handleModalInput(e: React.FormEvent<HTMLTextAreaElement>) {
    const newState: TaskDialogState = _.cloneDeep(this.state)
    newState.task[e.currentTarget.name] = e.currentTarget.value
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
      overflow: 'auto',
      cursor: 'auto',
    };

    // The modal "window"
    const modalStyle = {
      backgroundColor: '#eee',
      borderRadius: 5,
      maxWidth: 500,
      minHeight: 300,
      margin: '0 auto',
      padding: 20,
      cursor: 'auto',
    };
    // ModalDialogBaseに渡す関数オブジェクトは、onSaveだけ差し替える
    const modalFuncProps = _.cloneDeep(this.props.modalFuncProps)
    modalFuncProps.onSave = () => {
      if(this.props.modalFuncProps.onSave) {
        this.props.modalFuncProps.onSave(this.state.task)
      }
    }
    return (
      <ModalDialogBase modalFuncProps={modalFuncProps} modalStyleProps={{backdropStyle: backdropStyle, modalStyle: modalStyle}} >
        <div className="task-dialog">
              <Element.MultiLineInput 
                name="taskTitle" 
                defaultValue={this.props.task.taskTitle}
                handleChange={this.handleModalInput.bind(this)}
              />
              <div>詳細</div>
              <Element.MultiLineInput
                name="taskDetail" 
                defaultValue={this.props.task.taskDetail}
                handleChange={this.handleModalInput.bind(this)}
                />
        </div>
      </ModalDialogBase>
    )
  }
}
