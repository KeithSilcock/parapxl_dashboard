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
    const { currentDisplay } = nextProps;
    if (Object.keys(currentDisplay).length) {
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

  showAllDisplays() {
    const { location, board } = this.props.match.params;
    this.props.history.push(`/admin/home/${location}/${board}/add-new/display`);
  }

  // removeDisplayFromBoard(e) {
  //   e.preventDefault();
  //   const { clickedDisplay } = this.props;
  //   const { location, board } = this.props.match.params;
  //   const path = `/boards/${location}/${board}/available_displays/${
  //     clickedDisplay.availableDisplay_id
  //   }`;
  //   db.ref(path).remove();
  // }

  render() {
    const { currentData } = this.state;
    const { currentDisplay } = this.props;

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

    const update_data_form = currentData ? (
      <form className="edit-data form" onSubmit={e => this.updateDisplays(e)}>
        <ul className="edit-data edit-list">{displayItems}</ul>
      </form>
    ) : null;

    return (
      <div className="edit-data container">
        <div className="edit-data left-container">
          <div>
            <p className="edit-text">
              Above is the current data for the{" "}
              <span className="edit-data bold">
                {capitalizeFirstLetters(this.props.match.params.location)}{" "}
              </span>
              location's{" "}
              <span className="edit-data bold">
                {capitalizeFirstLetters(this.props.match.params.board)}
              </span>{" "}
              display.
            </p>{" "}
            <p className="edit-text">
              Update the data as you see fit and update it by pressing "<span className="edit-data bold">
                Update Data
              </span>" below. If you'd like to create a new board or view other
              boards that have been made, press the "<span className="edit-data bold">
                More Options
              </span>" button.
            </p>
          </div>
          <div className="edit-data button-box">
            <button
              type="button"
              onClick={e => {
                this.showAllDisplays();
              }}
              className="new standard-button"
            >
              More Options
            </button>
            <button
              type="submit"
              className="edit-data form-button standard-button"
            >
              Update Data
            </button>
            {/* <button
          type="button"
          className={`edit-data form-button update ${removeButtonClass}`}
          onClick={e => {
            if (removeButtonClass) {
              this.removeDisplayFromBoard(e);
            }
          }}
        >
          Remove
        </button> */}
          </div>
        </div>

        {update_data_form}
      </div>
    );
  }
}

export default EditDataDisplayed;
