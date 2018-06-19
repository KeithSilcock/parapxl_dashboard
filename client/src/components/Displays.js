import React from "react";
import db from "../firebase";
import NewDisplayModal from "./NewDisplayModal";

class Displays extends React.Component {
  //add new display option that opens a list of options and values to add
  // **** or allow them to create new

  constructor(props) {
    super(props);

    this.state = {
      display_list: {}
    };
  }

  createNewTemplate() {
    console.log("here");
  }

  addCurrentTemplateToBoard(templateType, templateContents) {
    const { currentData, selectNewTemplate } = this.props;

    const displayPath = `/displays/${templateType}`;
    const newTemplateRef = db.ref(displayPath).push({ ...templateContents });
    const post_id = newTemplateRef.key;

    //add data to coresponding board
    const boardPath = `/boards/${currentData.currentLocation}/${
      currentData.currentBoard
    }/`;

    const dataToSet = {
      display_id: post_id,
      type: templateType
    };
    db.ref(boardPath).push(dataToSet);
    selectNewTemplate(templateType);
  }

  formatDisplaysTemplates(data) {
    const renderObjects = Object.keys(data).map((displayType, index) => {
      const displayTemplate = data[displayType];

      const templateItems = Object.keys(displayTemplate).map((temp, index) => {
        return (
          <li key={index} className={"display-item"}>
            {temp}
          </li>
        );
      });

      return (
        <div
          className="display-template"
          onClick={this.addCurrentTemplateToBoard.bind(
            this,
            displayType,
            displayTemplate
          )}
          key={index}
        >
          <h4>{displayType}</h4>
          <ul>{templateItems}</ul>
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

  openCreateNewDisplayModal() {
    const { toggleModal } = this.props;

    const path = `display_list`;
    db.ref(path).on("value", snapshot => {
      const display_list = snapshot.val();
      this.setState({
        display_list
      });

      const display = this.formatDisplaysTemplates(display_list);

      toggleModal(display);
    });
  }

  render() {
    const { displays, getDisplayData, currentData } = this.props;
    const listOfDisplayTypes = Object.keys(displays).map((dbKey, index) => {
      const selectedClassName =
        currentData.displayType === displays[dbKey].type ? "selectedItem" : "";
      return (
        <li
          key={index}
          className={selectedClassName}
          onClick={getDisplayData.bind(
            null,
            displays[dbKey].type,
            displays[dbKey].display_id
          )}
        >
          {displays[dbKey].type}
        </li>
      );
    });

    const displayAddNew = currentData.currentBoard ? (
      <button onClick={this.openCreateNewDisplayModal.bind(this)}>
        New Display
      </button>
    ) : null;

    return (
      <div>
        <h3>Displays</h3>
        {displayAddNew}
        <ul>{listOfDisplayTypes}</ul>
      </div>
    );
  }
}

export default Displays;
