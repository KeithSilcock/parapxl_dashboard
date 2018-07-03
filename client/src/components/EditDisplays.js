import React from "react";
import db from "../firebase";
import BoardDisplay from "./BoardDisplay";
import { capitalizeFirstLetters } from "../helpers";
import EditDataDisplayed from "./EditDataDisplayed";
import AllDisplays from "./AllDisplaysModal";

import "../assets/edit.css";

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

      this.setState({
        availableDisplays,
        currentDisplay
      });
    });
  }

  clickedDisplay(clickedDisplay) {
    this.setState({
      clickedDisplay
    });
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

    timedAnimation(closing);
  }

  showAllDisplays() {
    this.props.history.push(this.props.location.pathname + "/add-new/display");
  }

  render() {
    const { availableDisplays, clickedDisplay, currentDisplay } = this.state;
    const { boardsAreHidden, boardsAreTransitioning } = this.props;
    const renderAvailableDisplays = Object.keys(availableDisplays).map(
      (item, index) => {
        const display = availableDisplays[item];

        if (!clickedDisplay.display_id) {
          var selectedClassName =
            currentDisplay.display_id === availableDisplays[item].display_id
              ? "selectedDisplay"
              : "";
        } else {
          var selectedClassName =
            clickedDisplay.display_id === availableDisplays[item].display_id
              ? "selectedDisplay"
              : "";
        }

        return (
          <li
            key={index}
            className={`${selectedClassName} display-item`}
            onClick={e => this.clickedDisplay(display)}
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
              <button onClick={this.showAllDisplays.bind(this)}>
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
            <ul className="edit-list">{renderAvailableDisplays}</ul>
            <EditDataDisplayed
              currentDisplay={currentDisplay}
              clickedDisplay={clickedDisplay}
              boardsAreHidden={boardsAreHidden}
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
