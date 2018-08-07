import React from "react";
import db from "../../firebase";
import BoardDisplay from "../board_components/BoardDisplay";

// import EditDisplayModal from "./EditDisplayModal";

import "../../assets/allDisplays.css";

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

  goBackToPrevPage() {
    const { location, board } = this.props.match.params;
    this.props.history.push(`/admin/${location}/${board}`);
  }

  createNewDisplay(e) {
    const { location, board } = this.props.match.params;
    this.props.history.push(`/admin/${location}/${board}/create-new/display`);
  }

  render() {
    const { displays, currentSelection } = this.state;
    const { location, board } = this.props.match.params;

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
              miniBoard={true}
              thisBoard={{ display_id: displayHash, type: newDisplay.type }}
            />
          </div>
        </div>
      );
    });

    // const setHeight =
    //   this.props.location.pathname ===
    //   `/admin/home/${location}/${board}/add-new/display`
    //     ? { top: "-100%", transition: "all 1s" }
    //     : { top: "100%", transition: "all 1s" };

    return (
      <div className="all-displays container">
        <div className="all-displays header">
          <button
            className="back-button"
            onClick={e => {
              this.props.history.push(`/admin/home/${location}/${board}`);
            }}
          >
            <i class="fas fa-chevron-left" />
          </button>
          <div className="all-displays header-text">
            <h2> All BrainyActz Displays</h2>
          </div>
          <button
            className="standard-button"
            onClick={e => this.createNewDisplay(e)}
          >
            Create New Display
          </button>
        </div>

        <div className="all-displays content">
          <div className=" all-displays left"> {renderObjects}</div>
          {/* <EditDisplayModal
            {...this.props}
            resetSelection={this.resetSelection.bind(this)}
            currentSelection={currentSelection}
            // updateCurrentDisplay={this.updateCurrentDisplay.bind(this)}
          /> */}
        </div>
      </div>
    );
  }
}

export default AllDisplays;
