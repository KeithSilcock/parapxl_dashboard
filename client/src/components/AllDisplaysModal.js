import React from "react";
import db from "../firebase";
import BoardDisplay from "./BoardDisplay";
import EditDisplayModal from "./EditDisplayModal";

import "../assets/allDisplayModal.css";

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
    db.ref(path).once("value", snapshot => {
      const displays = snapshot.val();
      this.setState({
        displays
      });
    });
  }
  selectItem(displayData, display_id) {
    this.setState({
      ...this.state,
      currentSelection: { displayData, display_id }
    });
  }

  addDisplayToBoard() {}

  render() {
    const { toggleModal } = this.props;
    const { displays, currentSelection } = this.state;

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
            // toggleModal();
          }}
          key={index}
        >
          <h4>{newDisplay.type}</h4>
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
            <h2>All Displays</h2>
          </div>
          <div className="modal-button">
            <button>+</button>
          </div>
        </div>
        <div className="modal-content">
          <div className="modal-left"> {renderObjects}</div>
          <EditDisplayModal
            currentSelection={currentSelection}
            // updateCurrentDisplay={this.updateCurrentDisplay.bind(this)}
          />
        </div>
      </div>
    );
  }
}

export default AllDisplays;
