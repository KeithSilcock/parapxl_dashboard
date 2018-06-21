import React from "react";
import db from "../firebase";
import AddNewBoard from "./AddNewBoard";
import BoardDisplay from "./BoardDisplay";
import { capitalizeFirstLetters } from "../helpers";

import "../assets/boards.css";

class Boards extends React.Component {
  createNewBoard(e, newBoardName) {
    e.preventDefault();
    const { currentData } = this.props;

    db.ref(`boards/${currentData.currentLocation}/${newBoardName}`).set(true);
  }

  render() {
    const { boards, getDisplayTypes, currentData } = this.props;

    const listOfBoards = Object.keys(boards).map((item, index) => {
      const selectedClassName =
        currentData.currentBoard === item ? "selectedItem" : "";

      return (
        <li
          key={index}
          className={`${selectedClassName} board-item`}
          onClick={getDisplayTypes.bind(null, item)}
        >
          <div className={`board-type ${item}`}>
            <span>{capitalizeFirstLetters(item, true)}</span>
          </div>
          <div className="board-type-preview">
            <BoardDisplay
              currentData={currentData}
              currentBoard={item}
              thisBoard={boards[item]}
            />
          </div>
        </li>
      );
    });

    const displayAddNewBoard = currentData.currentLocation ? (
      <AddNewBoard
        addNewItem={this.createNewBoard.bind(this)}
        newText={"Board"}
      />
    ) : null;
    const displayAddNewBoardText = currentData.currentLocation ? (
      <li className="board-item">
        <div className="board-type new-display">
          <span>Create New Board</span>
        </div>
        <div className="board-type-preview">
          <div className="display-preview">{displayAddNewBoard}</div>
        </div>
      </li>
    ) : null;

    return (
      <div className="boards-container">
        <div className="boards-content">
          <ul className="boards-list">
            {listOfBoards}
            {displayAddNewBoardText}
          </ul>
        </div>
        {/* <div className="boards-footer">{displayAddNewBoard}</div> */}
      </div>
    );
  }
}

export default Boards;
