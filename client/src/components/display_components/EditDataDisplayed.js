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
      tempData: {},
      canSubmit: false,
      firstBreath: true
    };
    this.onDisplayDataChange = this.onDisplayDataChange.bind(this);
    this.updateDisplays = this.updateDisplays.bind(this);
    this.submitOnEnter = this.submitOnEnter.bind(this);
  }

  componentWillUpdate(nextProps, nextState) {
    // const { currentDisplayData: prevDisplayData } = this.props;
    // const { firstBreath, currentData, canSubmit } = nextState;
    // const { currentDisplayData } = nextProps;
    // const { location, board } = nextProps.match.params;
    // const prevBoard = this.props.match.params.board;
    // if (typeof currentDisplayData.alive === "undefined") {
    //   if (firstBreath) {
    //     this.setState({
    //       ...this.state,
    //       currentData: currentDisplayData,
    //       firstBreath: false
    //     });
    //   }
    //   if (
    //     JSON.stringify(prevDisplayData) !== JSON.stringify(currentDisplayData)
    //   ) {
    //     this.setState({
    //       ...this.state,
    //       currentData: currentDisplayData
    //     });
    //   }
    // }
  }

  onDisplayDataChange(e) {
    // const { currentData } = this.props;
    const { tempData } = this.state;
    const { name, value } = e.currentTarget;

    const newData = { ...tempData, [name]: value };

    this.setState(
      {
        ...this.state,
        tempData: newData,
        canSubmit: true
      },
      () => {
        // this.props.setDisplayData(newData);
      }
    );
  }

  updateDisplays(e) {
    e.preventDefault();
    const { currentData } = this.props;
    const { tempData } = this.state;
    const { location, board } = this.props.match.params;
    const currentDisplay = this.props.dbData[location][board].current_display;

    const finalData = Object.assign({ ...currentData }, { ...tempData });

    const path = `/displays/${currentDisplay.display_id}/`;
    db.ref(path).set(finalData, () => {
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

  openInNewWindow() {
    const { location, board } = this.props.match.params;
    this.props.history.push(`/display/${location}/${board}/`);
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
    const { canSubmit, tempData } = this.state;
    const { dbData, currentData: startingData } = this.props;
    const { location, board } = this.props.match.params;
    let displayItems = null;
    let gridDisplay = { rows: 1, columns: 1 };

    const currentDisplay = Object.keys(dbData).length
      ? dbData[location][board]
      : null;

    const currentData = Object.assign({ ...startingData }, { ...tempData });

    if (currentData && currentDisplay !== "no data yet") {
      displayItems = Object.keys(currentData).map((dataKey, index) => {
        const displayData = currentData[dataKey];

        if (gridDisplay.rows >= 4) {
          gridDisplay.rows = 1;
          gridDisplay.columns += 1;
        }

        let inputCont = null;
        let rowSpan = 0;
        switch (dataKey) {
          case "type":
            break;
          case "interval":
            rowSpan = 1;
            inputCont = (
              <li
                style={{
                  gridRowStart: `${gridDisplay.rows}`,
                  gridColumnStart: `${gridDisplay.columns}`,
                  gridRowEnd: `span ${rowSpan}`,
                  gridColumnEnd: "span 1"
                }}
                className={`edit-data item ${dataKey}`}
                key={index}
              >
                <p>Timing Interval:</p>
                <div className="edit-data input-container">
                  <input
                    onKeyDown={this.submitOnEnter}
                    className="edit-data interval"
                    onChange={this.onDisplayDataChange}
                    type="number"
                    name={dataKey}
                    value={displayData}
                    placeholder="seconds"
                  />
                  <span> Seconds</span>
                </div>
              </li>
            );
            gridDisplay.rows += rowSpan;
            break;
          case "carousel_displays":
          case "list_of_displays":
            rowSpan = 3;
            inputCont = (
              <DisplayListOfDisplays
                style={{
                  gridRowStart: `${gridDisplay.rows}`,
                  gridColumnStart: `${gridDisplay.columns}`,
                  gridRowEnd: `span ${rowSpan}`,
                  gridColumnEnd: "span 1"
                }}
                key={index}
                {...this.props}
                currentData={currentData}
                displayData={displayData}
                currentDisplay={currentDisplay}
              />
            );
            gridDisplay.rows += rowSpan;
            break;
          case "content":
            rowSpan = 2;
            inputCont = (
              <li
                style={{
                  gridRowStart: `${gridDisplay.rows}`,
                  gridColumnStart: `${gridDisplay.columns}`,
                  gridRowEnd: `span ${rowSpan}`,
                  gridColumnEnd: "span 1"
                }}
                key={index}
                className="edit-data item"
              >
                <p>Content:</p>
                <div className="text-area-wrap">
                  <div className="text-area-pull-tab" />
                  <textarea
                    rows="7"
                    cols="40"
                    onChange={this.onDisplayDataChange}
                    type="text"
                    name={dataKey}
                    value={displayData}
                  />
                </div>
              </li>
            );
            gridDisplay.rows += rowSpan;
            break;

          default:
            rowSpan = 1;
            const spellcheck =
              dataKey === "background_img" ||
              dataKey === "video" ||
              dataKey === "image"
                ? false
                : true;
            dataKey =
              dataKey === "background_img" ? "Background Image" : dataKey;

            inputCont = (
              <li
                spellCheck={spellcheck}
                style={{
                  gridRowStart: `${gridDisplay.rows}`,
                  gridColumnStart: `${gridDisplay.columns}`,
                  gridRowEnd: `span ${rowSpan}`,
                  gridColumnEnd: "span 1"
                }}
                key={index}
                className="edit-data item"
              >
                <p>{capitalizeFirstLetters(dataKey)}:</p>
                <input
                  onKeyDown={this.submitOnEnter}
                  onChange={this.onDisplayDataChange}
                  type="text"
                  name={dataKey}
                  value={displayData}
                />
              </li>
            );
            gridDisplay.rows += rowSpan;
            break;
        }
        return inputCont;
      });
    }

    const update_data_form = currentData ? (
      <form className="edit-data form" onSubmit={e => this.updateDisplays(e)}>
        <ul
          style={{
            gridTemplateColumns: `${gridDisplay.columns}`,
            gridTemplateRows: `${gridDisplay.rows}`
          }}
          className="edit-data edit-list"
        >
          {displayItems}
        </ul>
      </form>
    ) : null;

    const buttonAvailableClass = canSubmit ? "" : "unavailable-button";

    if (location && board) {
      return (
        <div className={`edit-container `}>
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
                  Update the data as you see fit and save it by pressing "
                  <span className="edit-data bold">Update Data</span>" below. If
                  you'd like to create a new board or view other boards that
                  have been made, press the "
                  <span className="edit-data bold">More Options</span>" button.
                </p>
              </div>
              <div className="buttons">
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
                <button
                  onClick={e =>
                    window.open(`/display/${location}/${board}/`, "_blank")
                  }
                  className="edit-data new-window standard-button"
                >
                  Open In New Window
                </button>
              </div>
            </div>

            {update_data_form}
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
    currentData: state.data.currentDisplayData
  };
}

export default connect(
  mapStateToProps,
  { setDisplayData }
)(EditDataDisplayed);
