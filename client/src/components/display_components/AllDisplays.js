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
      waitingForSecondClick: false
    };
    this.clickTimer = null;
    this.clickDelay = 200;
  }
  componentDidMount() {
    const path = `/displays`;
    db.ref(path).on("value", snapshot => {
      const displays = snapshot.val();

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

      this.setState({
        displays,
        boardTypes
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
      //delete old timeout
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
    const { displays, currentSelection, boardTypes } = this.state;
    const { location, board } = this.props.match.params;

    const boardTypeLists = Object.keys(boardTypes).map((boardType, index1) => {
      const boardTypeText = boardTypes[boardType].text;
      const isOpen = boardTypes[boardType].isOpen;
      const boardTypeCount = boardTypes[boardType].count;

      const boardDisplays = Object.keys(displays).map((displayHash, index2) => {
        const displayData = displays[displayHash];

        if (displayData.type === boardType) {
          return (
            <li key={index2} className="all-displays item">
              <BoardDisplay miniBoard={true} displayData={displayData} />
            </li>
          );
        }
      });

      const listChevron = isOpen ? (
        <i className="fas fa-chevron-down" />
      ) : (
        <i className="fas fa-chevron-up" />
      );

      const setHeight = isOpen
        ? { maxHeight: `${60 * boardTypeCount}vh` }
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
            <p>{boardTypeText}</p>
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
          {boardTypeLists}
          {/* <EditDisplayModal
            {...this.props}
            resetSelection={this.resetSelection.bind(this)}
            currentSelection={currentSelection}
            // updateCurrentDisplay={this.updateCurrentDisplay.bind(this)}
          /> */}
        </div>
      </div>
    );
  }
}

export default AllDisplays;
