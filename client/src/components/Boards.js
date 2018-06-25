import React from "react";
import db from "../firebase";
import AddNewBoard from "./AddNewBoard";
import BoardDisplay from "./BoardDisplay";
import { capitalizeFirstLetters } from "../helpers";

import "../assets/boards.css";

class Boards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocation: "",
      availableBoards: {},
      boardsAreTransitioning: { up: false, down: false },
      boardsAreHidden: false
    };
  }

  createNewBoard(e, newBoardName) {
    e.preventDefault();
    const { location } = this.props.match.params;

    db.ref(`boards/${location}/${newBoardName}`).set(true);
  }
  componentWillMount() {
    const { location } = this.props.match.params;
    const { boardsAreHidden } = this.state;
    const path = `/boards/${location}`;
    db.ref(path).on("value", snapshot => {
      const listOfBoards = snapshot.val();

      this.setState({
        ...this.state,
        currentLocation: location,
        availableBoards: listOfBoards
      });
    });
    this.timedAnimation(!boardsAreHidden);
  }
  componentWillReceiveProps(newProps) {
    const { currentLocation } = this.state;
    const { location } = newProps.match.params;
    if (currentLocation !== location) {
      const path = `/boards/${location}`;
      db.ref(path).on("value", snapshot => {
        const listOfBoards = snapshot.val();

        this.setState({
          ...this.state,
          currentLocation: location,
          availableBoards: listOfBoards
        });
      });
    }
  }

  openEditPage(e, board) {
    const { boardsAreHidden } = this.state;

    this.timedAnimation(boardsAreHidden);
  }

  timedAnimation(slidingDown) {
    this.setState({
      ...this.state,
      boardsAreTransitioning: { up: !slidingDown, down: slidingDown }
    });

    const {
      boardsAreTransitioning: { up, down }
    } = this.state;

    setTimeout(() => {
      this.setState({
        ...this.state,
        boardsAreHidden: !slidingDown,
        boardsAreTransitioning: { up: false, down: false }
      });
    }, 1000);
  }

  render() {
    const { getDisplayTypes, currentData } = this.props;
    const {
      availableBoards,
      boardsAreHidden,
      boardsAreTransitioning
    } = this.state;
    const { location } = this.props.match.params;

    const listOfBoards = Object.keys(availableBoards).map((item, index) => {
      const selectedClassName =
        currentData.currentBoard === item ? "selectedBoard" : "";

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
            <BoardDisplay thisBoard={availableBoards[item]} />
          </div>
          <div className="board-type button">
            <button onClick={e => this.openEditPage(e, item)}>Edit</button>
          </div>
        </li>
      );
    });

    const animationClassUpStart = boardsAreTransitioning.up
      ? "board-slide-up-start"
      : "";
    const animationClassDownStart = boardsAreTransitioning.down
      ? "board-slide-down-start"
      : "";

    const animationClassUpEnd = boardsAreHidden
      ? "board-slide-up-end"
      : "board-slide-down-end";

    const displayAddNewBoard = location ? (
      <AddNewBoard
        addNewItem={this.createNewBoard.bind(this)}
        newText={"Board"}
      />
    ) : null;
    const displayAddNewBoardText = location ? (
      <li className="board-item">
        <div className="board-type new-display">
          <span>Create New Board</span>
        </div>
        <div className="board-type-preview new-board">
          <div className="display-preview">{displayAddNewBoard}</div>
        </div>
      </li>
    ) : null;

    return (
      <div
        className={`boards-container ${animationClassUpStart ||
          animationClassDownStart} ${animationClassUpEnd}`}
      >
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
