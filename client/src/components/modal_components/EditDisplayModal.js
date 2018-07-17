import React from "react";
import db from "../../firebase";
import { capitalizeFirstLetters } from "../../helpers";
import DisplayListOfDisplays from "../DisplayComponents/DisplayListOfDisplays";
import WarningModal from "../WarningModal";

class EditDisplayModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentData: {},
      currentDisplay_id: "",
      excludedDisplays: [],
      displayWarningModal: false
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

  toggleModal() {
    const { displayWarningModal } = this.state;

    this.setState({
      ...this.state,
      displayWarningModal: !displayWarningModal
    });
  }

  deleteDisplay(e) {
    const { currentDisplay_id } = this.state;
    const { resetSelection } = this.props;

    const path = `/displays/${currentDisplay_id}`;
    db.ref(path).remove(() => {
      this.toggleModal();
      resetSelection();
    });
  }

  render() {
    const { currentData, displayWarningModal } = this.state;
    const { closeModal } = this.props;
    const { board } = this.props.match.params;

    const warningModal = displayWarningModal ? (
      <WarningModal
        header={currentData.name}
        cancel={this.toggleModal.bind(this)}
        confirm={this.deleteDisplay.bind(this)}
      />
    ) : null;

    if (currentData) {
      var displayItems = Object.keys(currentData).map((dataKey, index) => {
        const displayData = currentData[dataKey];
        var inputCont = null;
        switch (dataKey) {
          case "type":
            break;
          case "display_id":
            break;
          case "interval":
            inputCont = (
              <li className={`edit-data item ${dataKey}`} key={index}>
                <p>Timing Interval:</p>
                <div className="edit-data input-container">
                  <input
                    className="edit-data interval"
                    onChange={this.onDisplayDataChange}
                    type="text"
                    name={dataKey}
                    value={displayData}
                    placeholder="#"
                  />
                  <span> Seconds</span>
                </div>
              </li>
            );
            break;
          case "carousel_displays":
          case "list_of_displays":
            inputCont = (
              <DisplayListOfDisplays
                key={index}
                currentData={currentData}
                currentDisplay={{ display_id: this.state.currentDisplay_id }}
              />
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
                  value={displayData}
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
                  value={displayData}
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
      <form className="edit-data form">
        <ul className="edit-data edit-list">
          {displayItems}{" "}
          <li>
            <button
              type="button"
              className="edit-data standard-button"
              onClick={e => this.updateDisplays(e)}
            >
              Update Changes
            </button>
          </li>
        </ul>
        <div className="edit-data buttons">
          <button
            className="edit-data form-button standard-button"
            type="button"
            onClick={e => {
              this.addDisplayToAvailable(e);
              closeModal();
            }}
          >
            Add Display to "{capitalizeFirstLetters(board)}"
          </button>
          <button
            onClick={e => this.toggleModal(e)}
            type="button"
            className="edit-data delete-button"
          >
            Delete
          </button>
        </div>
      </form>
    ) : null;

    return (
      <div className="edit-data container">
        {warningModal}
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
