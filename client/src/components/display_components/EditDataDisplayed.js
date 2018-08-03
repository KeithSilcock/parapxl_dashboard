import React from "react";
import db from "../../firebase";
import { capitalizeFirstLetters } from "../../helpers";
import { connect } from "react-redux";
import {} from "../../actions";
import DisplayListOfDisplays from "../DisplayComponents/DisplayListOfDisplays";

import "../../assets/edit.css";

class EditDataDisplayed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentData: {}
    };
    this.onDisplayDataChange = this.onDisplayDataChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { currentData } = this.state;
    const { currentDisplay } = nextProps;
    const { location, board } = nextProps.match.params;
    const prevBoard = this.props.boardLocation;

    if (prevBoard !== board && Object.keys(currentDisplay).length) {
      this.getData(currentDisplay);
    }

    if (
      typeof currentDisplay === "object" &&
      Object.keys(currentDisplay).length &&
      !Object.keys(currentData).length
    ) {
      this.setState(
        {
          ...this.state,
          currentData: { active: true }
        },
        () => {
          this.getData(currentDisplay);
        }
      );
    }
  }

  getData(currentDisplay) {
    if (currentDisplay !== "no data yet") {
      var path = `/displays/${currentDisplay.current_display.display_id}`;
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
    const { currentLocation, boardLocation } = this.props;

    this.props.history.push(
      `/admin/home/${currentLocation}/${boardLocation}/add-new/display`
    );
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
    const { currentDisplay, currentLocation, boardLocation } = this.props;

    if (currentData && currentDisplay !== "no data yet") {
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
      <div className={`edit-container `}>
        <div className="edit-content">
          <div className="edit-data container">
            <div className="edit-data left-container">
              <div>
                <p className="edit-text">
                  Above is the current data for the{" "}
                  <span className="edit-data bold">
                    {capitalizeFirstLetters(currentLocation)}{" "}
                  </span>
                  location's{" "}
                  <span className="edit-data bold">
                    {capitalizeFirstLetters(boardLocation)}
                  </span>{" "}
                  display.
                </p>{" "}
                <p className="edit-text">
                  Update the data as you see fit and save it by pressing "<span className="edit-data bold">
                    Update Data
                  </span>" below. If you'd like to create a new board or view
                  other boards that have been made, press the "<span className="edit-data bold">
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
              <div className="spacer" />
            </div>

            {update_data_form}
          </div>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    currentLocation: state.data.currentLocation,
    currentBoards: state.data.boards,
    currentDisplay: state.data.display,
    boardLocation: state.data.currentBoardLocation
  };
}

export default connect(
  mapStateToProps,
  {}
)(EditDataDisplayed);
