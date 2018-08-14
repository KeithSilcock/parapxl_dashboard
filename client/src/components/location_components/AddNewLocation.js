import React from "react";
import { connect } from "react-redux";
import { toggleModal } from "../../actions";
import "../../assets/addNewLocation.css";
import WarningModal from "../EasyModal";
import EasyForm from "../EasyForm";

class AddNewDBItem extends React.Component {
  render() {
    const { addNewItem, tab1Open, toggleModal } = this.props;

    const buttonText = tab1Open ? (
      <p className="add-new-item-text">Add New Location</p>
    ) : null;

    const modalData = {
      header: "Create a new location?",
      content: (
        <EasyForm
          onSub={addNewItem}
          placeholder="New Location Name"
          autoFocus={true}
        />
      ),
      confirm: addNewItem,
      cancel: toggleModal
    };

    return (
      <div
        onClick={e => toggleModal(modalData)}
        className="add-new-item-container"
      >
        {buttonText}
        <button className="add-new-item-button">+</button>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tab1Open: state.navData.tab1Open
  };
}

export default connect(
  mapStateToProps,
  { toggleModal }
)(AddNewDBItem);
