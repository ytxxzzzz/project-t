import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from "lodash";

interface ModalDialogBaseProps {
  modalProps: ModalPropsSchema
  modalStyleProps: ModalStylePropsSchema
}
interface ModalDialogBaseState {
}
export default class ModalDialogBase extends React.Component<ModalDialogBaseProps, ModalDialogBaseState> {
  constructor(props: ModalDialogBaseProps) {
    super(props)

    this.onSaveFunc = props.modalProps.onSave
    if(!this.onSaveFunc) {
      this.onSaveFunc = ()=>{}
    }

    this.onCancelFunc = props.modalProps.onCancel
    if(!this.onCancelFunc) {
      this.onCancelFunc = ()=>{}
    }

  }
  onSaveFunc: ()=>void
  onCancelFunc: ()=>void
  onSave() {
    this.onSaveFunc()
    this.props.modalProps.onClose()
  }
  onCancel() {
    this.onCancelFunc()
    this.props.modalProps.onClose()
  }
  render() {
    if(!this.props.modalProps.show) {
      return null;
    }

    return (
      <div className="backdrop" style={this.props.modalStyleProps.backdropStyle}>
        <div className="modal" style={this.props.modalStyleProps.modalStyle}>
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
