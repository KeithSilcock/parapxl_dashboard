import React from "react";
import db from "../../firebase";
import BoardDisplay from "../board_components/BoardDisplay";
import { capitalizeFirstLetters } from "../../helpers";
import EditDataDisplayed from "./EditDataDisplayed";

import "../../assets/edit.css";

class EditDisplays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      availableDisplays: {},
      clickedDisplay: {},
      currentDisplay: {}
    };
  }
  componentWillReceiveProps() {
    this.getDisplays();
  }

  getDisplays() {
    const { location, board } = this.props.match.params;

    const path = `/boards/${location}/${board}`;
    db.ref(path).on("value", snapshot => {
      const availableDisplays = snapshot.val().available_displays;
      const currentDisplay = snapshot.val().current_display;

      //find key of availableDisplays and assign it to currentDisplay object.
      if (
        availableDisplays &&
        currentDisplay &&
        Object.keys(availableDisplays).length
      )
        for (let keyIndex in availableDisplays) {
          if (
            availableDisplays[keyIndex].display_id === currentDisplay.display_id
          ) {
            currentDisplay["availableDisplayKey"] = keyIndex;
            break;
          }
        }

      this.setState({
        availableDisplays,
        currentDisplay
      });
    });
  }

  clickedDisplay(clickedDisplay, availableDisplay_id) {
    const newData = {
      ...clickedDisplay,
      availableDisplay_id
    };
    this.setState({
      clickedDisplay: newData
    });
    const { location, board } = this.props.match.params;
    this.props.history.push(
      `/admin/home/${location}/${board}/${availableDisplay_id}`
    );
  }

  updateCurrentDisplay() {
    const { clickedDisplay } = this.state;
    const { location, board } = this.props.match.params;
    if (clickedDisplay.display_id) {
      db.ref(`/boards/${location}/${board}/current_display`).set(
        clickedDisplay,
        () => {}
      );
    }
  }

  closeAnimation(closing) {
    const { timedAnimation } = this.props;

    this.setState({
      clickedDisplay: {}
    });
    timedAnimation(
      closing,
      false,
      `/admin/home/${this.props.match.params.location}`
    );
  }

  showAllDisplays() {
    const { location, board } = this.props.match.params;
    this.props.history.push(`/admin/home/${location}/${board}/add-new/display`);
  }

  render() {
    const { availableDisplays, clickedDisplay, currentDisplay } = this.state;
    const { boardsAreHidden, boardsAreTransitioning } = this.props;
    const { board, selected } = this.props.match.params;
    var displaysAvailable = true;

    if (availableDisplays && Object.keys(availableDisplays).length) {
      displaysAvailable = true;
      var renderAvailableDisplays = Object.keys(availableDisplays).map(
        (item, index) => {
          const display = availableDisplays[item];

          if (!selected) {
            var selectedClassName =
              currentDisplay.availableDisplayKey === item
                ? "selectedDisplay"
                : "";
          } else {
            var selectedClassName = selected === item ? "selectedDisplay" : "";
          }

          return (
            <li
              key={index}
              className={`${selectedClassName} display-item`}
              onClick={e => this.clickedDisplay(display, item)}
            >
              <div className="edit-item-content">
                <div className={`display-type ${item}`}>
                  <span>{capitalizeFirstLetters(display.name, true)}</span>
                </div>
                <div className="display-type-preview">
                  <BoardDisplay thisBoard={display} />
                </div>
              </div>
            </li>
          );
        }
      );
    } else {
      displaysAvailable = false;
      var renderAvailableDisplays = (
        <li className="display-item edit-item displays-unavailable">
          <p>
            There are no available displays for the "{`${board}`}" board. Please
            select "Add Displays" under this message to add some displays to
            your board
          </p>
          <div className="edit-item add-displays-box">
            <button
              className="edit-item add-displays standard-button"
              onClick={this.showAllDisplays.bind(this)}
            >
              Add Displays
            </button>
          </div>
        </li>
      );
    }

    const listDisplayStyle = displaysAvailable
      ? {}
      : { justifyContent: "center" };

    //aniamation
    if (boardsAreTransitioning) {
      var animationClassUpStart = boardsAreTransitioning.up
        ? "edit-slide-up-start"
        : "";
      var animationClassDownStart = boardsAreTransitioning.down
        ? "edit-slide-down-start"
        : "";
    }

    const animationClassUpEnd =
      boardsAreHidden ||
      boardsAreTransitioning.up ||
      boardsAreTransitioning.down ? (
        <div
          className={`edit-container ${animationClassUpStart ||
            animationClassDownStart}`}
        >
          <div className="edit-header">
            <div className="spacer" />
            <h3>
              Available Displays for the "{capitalizeFirstLetters(
                this.props.match.params.board
              )}"
            </h3>
            <div className="edit-close">
              <button
                className="standard-button"
                onClick={this.showAllDisplays.bind(this)}
              >
                More Options
              </button>
              <div
                className="x"
                onClick={e => this.closeAnimation(boardsAreHidden)}
              >
                <span>&#10006;</span>
              </div>
              <div className="spacer" />
            </div>
          </div>

          <div className="edit-content">
            <ul className={`edit-list`} style={listDisplayStyle}>
              {renderAvailableDisplays}
            </ul>
            <EditDataDisplayed
              {...this.props}
              displaysAvailable={displaysAvailable}
              currentDisplay={currentDisplay}
              clickedDisplay={clickedDisplay}
              closeAnimation={this.closeAnimation.bind(this)}
              updateCurrentDisplay={this.updateCurrentDisplay.bind(this)}
            />
          </div>
          {/* <div className="boards-footer">{displayAddNewBoard}</div> */}
        </div>
      ) : null;

    return animationClassUpEnd;
  }
}

export default EditDisplays;
