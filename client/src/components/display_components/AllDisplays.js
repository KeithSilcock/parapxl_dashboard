import React from "react";
import db from "../../firebase";
import BoardDisplay from "../board_components/BoardDisplay";
import { capitalizeFirstLetters } from "../../helpers";

// import EditDisplayModal from "./EditDisplayModal";

import "../../assets/allDisplays.css";

class AllDisplays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displays: {},
      boardTypes: {},
      currentSelection: {},
      waitingForSecondClick: false,
      currentAvailDisplays: {},
      displayOnTV: {}
    };
    this.clickTimer = null;
    this.clickDelay = 200;
  }
  componentDidMount() {
    const { location, board } = this.props.match.params;

    const path1 = `/displays`;
    db.ref(path1).on("value", snapshot => {
      const displays = snapshot.val();

      const path2 = `/boards/${location}/${board}`;
      db.ref(path2).on("value", snapshot => {
        const localDisplay = snapshot.val();

        const boardTypes = Object.keys(displays).reduce((prev, displayHash) => {
          const displayData = displays[displayHash];

          //get prev count
          let prevCount = 1;
          if (prev[displayData.type]) {
            prevCount = prev[displayData.type].count + 1;
          }

          return Object.assign(prev, {
            [displayData.type]: {
              text: capitalizeFirstLetters(
                displayData.type.split("-").join(" "),
                true
              ),
              isOpen: false,
              count: prevCount
            }
          });
        }, {});

        const previousDisplays = {
          previous: {
            text: "Previously Displayed",
            boards: localDisplay.available_displays,
            count: Object.keys(localDisplay.available_displays).length,
            isOpen: false
          }
        };

        const finalBoardTypes = Object.assign(boardTypes, previousDisplays);

        this.setState({
          displays,
          boardTypes: finalBoardTypes,
          currentAvailDisplays: localDisplay.available_displays,
          displayOnTV: localDisplay.current_display
        });
      });
    });
  }

  resetSelection() {
    this.setState({
      ...this.state,
      currentSelection: {}
    });
  }

  selectItem(displayData, display_id) {
    const { currentSelection } = this.state;

    if (
      JSON.stringify(currentSelection) ===
      JSON.stringify({ displayData, display_id })
    ) {
      this.setState({
        ...this.state,
        currentSelection: {}
      });
      return;
    }

    this.setState({
      ...this.state,
      currentSelection: { displayData, display_id }
    });
  }

  goBackToPrevPage() {
    const { location, board } = this.props.match.params;
    this.props.history.push(`/admin/${location}/${board}`);
  }

  createNewDisplay(e) {
    const { location, board } = this.props.match.params;
    this.props.history.push(`/admin/${location}/${board}/create-new/display`);
  }

  openList(e, boardType, currentlyIsOpen) {
    const { boardTypes, waitingForSecondClick } = this.state;

    if (waitingForSecondClick) {
      clearTimeout(this.clickTimer);
      this.setState({
        ...this.state,
        waitingForSecondClick: false
      });
      this.doubleClickAffectAll(e, currentlyIsOpen);
      return;
    }

    if (!waitingForSecondClick) {
      this.setState({
        ...this.state,
        waitingForSecondClick: true
      });
      this.clickTimer = setTimeout(() => {
        //after click delay, run code
        const inner = { ...boardTypes[boardType], isOpen: !currentlyIsOpen };
        const newBoardTypes = { ...boardTypes, [boardType]: inner };
        this.setState({
          ...this.state,
          boardTypes: newBoardTypes,
          waitingForSecondClick: false
        });
      }, this.clickDelay);
    }
  }

  updateCurrentDisplay() {
    const { currentSelection, currentAvailDisplays } = this.state;
    const { location, board } = this.props.match.params;
    if (Object.keys(currentSelection).length) {
      const setAsAvailableDisplay = {
        ...currentAvailDisplays,
        [currentSelection.display_id]: true
      };
      const setAsCurrentDisplay = {
        display_id: currentSelection.display_id,
        name: currentSelection.displayData.name,
        type: currentSelection.displayData.type
      };
      const availPath = `/boards/${location}/${board}/available_displays`; //push
      const currPath = `/boards/${location}/${board}/current_display`; //set

      db.ref(availPath).update(setAsAvailableDisplay, () => {});

      db.ref(currPath).set(setAsCurrentDisplay, () => {
        this.setState({
          displayOnTV: setAsCurrentDisplay
        });
      });
    }
  }

  doubleClickAffectAll(e, currentlyIsOpen) {
    const { boardTypes } = this.state;

    const newBoardTypes = Object.keys(boardTypes).reduce((prev, boardType) => {
      const status = boardTypes[boardType];

      return Object.assign(prev, {
        [boardType]: {
          text: status.text,
          count: status.count,
          isOpen: !currentlyIsOpen
        }
      });
    }, {});

    this.setState({
      boardTypes: newBoardTypes
    });
  }

  render() {
    const { displays, currentSelection, boardTypes, displayOnTV } = this.state;
    const { location, board } = this.props.match.params;

    const boardTypeLists = Object.keys(boardTypes).map((boardType, index1) => {
      const boardTypeText = boardTypes[boardType].text;
      const isOpen = boardTypes[boardType].isOpen;
      const boardTypeCount = boardTypes[boardType].count;

      if (boardType !== "previous") {
        var boardDisplays = Object.keys(displays).map((displayHash, index2) => {
          const displayData = displays[displayHash];

          const selectedItemClass =
            currentSelection.display_id === displayHash
              ? "selected-new-display"
              : "";
          const currentlyDisplayedOnTVObj =
            displayOnTV.display_id === displayHash ? (
              <span>Currently Displayed</span>
            ) : null;

          if (displayData.type === boardType) {
            return (
              <li
                key={index2}
                onClick={e => this.selectItem(displayData, displayHash)}
                className={`all-displays item-container ${selectedItemClass}`}
              >
                <div className="all-displays item">
                  <div className="all-displays item-header">
                    {/* <div className="spacer" /> */}
                    <span className="all-displays item-name">
                      {displayData.name} {currentlyDisplayedOnTVObj}
                    </span>
                    <span className="all-displays item-options">
                      <i class="fas fa-ellipsis-v" />
                    </span>
                  </div>
                  <BoardDisplay miniBoard={true} displayData={displayData} />
                </div>
              </li>
            );
          }
        });
      } else {
        boardDisplays = Object.keys(boardTypes[boardType].boards).map(
          (randomHash, index) => {
            const displayData = displays[randomHash];

            const selectedItemClass =
              currentSelection.display_id === randomHash
                ? "selected-new-display"
                : "";

            return (
              <li
                key={index}
                onClick={e =>
                  this.selectItem(
                    displayData,
                    boardTypes[boardType].boards[randomHash].display_id
                  )
                }
                className={`all-displays item-container ${selectedItemClass}`}
              >
                <div className="all-displays item">
                  <div className="all-displays item-header">
                    {/* <div className="spacer" /> */}
                    <span className="all-displays item-name">
                      {displayData.name}
                    </span>
                    <span className="all-displays item-options">
                      <i class="fas fa-ellipsis-v" />
                    </span>
                  </div>
                  <BoardDisplay miniBoard={true} displayData={displayData} />
                </div>
              </li>
            );
          }
        );
      }

      const listChevron = isOpen ? (
        <i className="fas fa-chevron-down" />
      ) : (
        <i className="fas fa-chevron-up" />
      );

      const setHeight = isOpen
        ? { maxHeight: `${90 * boardTypeCount}vh` }
        : { maxHeight: "0" };

      return (
        <div className="all-displays list-container">
          <div
            className="all-displays list-header"
            onClick={e => {
              this.openList(e, boardType, isOpen);
            }}
            // onDoubleClick={e => this.doubleClickAffectAll(e, isOpen)}
          >
            <div className="spacer" />
            <div className="all-displays center-piece">
              <div className="center-piece-decoration left">
                <div className="list-design short" />
                <div className="list-design long" />
                <div className="list-design short" />
              </div>
              <div className="all-displays board-type-text">
                {boardTypeText}
              </div>
              <div className="center-piece-decoration right">
                <div className="list-design short" />
                <div className="list-design long" />
                <div className="list-design short" />
              </div>
            </div>
            <div className="right-side">{listChevron}</div>
          </div>
          <div style={setHeight} className="all-displays list-shell">
            <ul key={index1} className="all-displays list">
              {boardDisplays}
            </ul>
          </div>
        </div>
      );
    });

    // const renderObjects = Object.keys(displays).map((displayHash, index) => {
    //   const newDisplay = displays[displayHash];
    //   const selectedTemplateClass =
    //     currentSelection.display_id === displayHash
    //       ? "selected-new-display"
    //       : "";

    //   return (
    //     <div
    //       className={`new-display ${newDisplay.type} ${selectedTemplateClass}`}
    //       onClick={e => {
    //         this.selectItem(newDisplay, displayHash);
    //         // this.addCurrentTemplateToBoard(displayType, displayTemplate);
    //       }}
    //       key={index}
    //     >
    //       <h4>
    //         {newDisplay.name} ({newDisplay.type})
    //       </h4>
    //       <div className="display-type-preview">
    //         <BoardDisplay
    //           miniBoard={true}
    //           thisBoard={{ display_id: displayHash, type: newDisplay.type }}
    //         />
    //       </div>
    //     </div>
    //   );
    // });

    // const setHeight =
    //   this.props.location.pathname ===
    //   `/admin/home/${location}/${board}/add-new/display`
    //     ? { top: "-100%", transition: "all 1s" }
    //     : { top: "100%", transition: "all 1s" };

    const canSubmitButtonClass = Object.keys(currentSelection).length
      ? "standard-button"
      : "unavailable-button";

    var currentSelectionName = currentSelection.displayData
      ? currentSelection.displayData.name
      : "display";

    return (
      <div className="all-displays container">
        <div className="all-displays header">
          <button
            className="back-button"
            onClick={e => {
              this.props.history.push(`/admin/home/${location}/${board}`);
            }}
          >
            <i class="fas fa-chevron-left" />
          </button>
          <div className="all-displays header-text">
            <h2> All BrainyActz Displays</h2>
          </div>
          <button
            className="standard-button"
            onClick={e => this.createNewDisplay(e)}
          >
            Create New Display
          </button>
        </div>

        <div className="all-displays content">
          <div className="all-displays left">
            <p>
              Please select from the right which board you'd like to set to the{" "}
              {`${location} ${board}'s`} display.{" "}
            </p>
            <p>
              Once you've selected your display, press "Set{" "}
              {`${board} to ${currentSelectionName}`}" below.
            </p>

            <button
              className={`${canSubmitButtonClass}`}
              onClick={e => this.updateCurrentDisplay()}
            >
              Set {`${board} to ${currentSelectionName}`}
            </button>
          </div>
          <div className="all-displays right">
            {boardTypeLists}
            {/* <EditDisplayModal
            {...this.props}
            resetSelection={this.resetSelection.bind(this)}
            currentSelection={currentSelection}
            // updateCurrentDisplay={this.updateCurrentDisplay.bind(this)}
          /> */}
          </div>
        </div>
      </div>
    );
  }
}

export default AllDisplays;
