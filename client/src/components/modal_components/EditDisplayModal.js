import React from "react";
import db from "../../firebase";
import { capitalizeFirstLetters } from "../../helpers";

class EditDisplayModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentData: {},
      currentDisplay_id: "",
      excludedDisplays: []
    };
    this.onDisplayDataChange = this.onDisplayDataChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { currentSelection } = nextProps;

    this.setState({
      ...this.state,
      currentData: currentSelection.displayData,
      currentDisplay_id: currentSelection.display_id
    });
  }

  onDisplayDataChange(event) {
    const { currentData } = this.state;
    const { name, value } = event.currentTarget;

    const newData = { ...currentData, [name]: value };

    this.setState({
      ...this.state,
      currentData: newData
    });
  }

  addDisplayToAvailable(e) {
    const { currentData, currentDisplay_id } = this.state;
    const { location, board } = this.props.match.params;
    const dataToSend = {
      display_id: currentDisplay_id,
      name: currentData.name,
      type: currentData.type
    };

    //update available boards and current board
    const available_path = `/boards/${location}/${board}/available_displays`;
    db.ref(available_path).push(dataToSend, snapshot1 => {});
    const currentDisplay_path = `/boards/${location}/${board}/current_display`;
    db.ref(currentDisplay_path).set(dataToSend, snapshot2 => {});
  }

  toggleEscapeRoom(e, display, arrayIndex) {
    const { excludedDisplays } = this.state;
    const { checked } = e.target;

    //add or remove index from display data
    if (checked) {
      const displayIndex = excludedDisplays.indexOf(arrayIndex);
      const copy = [...excludedDisplays];
      const removedDisplay = copy.splice(displayIndex, 1);

      this.setState({
        ...this.state,
        excludedDisplays: [...copy]
      });
    } else {
      this.setState({
        ...this.state,
        excludedDisplays: [...excludedDisplays, arrayIndex]
      });
    }
  }
  updateEscapeRoomListDisplay(e) {
    const { currentData, excludedDisplays, currentDisplay_id } = this.state;

    if (currentData.type === "carousel") {
      var list_of_displays = currentData.carousel_displays;
      var name = "carousel_displays";
    } else if (currentData.type === "escape-room-list") {
      var list_of_displays = currentData.list_of_displays;
      var name = "list_of_displays";
    }

    //remove targeted displays
    const newListOfDisplays = [...list_of_displays];
    let count = 0;
    for (let exIndex = 0; exIndex < excludedDisplays.length; exIndex++) {
      const indexToRemove = excludedDisplays[exIndex];
      newListOfDisplays.splice(indexToRemove - count++, 1);
    }

    const newData = {
      ...this.state.currentData,
      [name]: newListOfDisplays
    };
    const path = `/displays/${currentDisplay_id}/`;
    db.ref(path).set(newData);
  }

  updateDisplays(e) {
    e.preventDefault();
    const { currentData, currentDisplay_id } = this.state;

    const path = `/displays/${currentDisplay_id}/`;
    db.ref(path).set({ ...currentData });
  }

  render() {
    const { currentData } = this.state;
    const { closeModal } = this.props;
    const { board } = this.props.match.params;
    // const { currentSelection } = this.props;

    if (currentData) {
      var displayItems = Object.keys(currentData).map((dataKey, index) => {
        const value = currentData[dataKey];
        var inputCont = null;
        switch (dataKey) {
          case "type":
            break;
          case "display_id":
            break;
          case "carousel_displays":
            //display all escape rooms as checkboxes
            const carouselDisplays = value.map((display, index2) => {
              return (
                <li key={index2} className="escape-room-list-edit item">
                  <input
                    onClick={e => {
                      this.toggleEscapeRoom(e, display, index2);
                    }}
                    type="checkbox"
                    id={`checkbox${index}`}
                    defaultChecked
                  />
                  <label for={`checkbox${index}`}>{display.title}</label>
                </li>
              );
            });

            inputCont = (
              <li key={index} className="edit-data item escape-room-list-edit">
                <p>Displayed Escape Rooms:</p>
                <ul className="escape-room-list-edit list">
                  {carouselDisplays}
                </ul>
                <button
                  type="button"
                  onClick={e => this.updateEscapeRoomListDisplay(e)}
                  className="escape-room-list-edit standard-button"
                >
                  Update Display
                </button>
              </li>
            );
            break;
          case "list_of_displays":
            //display all escape rooms as checkboxes
            const displays = value.map((display, index2) => {
              return (
                <li key={index2} className="escape-room-list-edit item">
                  <input
                    onClick={e => {
                      this.toggleEscapeRoom(e, display, index2);
                    }}
                    type="checkbox"
                    id={`checkbox${index}`}
                    defaultChecked
                  />
                  <label for={`checkbox${index}`}>{display.title}</label>
                </li>
              );
            });

            inputCont = (
              <li key={index} className="edit-data item escape-room-list-edit">
                <p>Displayed Escape Rooms:</p>
                <ul className="escape-room-list-edit list">{displays}</ul>
                <button
                  type="button"
                  onClick={e => this.updateEscapeRoomListDisplay(e)}
                  className="escape-room-list-edit standard-button"
                >
                  Update Display
                </button>
              </li>
            );
            break;
          case "content":
            inputCont = (
              <li key={index} className="edit-data item">
                <p>{dataKey}:</p>
                <textarea
                  rows="7"
                  onChange={this.onDisplayDataChange}
                  type="text"
                  name={dataKey}
                  value={value}
                />
              </li>
            );
            break;
          default:
            inputCont = (
              <li key={index} className="edit-data item">
                <p>{dataKey}:</p>
                <input
                  onChange={this.onDisplayDataChange}
                  type="text"
                  name={dataKey}
                  value={value}
                />
              </li>
            );
            break;
        }
        return inputCont;
      });
    } else {
      var displayItems = null;
    }

    const update_data_form = currentData ? (
      <form className="edit-data form" onSubmit={e => this.updateDisplays(e)}>
        <ul className="edit-data edit-list">{displayItems}</ul>
        <button
          className="edit-data form-button standard-button"
          onClick={e => {
            this.addDisplayToAvailable(e);
            closeModal();
          }}
        >
          Add Display to "{capitalizeFirstLetters(board)}"
        </button>
      </form>
    ) : null;

    return (
      <div className="edit-data container">
        <div className="edit-data data">
          <p className="edit-text">
            Select any available displays. You may recognize some from different
            locations. Please be aware, editing them will edit any of their live
            versions. Once you've found the display you'd like to show, press
            the "Change Current Display" to add that to your list of available
            options. If you'd like to create a new display, press the "Create
            New Display" button in the top right corner to create a new Display
            from the templates
          </p>
          {update_data_form}
        </div>
      </div>
    );
  }
}

export default EditDisplayModal;
