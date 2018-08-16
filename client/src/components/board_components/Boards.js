import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import AddNewBoard from "./AddNewBoard";
import {
  toggleTab2,
  setBoardsForLocation,
  getData,
  clearModalInput
} from "../../actions/";
import { capitalizeFirstLetters, getFirstLetters } from "../../helpers";

import "../../assets/boards.css";

class Boards extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { locations, boards, dbData } = nextProps;
    const { locations: prevLocs } = this.props;
    const { location, board } = this.props.match.params;
    const { location: newLocation } = nextProps.match.params;

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
        this.props.setBoardsForLocation(newestLocation);
        return;
      }

      // if changed location, switch location
      if (location && location !== newLocation) {
        //set first board for changed location
        if (boards.length) {
          this.props.history.push(`/admin/home/${newLocation}/${boards[0]}`);
        } else {
          this.props.history.push(`/admin/home/${newLocation}`);
        }
        return;
      }

      if (!board && boards.length && dbData[newLocation] !== "no data yet") {
        this.props.history.push(`/admin/home/${newLocation}/${boards[0]}`);
      }
    }
  }

  createNewBoard(e) {
    if (e) e.preventDefault();
    const { newBoardName } = this.props;

    const { location } = this.props.match.params;
    db.ref(`boards/${location}/${newBoardName}`).set(
      "no data yet",
      snapshot => {
        this.props.getData();
        this.props.setBoardsForLocation(location);
        this.props.history.push(`/admin/home/${location}/${newBoardName}`);
        this.props.clearModalInput();
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
    const {
      toggleTab2,
      tab2Open,
      activeTabDistance,
      boards,
      dbData
    } = this.props;
    const { location, board } = this.props.match.params;

    if (
      boards.length &&
      dbData[location] !== "no data yet" //&&
      // typeof dbData[location][board] !== "undefined"
    ) {
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
      listOfBoards = null;
    }

    //push second nav down towards current location selection
    const pushDownNavStyle = { marginTop: `${activeTabDistance}em` };

    return (
      <div
        onMouseEnter={e => {
          toggleTab2();
        }}
        onMouseLeave={e => {
          toggleTab2();
        }}
        className={`boards-container`}
      >
        {/* {backButton} */}
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
    dbData: state.data.dbData,
    locations: state.data.locations,
    boards: state.data.boards,
    tab2Open: state.navData.tab2Open,
    activeTabDistance: state.navData.activeTabDistance,
    newBoardName: state.data.modalInputValue
  };
}

export default connect(
  mapStateToProps,
  { toggleTab2, setBoardsForLocation, getData, clearModalInput }
)(Boards);
