import React from "react";
import db from "../firebase";
import BoardDisplay from "./BoardDisplay";

class AllDisplays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displays: {}
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

  render() {
    const { toggleModal } = this.props;
    const { displays } = this.state;

    const renderObjects = Object.keys(displays).map((displayHash, index) => {
      const newDisplay = displays[displayHash];
      //   const selectedTemplateClass = index === 0 ? "selected-template" : "";

      return (
        <div
          className={`new-display ${newDisplay.type}`}
          onClick={e => {
            // this.addCurrentTemplateToBoard(displayType, displayTemplate);
            toggleModal();
          }}
          key={index}
        >
          <h4>{newDisplay.displayType}</h4>
          <BoardDisplay thisBoard={{ display_id: displayHash }} />
        </div>
      );
    });

    return (
      <div className="modal-container">
        <div className="modal-header">
          <div className="empty" />
          <div className="modal-header-text">
            <h2>Display Templates</h2>
          </div>
          <div className="modal-button">
            <button>+</button>
          </div>
        </div>
        <div className="modal-content">{renderObjects}</div>
      </div>
    );
  }
}

export default AllDisplays;
