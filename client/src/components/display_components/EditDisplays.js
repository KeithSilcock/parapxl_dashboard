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
      currentDisplay: {}
    };
  }

  componentDidMount() {
    const { location, board } = this.props.match.params;

    if (board) {
      var path = `/boards/${location}/${board}`;
      db.ref(path).on("value", snapshot => {
        const displayData = snapshot.val();

        if (!displayData || displayData === "no data yet") {
          return;
        }
        this.setState({
          ...this.state,
          currentDisplay: displayData.current_display
        });
      });
    }
  }

  componentWillReceiveProps(newProps) {
    const { location, board } = this.props.match.params;
    const newBoard = newProps.match.params.board;

    if (board && board !== newBoard) {
      var path = `/boards/${location}/${newBoard}`;
      db.ref(path).on("value", snapshot => {
        const displayData = snapshot.val();
        this.setState({
          ...this.state,
          currentDisplay: displayData.current_display
        });
      });
    }
  }

  // componentWillReceiveProps() {
  //   const { location, board } = this.props.match.params;

  //   const path = `/boards/${location}/${board}`;
  //   db.ref(path).on("value", snapshot => {
  //     if (snapshot.val()) {
  //       const availableDisplays = snapshot.val().available_displays;
  //       const currentDisplay = snapshot.val().current_display;
  //       debugger;
  //       //find key of availableDisplays and assign it to currentDisplay object.
  //       if (
  //         availableDisplays &&
  //         currentDisplay &&
  //         Object.keys(availableDisplays).length
  //       )
  //         for (let keyIndex in availableDisplays) {
  //           if (
  //             availableDisplays[keyIndex].display_id ===
  //             currentDisplay.display_id
  //           ) {
  //             currentDisplay["availableDisplayKey"] = keyIndex;
  //             break;
  //           }
  //         }

  //       this.setState({
  //         availableDisplays,
  //         currentDisplay
  //       });
  //     }
  //   });
  // }

  // clickedDisplay(clickedDisplay, availableDisplay_id) {
  //   const newData = {
  //     ...clickedDisplay,
  //     availableDisplay_id
  //   };
  //   this.setState({
  //     clickedDisplay: newData
  //   });
  //   const { location, board } = this.props.match.params;
  //   this.props.history.push(
  //     `/admin/home/${location}/${board}/${availableDisplay_id}`
  //   );
  // }

  // updateCurrentDisplay() {
  //   const { clickedDisplay } = this.state;
  //   const { location, board } = this.props.match.params;
  //   if (clickedDisplay.display_id) {
  //     db.ref(`/boards/${location}/${board}/current_display`).set(
  //       clickedDisplay,
  //       () => {}
  //     );
  //   }
  // }

  // closeAnimation(closing) {
  //   const { timedAnimation } = this.props;

  //   this.setState({
  //     clickedDisplay: {}
  //   });
  //   timedAnimation(
  //     closing,
  //     false,
  //     `/admin/home/${this.props.match.params.location}`
  //   );
  // }

  render() {
    const { currentDisplay } = this.state;
    // const { boardsAreHidden, boardsAreTransitioning } = this.props;

    // if (availableDisplays && Object.keys(availableDisplays).length) {
    //   displaysAvailable = true;
    //   var renderAvailableDisplays = Object.keys(availableDisplays).map(
    //     (item, index) => {
    //       const display = availableDisplays[item];

    //       if (!selected) {
    //         var selectedClassName =
    //           currentDisplay.availableDisplayKey === item
    //             ? "selectedDisplay"
    //             : "";
    //       } else {
    //         var selectedClassName = selected === item ? "selectedDisplay" : "";
    //       }
    //       const currentDisplayedBoard =
    //         currentDisplay.availableDisplayKey === item ? (
    //           <span className="edit-item current-display blue bold">
    //             Currently Displayed
    //           </span>
    //         ) : null;

    //       return (
    //         <li
    //           key={index}
    //           className={`${selectedClassName} edit-item display-item`}
    //           onClick={e => this.clickedDisplay(display, item)}
    //         >
    //           <div className="edit-item-content">
    //             <div className={`display-type ${item}`}>
    //               <span>{capitalizeFirstLetters(display.name, true)}</span>
    //               {currentDisplayedBoard}
    //             </div>
    //             <div className="display-type-preview">
    //               <BoardDisplay thisBoard={display} />
    //             </div>
    //           </div>
    //         </li>
    //       );
    //     }
    //   );
    // } else {
    //   displaysAvailable = false;
    //   var renderAvailableDisplays = (
    //     <li className="display-item edit-item displays-unavailable">
    //       <p>
    //         There are currently no previous displays for the{" "}
    //         <span className="edit-data bold">{`${board}`}</span>. Please "<span className="edit-data bold">
    //           Add Displays
    //         </span>" to add some displays to your board
    //       </p>
    //       <div className="edit-item add-displays-box">
    //         <button
    //           className="edit-item add-displays standard-button"
    //           onClick={this.showAllDisplays.bind(this)}
    //         >
    //           Add Displays
    //         </button>
    //       </div>
    //     </li>
    //   );
    // }

    return (
      <div className={`edit-container `}>
        {/* <div className="edit-header">
          <div className="spacer" />
          <h3>
            Previous {capitalizeFirstLetters(this.props.match.params.board)}{" "}
            Displays
          </h3>
          <div className="edit-close">
            <button
              className="standard-button"
              onClick={this.showAllDisplays.bind(this)}
            >
              More Options
            </button>

            <button
              className="close-edit delete-button"
              onClick={e => this.closeAnimation(boardsAreHidden)}
            >
              Close
            </button>
            <div className="spacer" />
          </div>
        </div> */}

        <div className="edit-content">
          {/* <ul className={`edit-list`} style={listDisplayStyle}>
            {renderAvailableDisplays}
          </ul> */}
          <EditDataDisplayed {...this.props} currentDisplay={currentDisplay} />
        </div>
        {/* <div className="boards-footer">{displayAddNewBoard}</div> */}
      </div>
    );
  }
}

export default EditDisplays;
