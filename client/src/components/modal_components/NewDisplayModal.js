import React from "react";
import "../../assets/modal.css";
import AllDisplays from "./AllDisplaysModal";

class NewDisplayModal extends React.Component {
  closeModal() {
    const { location, board } = this.props.match.params;
    this.props.history.push(`/admin/home/${location}/${board}`);
  }

  render() {
    function stopPropigation(e) {
      e.stopPropagation();
    }

    var data = null;
    switch (this.props.match.params.new_type) {
      case "display":
        data = (
          <AllDisplays
            {...this.props}
            closeModal={this.closeModal.bind(this)}
          />
        );
        break;

      default:
        data = null;
        break;
    }

    return (
      <div
        className={"display-modal modal-background"}
        onClick={this.closeModal.bind(this)}
      >
        <div
          className="display-modal modal-frame"
          onClick={e => stopPropigation(e)}
        >
          {data}
        </div>
      </div>
    );
  }
}

export default NewDisplayModal;
