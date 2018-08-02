import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import AddNewBoard from "./AddNewBoard";
import BoardDisplay from "./BoardDisplay";
import { toggleTab2, setBoard } from "../../actions/";
import { capitalizeFirstLetters, getFirstLetters } from "../../helpers";
import WarningModal from "../EasyModal";

// import "../../assets/animations/openEditBoard.css";
import "../../assets/boards.css";

class Boards extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentLocation: "",
      clickedBoard: "",
      availableBoards: {},
      currentBoard: {},
      displayWarningModal: false
    };
  }

  componentWillMount() {
    const { location, board } = this.props.match.params;
    const { timedAnimation, boardsAreHidden } = this.props;

    if (board) {
      const path = `/boards/${location}/${board}/current_display`;
      db.ref(path).on("value", snapshot => {
        const currentDisplay = snapshot.val();
        this.setState({
          ...this.state,
          currentLocation: location,
          currentBoard: currentDisplay
        });
      });
    } else {
      const path = `/boards/${location}`;
      db.ref(path).on("value", snapshot => {
        const listOfBoards = snapshot.val();

        if (listOfBoards !== "no data yet") {
          const firstBoard = listOfBoards[Object.keys(listOfBoards)[0]];
          this.boardSelected(firstBoard, Object.keys(listOfBoards)[0]);
        }

        // this.setState({
        //   ...this.state,
        //   currentLocation: location,
        //   currentBoard: firstBoard.current_display,
        //   clickedBoard: Object.keys(listOfBoards)[0]
        // });
      });
    }
  }
  componentWillReceiveProps(newProps) {
    const { currentLocation, availableBoards } = this.state;
    const { location, board } = newProps.match.params;

    if (!board) {
      const path = `/boards/${location}`;
      db.ref(path).on("value", snapshot => {
        const listOfBoards = snapshot.val();

        const firstBoard = listOfBoards[Object.keys(listOfBoards)[0]];
        if (firstBoard && listOfBoards !== "no data yet")
          this.boardSelected(firstBoard, Object.keys(listOfBoards)[0]);
      });
    }

    //if changed location, switch location
    if (!currentLocation || currentLocation !== location) {
      const path = `/boards/${location}`;
      db.ref(path).on("value", snapshot => {
        const listOfBoards = snapshot.val();
        if (listOfBoards !== "no data yet") {
          this.setState({
            ...this.state,
            currentLocation: location,
            availableBoards: listOfBoards,
            clickedBoard: ""
          });
        }
      });
    }
  }

  createNewBoard(e, newBoardName) {
    e.preventDefault();
    const { location } = this.props.match.params;
    const { boardsAreHidden, timedAnimation } = this.props;

    db.ref(`boards/${location}/${newBoardName}`).set(
      "no data yet",
      snapshot => {
        // timedAnimation(
        //   boardsAreHidden,
        //   true,
        //   `/admin/home/${location}/${newBoardName}`
        // );
        // this.props.history.push(`/admin/home/${location}/${newBoardName}`);
      }
    );
  }

  boardSelected(clickedBoard, boardLocation) {
    const { location } = this.props.match.params;

    this.setState(
      {
        ...this.state,
        clickedBoard: boardLocation
      },
      () => {
        this.props.setBoard(clickedBoard);
        this.props.history.push(`/admin/home/${location}/${boardLocation}`);
      }
    );
  }

  openNewWindow(board_id) {
    if (board_id) {
      window.open(`http://localhost:3000/display/${board_id}`);
    } else {
      window.open(`http://localhost:3000/display/no-data`);
    }
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
    const { toggleTab2, tab2Open, activeTabDistance } = this.props;
    const { board } = this.props.match.params;

    if (availableBoards) {
      var listOfBoards = Object.keys(availableBoards).map((item, index) => {
        const selectedClassName = clickedBoard === item ? "selectedBoard" : "";
        var boardAbbrev =
          board !== item && !tab2Open
            ? getFirstLetters(capitalizeFirstLetters(item, true))
            : item;

        if (board) {
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
            onClick={e => this.boardSelected(availableBoards[item], item)}
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
    activeTabDistance: state.navData.activeTabDistance
  };
}

export default connect(
  mapStateToProps,
  { toggleTab2, setBoard }
)(Boards);
