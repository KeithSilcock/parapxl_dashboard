import React from "react";
import db from "../firebase";
import AddNewDBItem from "./AddNewDBItem";

class Boards extends React.Component {
  createNewLocation(e, newBoardName) {
    e.preventDefault();
    const { currentData } = this.props;

    db.ref(`boards/${currentData.currentLocation}/${newBoardName}`).set(true);
  }

  render() {
    const { boards, getDisplayTypes, currentData } = this.props;
    const listOfBoards = Object.keys(boards).map((item, index) => {
      const selectedClassName =
        currentData.currentBoard === item ? "selectedItem" : "";
      const displays = boards[item];

      return (
        <li
          key={index}
          className={selectedClassName}
          onClick={getDisplayTypes.bind(null, displays, item)}
        >
          {item}
        </li>
      );
    });

    const displayAddNewBoard = currentData.currentLocation ? (
      <AddNewDBItem
        addNewItem={this.createNewLocation.bind(this)}
        newText={"Board"}
      />
    ) : null;

    return (
      <div>
        <h2>Boards Avaiable</h2>
        {displayAddNewBoard}
        <ul>{listOfBoards}</ul>
      </div>
    );
  }
}

export default Boards;
