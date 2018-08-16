import React from "react";
import { connect } from "react-redux";
import { toggleModal, clearModalInput } from "../../actions";
import EasyForm from "../EasyForm";

import "../../assets/addNewBoard.css";

class AddNewBoard extends React.Component {
  render() {
    const { addNewItem, tab2Open, toggleModal } = this.props;

    const buttonText = tab2Open ? (
      <p className="add-new-board-text">Add New Board</p>
    ) : null;

    const modalData = {
      header: "Create a new board display?",
      content: (
        <EasyForm
          onSub={addNewItem}
          placeholder="New Board Name"
          autoFocus={true}
        />
      ),
      confirm: () => {
        addNewItem();
        toggleModal();
      },
      cancel: e => {
        toggleModal();
        clearModalInput();
      }
    };

    return (
      <div
        onClick={e => toggleModal(modalData)}
        className="add-new-board-container"
      >
        {buttonText}
        <button className="add-new-board-button">+</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tab2Open: state.navData.tab2Open
  };
}

export default connect(
  mapStateToProps,
  { toggleModal, clearModalInput }
)(AddNewBoard);
