import React from "react";
import db from "../firebase";
import AddNewBoard from "./AddNewBoard";
import BoardDisplay from "./BoardDisplay";
import { capitalizeFirstLetters } from "../helpers";

import "../assets/animations/openEditPage.css";
import "../assets/boards.css";

class Boards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocation: "",
      clickedBoard: "",
      availableBoards: {}
    };
  }

  createNewBoard(e, newBoardName) {
    e.preventDefault();
    const { location } = this.props.match.params;

    db.ref(`boards/${location}/${newBoardName}`).set(true);
  }
  componentWillMount() {
    const { location } = this.props.match.params;
    const { timedAnimation, boardsAreHidden } = this.props;
    const path = `/boards/${location}`;
    db.ref(path).on("value", snapshot => {
      const listOfBoards = snapshot.val();

      this.setState({
        ...this.state,
        currentLocation: location,
        availableBoards: listOfBoards
      });
    });
    timedAnimation(!boardsAreHidden);
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

  boardSelected(clickedBoard) {
    this.setState({
      ...this.state,
      clickedBoard
    });
  }

  openEditPage(e, board) {
    const { currentLocation } = this.state;
    this.props.history.push(`/admin/${currentLocation}/${board}`);
  }

  openNewWindow(board_id) {
    window.open(`http://localhost:3000/display/${board_id}`);
  }

  render() {
    const {
      currentData,
      boardsAreHidden,
      boardsAreTransitioning,
      timedAnimation
    } = this.props;
    const { availableBoards, clickedBoard } = this.state;
    const { location } = this.props.match.params;

    const listOfBoards = Object.keys(availableBoards).map((item, index) => {
      const selectedClassName = clickedBoard === item ? "selectedBoard" : "";

      return (
        <li
          key={index}
          className={`${selectedClassName} board-item`}
          onClick={e => this.boardSelected(item)}
        >
          <div className={`board-type ${item}`}>
            <span>{capitalizeFirstLetters(item, true)}</span>
          </div>
          <div className="board-type-preview">
            <BoardDisplay thisBoard={availableBoards[item]} />
          </div>
          <div className="board-type buttons">
            <div className="board-type open-button">
              <button
                onClick={e =>
                  setTimeout(() => {
                    this.openNewWindow(
                      availableBoards[item].current_display.display_id
                    ),
                      300;
                  })
                }
              >
                Open in New Window
              </button>
            </div>
            <div className="board-type edit-button">
              <button
                onClick={e => {
                  // e.stopPropagation();
                  setTimeout(() => {
                    timedAnimation(boardsAreHidden);
                    this.openEditPage(e, item);
                  }, 300);
                }}
              >
                Edit
              </button>
            </div>
          </div>
        </li>
      );
    });

    if (boardsAreTransitioning) {
      var animationClassUpStart = boardsAreTransitioning.up
        ? "board-slide-up-start"
        : "";
      var animationClassDownStart = boardsAreTransitioning.down
        ? "board-slide-down-start"
        : "";
    }

    const displayAddNewBoard = location ? (
      <AddNewBoard
        addNewItem={this.createNewBoard.bind(this)}
        newText={"Board"}
      />
    ) : null;
    const displayAddNewBoardText = location ? (
      <li className="board-item">
        <div className="board-type new-board-display">
          <span>Create New Board</span>
        </div>
        <div className="board-type-preview new-board">
          <div className="display-preview">{displayAddNewBoard}</div>
        </div>
      </li>
    ) : null;

    const animationClassUpEnd =
      !boardsAreHidden ||
      boardsAreTransitioning.down ||
      boardsAreTransitioning.up ? (
        <div
          className={`boards-container ${animationClassUpStart ||
            animationClassDownStart}`}
        >
          <div className="boards-content">
            <ul className="boards-list">
              {listOfBoards}
              {displayAddNewBoardText}
            </ul>
          </div>
          {/* <div className="boards-footer">{displayAddNewBoard}</div> */}
        </div>
      ) : null;

    return animationClassUpEnd;
  }
}

export default Boards;
