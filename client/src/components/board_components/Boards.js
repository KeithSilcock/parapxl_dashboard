import React from "react";
import db from "../../firebase";
import AddNewBoard from "./AddNewBoard";
import BoardDisplay from "./BoardDisplay";
import { capitalizeFirstLetters } from "../../helpers";
import WarningModal from "../WarningModal";

import "../../assets/animations/openEditBoard.css";
import "../../assets/boards.css";

class Boards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocation: "",
      clickedBoard: "",
      availableBoards: {},
      displayWarningModal: false
    };
  }

  createNewBoard(e, newBoardName) {
    e.preventDefault();
    const { location } = this.props.match.params;
    const { boardsAreHidden, timedAnimation } = this.props;

    db.ref(`boards/${location}/${newBoardName}`).set(true, snapshot => {
      timedAnimation(
        boardsAreHidden,
        true,
        `/admin/home/${location}/${newBoardName}`
      );
      // this.props.history.push(`/admin/home/${location}/${newBoardName}`);
    });
  }
  componentWillMount() {
    const { location, board } = this.props.match.params;
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
    if (board) {
      timedAnimation(boardsAreHidden, true);
    } else {
      timedAnimation(!boardsAreHidden);
    }
  }
  componentWillReceiveProps(newProps) {
    const { currentLocation } = this.state;
    const { location, board } = newProps.match.params;
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
    this.props.history.push(`/admin/home/${currentLocation}/${board}`);
  }

  openNewWindow(board_id) {
    this.props;
    debugger;
    window.open(`http://localhost:3000/display/${board_id}`);
  }

  toggleModal() {
    const { displayWarningModal } = this.state;

    this.setState({
      ...this.state,
      displayWarningModal: !displayWarningModal
    });
  }

  deleteBoard(e) {
    const { location } = this.props.match.params;
    const { clickedBoard } = this.state;
    const path = `/boards/${location}/${clickedBoard}`;
    db.ref(path).remove(() => {
      this.toggleModal();
    });
  }

  render() {
    const {
      currentData,
      boardsAreHidden,
      boardsAreTransitioning,
      timedAnimation
    } = this.props;
    const { availableBoards, clickedBoard, displayWarningModal } = this.state;
    const { location } = this.props.match.params;

    const warningModal = displayWarningModal ? (
      <WarningModal
        header={clickedBoard}
        cancel={this.toggleModal.bind(this)}
        confirm={this.deleteBoard.bind(this)}
      />
    ) : null;

    if (availableBoards) {
      var listOfBoards = Object.keys(availableBoards).map((item, index) => {
        const selectedClassName = clickedBoard === item ? "selectedBoard" : "";

        const renderBoardDisplay =
          typeof availableBoards[item] === "object" ? (
            <BoardDisplay thisBoard={availableBoards[item]} />
          ) : null;

        return (
          <li
            key={index}
            className={`${selectedClassName} board-item`}
            onClick={e => this.boardSelected(item)}
          >
            <div className={`board-type ${item}`}>
              <span>{capitalizeFirstLetters(item, true)}</span>
            </div>
            <div className="board-type-preview">{renderBoardDisplay}</div>
            <div className="board-type buttons">
              <div className="board-type top-buttons">
                <div className="board-type open-button">
                  <button
                    className="standard-button"
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
                    className="standard-button"
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
              <div className="board-type bottom-buttons">
                <button
                  onClick={e => {
                    e.stopPropagation();
                    //opens modal and sets item for delete
                    //ran into propigation issue where running
                    //two setState functions didn't work
                    this.setState({
                      ...this.state,
                      clickedBoard: item,
                      displayWarningModal: !displayWarningModal
                    });
                  }}
                  className="board-type delete-button"
                >
                  Delete
                </button>
              </div>
            </div>
          </li>
        );
      });
    } else {
      var listOfBoards = null;
    }

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
          {warningModal}
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
