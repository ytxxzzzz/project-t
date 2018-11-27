import * as React from 'react';
import * as ReactDOM from 'react-dom';
import * as _ from "lodash";

interface ModalProps {
  onClose: Function,
  show: boolean,
}
interface ModalState {
}
export default class Modal extends React.Component<ModalProps, ModalState> {
  render() {
    if(!this.props.show) {
      return null;
    }

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
      <div className="backdrop" style={backdropStyle}>
        <div className="modal" style={modalStyle}>
          {this.props.children}

          <div className="footer">
            <button onClick={this.props.onClose.bind(this)}>
              Close
            </button>
          </div>
        </div>
      </div>
    );
  }
}
