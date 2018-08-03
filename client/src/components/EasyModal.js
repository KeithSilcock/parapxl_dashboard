import React from "react";
import { connect } from "react-redux";
import { toggleModal } from "../actions";

import "../assets/warningModal.css";

class EasyModal extends React.Component {
  render() {
    const { header, content, confirm, cancel } = this.props.modalData;
    const cont = content ? (
      content
    ) : (
      <span>{`Are you sure you want to delete ${header}?`}</span>
    );

    if (this.props.modalDisplayed) {
      return (
        <div
          onClick={e => e.stopPropagation()}
          className="warning-modal cant-click-through"
        >
          <div className="warning-modal container">
            <div className="warning-modal header">
              <div className="spacer" />
              <h3>{`${header}`}</h3>
              <span className="close" onClick={e => cancel(e)}>
                &times;
              </span>
            </div>
            <div className="warning-modal content">{cont}</div>
            <div className="warning-modal footer">
              <button onClick={e => confirm(e)} className="standard-button">
                Confirm
              </button>
              <button onClick={e => cancel(e)} className="delete-button">
                Cancel
              </button>
            </div>
          </div>
        </div>
      );
    } else {
      return null;
    }
  }
}
function mapStateToProps(state) {
  return {
    modalDisplayed: state.data.modalDisplayed,
    modalData: state.data.modalData
  };
}

export default connect(
  mapStateToProps,
  { toggleModal }
)(EasyModal);
