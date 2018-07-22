import React from "react";
import db from "../../firebase";
import { capitalizeFirstLetters } from "../../helpers";
import DisplayListOfDisplays from "../DisplayComponents/DisplayListOfDisplays";

class EditDataDisplayed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentData: {}
    };
    this.onDisplayDataChange = this.onDisplayDataChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { clickedDisplay, currentDisplay } = nextProps;

    if (Object.keys(clickedDisplay).length) {
      var path = `/displays/${clickedDisplay.display_id}`;
      db.ref(path).on("value", snapshot => {
        const currentData = snapshot.val();

        this.setState({
          ...this.state,
          currentData
        });
      });
    } else if (currentDisplay) {
      var path = `/displays/${currentDisplay.display_id}`;
      db.ref(path).on("value", snapshot => {
        const currentData = snapshot.val();

        this.setState({
          ...this.state,
          currentData
        });
      });
    }
  }

  onDisplayDataChange(e) {
    const { currentData } = this.state;
    const { name, value } = e.currentTarget;

    const newData = { ...currentData, [name]: value };

    this.setState({
      ...this.state,
      currentData: newData
    });
  }

  updateDisplays(e) {
    e.preventDefault();
    const { currentData } = this.state;
    const { currentDisplay } = this.props;

    const path = `/displays/${currentDisplay.display_id}/`;
    db.ref(path).set({ ...currentData });
  }

  removeDisplayFromBoard(e) {
    e.preventDefault();
    const { clickedDisplay } = this.props;
    const { location, board } = this.props.match.params;
    const path = `/boards/${location}/${board}/available_displays/${
      clickedDisplay.availableDisplay_id
    }`;
    db.ref(path).remove();
  }

  render() {
    const { currentData } = this.state;
    const {
      updateCurrentDisplay,
      currentDisplay,
      closeAnimation,
      boardsAreHidden,
      clickedDisplay,
      displaysAvailable
    } = this.props;

    if (currentData) {
      var displayItems = Object.keys(currentData).map((dataKey, index) => {
        const displayData = currentData[dataKey];

        var inputCont = null;
        switch (dataKey) {
          case "type":
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
                displayData={displayData}
                currentDisplay={currentDisplay}
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

    if (Object.keys(clickedDisplay).length) {
      var removeButtonClass =
        clickedDisplay.availableDisplay_id !==
          currentDisplay.availableDisplayKey &&
        clickedDisplay.availableDisplay_id
          ? "delete-button"
          : "";

      var selectedClassName =
        clickedDisplay.availableDisplay_id !==
          currentDisplay.availableDisplayKey &&
        clickedDisplay.availableDisplay_id
          ? "standard-button"
          : "";
    }

    const buttonsDisplay = displaysAvailable ? (
      <div className="edit-data button-box">
        <button type="submit" className="edit-data form-button standard-button">
          Update Data
        </button>
        <button
          type="button"
          className={`edit-data form-button update ${removeButtonClass}`}
          onClick={e => {
            if (removeButtonClass) {
              this.removeDisplayFromBoard(e);
            }
          }}
        >
          Remove
        </button>
      </div>
    ) : null;

    const update_data_form = currentData ? (
      <form className="edit-data form" onSubmit={e => this.updateDisplays(e)}>
        <ul className="edit-data edit-list">{displayItems}</ul>
        {buttonsDisplay}
      </form>
    ) : null;

    return (
      <div className="edit-data container">
        <div className="edit-data data">
          <p className="edit-text">
            <span className="edit-data bold">Select any previous display</span>{" "}
            from the left. Once you've found the display you'd like to show, you
            can update the{" "}
            {capitalizeFirstLetters(this.props.match.params.board)}'s display
            data below and add it to the board by confirming "<span className="edit-data bold">
              Change to Current Display
            </span>" under that. If you'd like to create a new board, press the
            "<span className="edit-data bold">+</span>" button to create a new
            display from the templates
          </p>
          {update_data_form}
        </div>

        <div className="buttons">
          <button
            className={`update ${selectedClassName}`}
            onClick={e => {
              if (selectedClassName) {
                updateCurrentDisplay();

                if (typeof boardsAreHidden !== "undefined")
                  closeAnimation(boardsAreHidden);
              }
            }}
          >
            Change to Current Display
          </button>
          <button
            onClick={e => {
              const { location, board } = this.props.match.params;
              this.props.history.push(
                `/admin/${location}/${board}/create-new/display`
              );
            }}
            className="new standard-button"
          >
            +
          </button>
        </div>
      </div>
    );
  }
}

export default EditDataDisplayed;
