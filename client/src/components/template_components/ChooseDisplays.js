import React from "react";
import db from "../../firebase";
import BoardDisplay from "../board_components/BoardDisplay";

import "../../assets/chooseDisplays.css";

class ChooseDisplays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displays: {},
      currentSelection: []
    };
  }
  componentDidMount() {
    const path = `/displays`;
    db.ref(path).once("value", snapshot => {
      const displays = snapshot.val();

      if (this.props.prevDisplays) {
        this.setState({
          displays,
          currentSelection: this.props.prevDisplays
        });
      } else {
        this.setState({
          displays
        });
      }
    });
  }

  selectItems(displayData, display_id) {
    const { currentSelection } = this.state;
    //remove from list if there already
    const index = currentSelection.indexOf(display_id);
    if (index >= 0) {
      const tempSelection = [...currentSelection];
      tempSelection.splice(index, 1);
      this.setState({
        ...this.state,
        currentSelection: [...tempSelection]
      });
    } else {
      this.setState({
        ...this.state,
        currentSelection: [...currentSelection, display_id]
      });
    }
  }

  addSelectedItems(e) {
    const { displays, currentSelection } = this.state;
    const { submit } = this.props;

    const listOfDisplays = [];
    for (
      let selectionIndex = 0;
      selectionIndex < currentSelection.length;
      selectionIndex++
    ) {
      const selection = currentSelection[selectionIndex];

      for (let displayKey in displays) {
        const thisDisplay = displays[displayKey];

        if (selection === displayKey) {
          listOfDisplays.push(thisDisplay);
          break;
        }
      }
    }

    submit(listOfDisplays, currentSelection);
  }

  render() {
    const { toggleEscapeRoomsList } = this.props;
    const { displays, currentSelection } = this.state;

    const renderDisplays = Object.keys(displays).map((displayHash, index) => {
      const newDisplay = displays[displayHash];

      if (newDisplay.type === "escape-room") {
        const selectedTemplateClass =
          currentSelection.indexOf(displayHash) >= 0 ? "selected-display" : "";

        return (
          <div
            className={`choose-display item ${selectedTemplateClass}`}
            onClick={e => {
              this.selectItems(newDisplay, displayHash);
              // this.addCurrentTemplateToBoard(displayType, displayTemplate);
            }}
            key={index}
          >
            <div className="display-type-preview">
              <BoardDisplay
                thisBoard={{ display_id: displayHash, type: newDisplay.type }}
              />
            </div>
          </div>
        );
      } else {
        return null;
      }
    });

    const buttonStyleClass = currentSelection.length
      ? "standard-button"
      : "unavailable-button";

    return (
      <div className="choose-display container">
        <div className="choose-display display">
          <div className="choose-display display-top">
            <h3>Available Displays</h3>
          </div>
          <div className="choose-display display-bottom">{renderDisplays}</div>
        </div>
        <div className="choose-display button-box">
          <button
            onClick={e => this.addSelectedItems(e)}
            className={`choose-display ${buttonStyleClass}`}
          >
            Add Selected
          </button>
          <button
            onClick={toggleEscapeRoomsList}
            className="choose-display delete-button"
          >
            Close
          </button>
        </div>
      </div>
    );
  }
}

export default ChooseDisplays;
