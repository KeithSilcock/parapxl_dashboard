import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import AddNewBoard from "./AddNewBoard";
import BoardDisplay from "./BoardDisplay";
import { toggleTab2, setBoardForLocation, getData } from "../../actions/";
import { capitalizeFirstLetters, getFirstLetters } from "../../helpers";

import "../../assets/boards.css";

class Boards extends React.Component {
  componentWillReceiveProps(nextProps, nextState) {
    const { locations, boards } = nextProps;
    const { locations: prevLocs, boards: prevBoards } = this.props;
    const { location, board } = this.props.match.params;
    const { location: newLocation, board: newBoard } = nextProps.match.params;

    if (locations.length) {
      //if new location:
      if (
        prevLocs.length !== locations.length &&
        prevLocs.length &&
        locations.length
      ) {
        const newestLocation = locations.filter(item => {
          return prevLocs.indexOf(item) < 0;
        });
        this.props.history.push(`/admin/home/${newestLocation}`);
        this.props.setBoardForLocation();
        return;
      }

      // if changed location, switch location
      if (location && location !== newLocation) {
        //set first board for changed location
        this.props.history.push(`/admin/home/${newLocation}/${boards[0]}`);
        return;
      }

      if (!board && boards.length) {
        this.props.history.push(`/admin/home/${newLocation}/${boards[0]}`);
      }
    }
  }

  createNewBoard(e, newBoardName) {
    e.preventDefault();

    const { location } = this.props.match.params;
    db.ref(`boards/${location}/${newBoardName}`).set(
      "no data yet",
      snapshot => {
        this.props.getData();
        this.props.setBoardForLocation(location);
        this.props.history.push(`/admin/home/${location}/${newBoardName}`);
      }
    );
  }

  boardSelected(clickedBoard, boardLocation) {
    const { location } = this.props.match.params;

    this.props.history.push(`/admin/home/${location}/${boardLocation}`);
  }

  openNewWindow(board_id) {
    if (board_id) {
      window.open(`http://localhost:3000/display/${board_id}`);
    } else {
      window.open(`http://localhost:3000/display/no-data`);
    }
  }

  deleteBoard(e) {
    const { location, board } = this.props.match.params;

    const path = `/boards/${location}/${board}`;
    db.ref(path).remove(() => {
      this.props.history.push(`/admin/home/${location}`);
      this.toggleModal();
    });
  }

  render() {
    const { toggleTab2, tab2Open, activeTabDistance, boards } = this.props;
    const { location, board } = this.props.match.params;

    if (boards.length) {
      var listOfBoards = boards.map((item, index) => {
        const selectedClassName = board === item ? "selectedBoard" : "";

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
            onClick={e => this.boardSelected(boards[item], item)}
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
    locations: state.data.locations,
    boards: state.data.boards,
    tab2Open: state.navData.tab2Open,
    activeTabDistance: state.navData.activeTabDistance
  };
}

export default connect(
  mapStateToProps,
  { toggleTab2, setBoardForLocation, getData }
)(Boards);
