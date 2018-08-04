import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import AddNewBoard from "./AddNewBoard";
import BoardDisplay from "./BoardDisplay";
import {
  toggleTab2,
  setBoards,
  setDisplay,
  setBoardLocation
} from "../../actions/";
import { capitalizeFirstLetters, getFirstLetters } from "../../helpers";

import "../../assets/boards.css";

class Boards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayWarningModal: false
    };
  }

  componentWillMount() {
    const { currentLocation } = this.props;
    this.getBoardData(currentLocation);
  }

  componentWillReceiveProps(newProps) {
    const { currentLocation, boardLocation } = this.props;
    const { location: newLocation, board: newBoard } = newProps.match.params;

    // if changed location, switch location
    if (currentLocation && currentLocation !== newLocation) {
      this.getBoardData(newLocation);
      return;
    }

    //if change in board
    if (!newBoard || boardLocation !== newBoard) {
      this.getBoardData(newLocation, newBoard);
    }
  }

  getBoardData(location, board) {
    if (!location) {
      return;
    }
    if (!board) {
      const path = `/boards/${location}`;
      db.ref(path).on("value", snapshot => {
        const listOfBoards = snapshot.val();
        const { currentDisplay } = this.props;

        if (listOfBoards !== "no data yet") {
          const firstDisplay = Object.keys(listOfBoards)[0];
          var firstBoard = listOfBoards[firstDisplay];
          this.props.setBoards(listOfBoards);

          if (!Object.keys(currentDisplay).length) {
            this.props.setDisplay(firstBoard);
            this.props.setBoardLocation(firstDisplay);
            this.props.history.push(`/admin/home/${location}/${firstDisplay}`);
          }
        }
      });
    } else {
      const path = `/boards/${location}/${board}`;
      db.ref(path).on("value", snapshot => {
        const thisDisplay = snapshot.val();

        if (thisDisplay !== "no data yet") {
          this.props.setDisplay(thisDisplay);
          this.props.history.push(`/admin/home/${location}/${board}`);
        }
      });
    }
  }

  createNewBoard(e, newBoardName) {
    e.preventDefault();
    const { currentLocation } = this.props;

    this.props.setDisplay("no data yet");
    this.props.setBoardLocation(newBoardName);
    this.props.history.push(`/admin/home/${currentLocation}/${newBoardName}`);

    db.ref(`boards/${currentLocation}/${newBoardName}`).set(
      "no data yet",
      snapshot => {}
    );
  }

  boardSelected(clickedBoard, boardLocation) {
    const { currentLocation } = this.props;

    this.props.setDisplay(clickedBoard);
    this.props.setBoardLocation(boardLocation);
    this.props.history.push(`/admin/home/${currentLocation}/${boardLocation}`);
  }

  openNewWindow(board_id) {
    if (board_id) {
      window.open(`http://localhost:3000/display/${board_id}`);
    } else {
      window.open(`http://localhost:3000/display/no-data`);
    }
  }

  deleteBoard(e) {
    const { currentLocation } = this.props;

    const { boardLocation } = this.props;
    const path = `/boards/${currentLocation}/${boardLocation}`;
    db.ref(path).remove(() => {
      this.props.history.push(`/admin/home/${currentLocation}`);
      this.toggleModal();
    });
  }

  render() {
    const {
      toggleTab2,
      tab2Open,
      activeTabDistance,
      currentBoards,
      boardLocation
    } = this.props;

    if (currentBoards) {
      var listOfBoards = Object.keys(currentBoards).map((item, index) => {
        const selectedClassName = boardLocation === item ? "selectedBoard" : "";

        var boardAbbrev =
          boardLocation !== item && !tab2Open
            ? getFirstLetters(capitalizeFirstLetters(item, true))
            : item;

        if (boardLocation) {
          var selectedContainerName = selectedClassName
            ? "selected-container"
            : "";
        }

        const boardHeight = {
          height: `${boardAbbrev.length / 2 + 1}em`
        };
        if (tab2Open) {
          var tab2ItemHeight = { height: `${item.split(" ").length + 0.5}em` };
        }
        const itemStyle = Object.assign({}, boardHeight, tab2ItemHeight);
        return (
          <li
            style={itemStyle}
            key={index}
            className={`${selectedClassName} board-item`}
            onClick={e => this.boardSelected(currentBoards[item], item)}
          >
            <div className={`board-item-container`}>
              <div className="board grow-container">
                <div className={`board grow-item ${selectedContainerName}`}>
                  {capitalizeFirstLetters(boardAbbrev, true)}
                </div>
              </div>
            </div>
          </li>
        );
      });
    } else {
      var listOfBoards = null;
    }

    //push second nav down towards current location selection
    const pushDownNavStyle = { marginTop: `${activeTabDistance}em` };

    return (
      <div
        onMouseEnter={e => toggleTab2()}
        onMouseLeave={e => toggleTab2()}
        className={`boards-container`}
      >
        <ul style={pushDownNavStyle} className="boards-list">
          {listOfBoards}
        </ul>
        <AddNewBoard
          addNewItem={this.createNewBoard.bind(this)}
          newText={"Board"}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tab2Open: state.navData.tab2Open,
    activeTabDistance: state.navData.activeTabDistance,
    currentLocation: state.data.currentLocation,
    currentBoards: state.data.boards,
    currentDisplay: state.data.display,
    boardLocation: state.data.currentBoardLocation
  };
}

export default connect(
  mapStateToProps,
  { toggleTab2, setBoards, setDisplay, setBoardLocation }
)(Boards);
