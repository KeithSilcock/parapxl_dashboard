import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import AddNewBoard from "./AddNewBoard";
import BoardDisplay from "./BoardDisplay";
import { toggleTab2 } from "../../actions/";
import { capitalizeFirstLetters } from "../../helpers";
import WarningModal from "../WarningModal";

// import "../../assets/animations/openEditBoard.css";
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
          availableBoards: listOfBoards,
          clickedBoard: ""
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
    if (board_id) {
      window.open(`http://localhost:3000/display/${board_id}`);
    } else {
      window.open(`http://localhost:3000/display/no-data`);
    }
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
      this.props.history.push(`/admin/home/${location}`);
      this.toggleModal();
    });
  }

  render() {
    const { availableBoards, clickedBoard, displayWarningModal } = this.state;
    const { toggleTab2, tab2Open } = this.props;
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

        return (
          <li
            key={index}
            className={`${selectedClassName} board-item`}
            onClick={e => this.boardSelected(item)}
          >
            <div className={`board-item-container`}>
              {capitalizeFirstLetters(item, true)}
            </div>
          </li>
        );
      });
    } else {
      var listOfBoards = null;
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

    return (
      <div
        onMouseEnter={e => toggleTab2()}
        onMouseLeave={e => toggleTab2()}
        className={`boards-container`}
      >
        {warningModal}
        <div className="boards-content">
          <ul className="boards-list">
            {listOfBoards}
            {displayAddNewBoardText}
          </ul>
        </div>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tab2Open: state.navData.tab2Open
  };
}

export default connect(
  mapStateToProps,
  { toggleTab2 }
)(Boards);
