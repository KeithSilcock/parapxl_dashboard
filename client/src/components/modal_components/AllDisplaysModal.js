import React from "react";
import db from "../../firebase";
import BoardDisplay from "../board_components/BoardDisplay";

import EditDisplayModal from "./EditDisplayModal";

import "../../assets/allDisplayModal.css";

class AllDisplays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displays: {},
      currentSelection: {}
    };
  }
  componentDidMount() {
    const path = `/displays`;
    db.ref(path).on("value", snapshot => {
      const displays = snapshot.val();
      this.setState({
        displays
      });
    });
  }

  resetSelection() {
    this.setState({
      ...this.state,
      currentSelection: {}
    });
  }

  selectItem(displayData, display_id) {
    this.setState({
      ...this.state,
      currentSelection: { displayData, display_id }
    });
  }

  createNewDisplay(e) {
    const { location, board } = this.props.match.params;
    this.props.history.push(`/admin/${location}/${board}/create-new/display`);
  }

  render() {
    const { displays, currentSelection } = this.state;
    const { closeModal } = this.props;

    const renderObjects = Object.keys(displays).map((displayHash, index) => {
      const newDisplay = displays[displayHash];
      const selectedTemplateClass =
        currentSelection.display_id === displayHash
          ? "selected-new-display"
          : "";

      return (
        <div
          className={`new-display ${newDisplay.type} ${selectedTemplateClass}`}
          onClick={e => {
            this.selectItem(newDisplay, displayHash);
            // this.addCurrentTemplateToBoard(displayType, displayTemplate);
          }}
          key={index}
        >
          <h4>
            {newDisplay.name} ({newDisplay.type})
          </h4>
          <div className="display-type-preview">
            <BoardDisplay
              thisBoard={{ display_id: displayHash, type: newDisplay.type }}
            />
          </div>
        </div>
      );
    });

    return (
      <div className="modal-container">
        <div className="modal-header">
          <div className="empty" />
          <div className="modal-header-text">
            <h2>BrainyActz Displays</h2>
          </div>
          <div className="modal-button ">
            <button className="delete-button" onClick={e => closeModal(e)}>
              Close
            </button>
            <button
              className="standard-button"
              onClick={e => this.createNewDisplay(e)}
            >
              Create New Display
            </button>
          </div>
        </div>

        <div className="modal-content">
          <div className="modal-left"> {renderObjects}</div>
          <EditDisplayModal
            {...this.props}
            resetSelection={this.resetSelection.bind(this)}
            currentSelection={currentSelection}
            // updateCurrentDisplay={this.updateCurrentDisplay.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default AllDisplays;
