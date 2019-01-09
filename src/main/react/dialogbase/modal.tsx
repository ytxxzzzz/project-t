import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from "lodash";

import {ModalStylePropsSchema, 
        ModalFuncPropsSchema} from '../models/models';


interface ModalDialogBaseProps<TargetScema> {
  modalFuncProps: ModalFuncPropsSchema<TargetScema>
  modalStyleProps: ModalStylePropsSchema
}
interface ModalDialogBaseState {
}
export default class ModalDialogBase<TargetScema> extends React.Component<ModalDialogBaseProps<TargetScema>, ModalDialogBaseState> {
  constructor(props: ModalDialogBaseProps<TargetScema>) {
    super(props)

    this.onSaveFunc = props.modalFuncProps.onSave
    if(!this.onSaveFunc) {
      this.onSaveFunc = ()=>{}
    }

    this.onCancelFunc = props.modalFuncProps.onCancel
    if(!this.onCancelFunc) {
      this.onCancelFunc = ()=>{}
    }

  }
  onSaveFunc: (newState: any)=>void
  onCancelFunc: ()=>void
  onSave() {
    this.onSaveFunc({})   // このクラスにはState情報を持っていないのでダミーオブジェクトを渡す
    this.props.modalFuncProps.onClose()
  }
  onCancel() {
    this.onCancelFunc()
    this.props.modalFuncProps.onClose()
  }
  render() {
    if(!this.props.modalFuncProps.show) {
      return null;
    }

    return (
      <div className="backdrop" style={this.props.modalStyleProps.backdropStyle} onClick={this.onCancel.bind(this)}>
        <div className="modal" 
              style={this.props.modalStyleProps.modalStyle} 
              onClick={(e)=>{e.stopPropagation()/*親要素へのクリックイベント伝播阻止*/}}
        >
          <i className="fas fa-times"></i>
          {this.props.children}

          <div className="footer">
            <button onClick={this.onSave.bind(this)}>
              Save
            </button>
            <button onClick={this.onCancel.bind(this)}>
              Cancel
            </button>
          </div>
        </div>
      </div>
    );
  }
}
