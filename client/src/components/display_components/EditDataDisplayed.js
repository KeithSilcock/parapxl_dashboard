import React from "react";
import db from "../../firebase";
import { capitalizeFirstLetters } from "../../helpers";
import { connect } from "react-redux";
import { setDisplayData } from "../../actions";
import DisplayListOfDisplays from "../DisplayComponents/DisplayListOfDisplays";

import "../../assets/edit.css";

class EditDataDisplayed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentData: {},
      canSubmit: false,
      firstBreath: true
    };
    this.onDisplayDataChange = this.onDisplayDataChange.bind(this);
    this.updateDisplays = this.updateDisplays.bind(this);
    this.submitOnEnter = this.submitOnEnter.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    const { currentDisplayData: prevDisplayData } = this.props;
    const { firstBreath, currentData, canSubmit } = nextState;
    const { currentDisplayData } = nextProps;
    const { location, board } = nextProps.match.params;
    const prevBoard = this.props.match.params.board;

    if (typeof currentDisplayData.alive === "undefined") {
      if (firstBreath) {
        this.setState({
          ...this.state,
          currentData: currentDisplayData,
          firstBreath: false
        });
      }

      if (
        JSON.stringify(prevDisplayData) !== JSON.stringify(currentDisplayData)
      ) {
        this.setState({
          ...this.state,
          currentData: currentDisplayData
        });
      }
    }
  }

  onDisplayDataChange(e) {
    const { currentData } = this.state;
    const { name, value } = e.currentTarget;

    const newData = { ...currentData, [name]: value };

    this.setState({
      ...this.state,
      currentData: newData,
      canSubmit: true
    });
  }

  updateDisplays(e) {
    e.preventDefault();
    const { currentData } = this.state;
    const { location, board } = this.props.match.params;
    const currentDisplay = this.props.dbData[location][board].current_display;

    const path = `/displays/${currentDisplay.display_id}/`;
    db.ref(path).set({ ...currentData }, () => {
      this.setState({
        ...this.state,
        canSubmit: false
      });
    });
  }

  showAllDisplays() {
    const { location, board } = this.props.match.params;

    this.props.history.push(`/admin/home/${location}/${board}/add-new/display`);
  }

  submitOnEnter(e) {
    if (e.key === "Enter") {
      this.updateDisplays(e);
    }
  }

  // removeDisplayFromBoard(e) {
  // !!!no long has available displays on firebase
  //   e.preventDefault();
  //   const { clickedDisplay } = this.props;
  //   const { location, board } = this.props.match.params;
  //   const path = `/boards/${location}/${board}/available_displays/${
  //     clickedDisplay.availableDisplay_id
  //   }`;
  //   db.ref(path).remove();
  // }

  render() {
    const { currentData, canSubmit } = this.state;
    const { dbData } = this.props;
    const { location, board } = this.props.match.params;
    var displayItems = null;

    if (Object.keys(dbData).length) {
      const currentDisplay = dbData[location][board];

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
                      onKeyDown={this.submitOnEnter}
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
                    onKeyDown={this.submitOnEnter}
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
      }
    }

    const update_data_form = currentData ? (
      <form className="edit-data form" onSubmit={e => this.updateDisplays(e)}>
        <ul className="edit-data edit-list">{displayItems}</ul>
      </form>
    ) : null;

    const buttonAvailableClass = canSubmit ? "" : "unavailable-button";

    if (location && board) {
      return (
        <div className={`edit-container `}>
          <div className="edit-content">
            <div className="edit-data container">
              <div className="edit-data left-container">
                <div>
                  <p className="edit-text">
                    Above is the current data for the{" "}
                    <span className="edit-data bold">
                      {capitalizeFirstLetters(location)}{" "}
                    </span>
                    location's{" "}
                    <span className="edit-data bold">
                      {capitalizeFirstLetters(board)}
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
                    onClick={this.updateDisplays}
                    className={`edit-data form-button standard-button ${buttonAvailableClass} `}
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
    } else {
      return null;
    }
  }
}

function mapStateToProps(state) {
  return {
    dbData: state.data.dbData,
    boards: state.data.boards,
    currentDisplayData: state.data.currentDisplayData
  };
}

export default connect(
  mapStateToProps,
  { setDisplayData }
)(EditDataDisplayed);
