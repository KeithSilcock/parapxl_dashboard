import React from "react";
import "../assets/modal.css";

class NewDisplayModal extends React.Component {
  render() {
    function stopPropigation(e) {
      e.stopPropagation();
    }

    const { toggleModal, modalData } = this.props;
    return (
      <div className={"display-modal modal-background"} onClick={toggleModal}>
        <div
          className="display-modal modal-frame"
          onClick={e => stopPropigation(e)}
        >
          {modalData}
        </div>
      </div>
    );
  }
}

export default NewDisplayModal;
