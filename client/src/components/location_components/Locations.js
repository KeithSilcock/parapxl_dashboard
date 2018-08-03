import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import AddNewLocation from "./AddNewLocation";
import {
  toggleTab1,
  setTabDistanceDownNav,
  setCurrentLocation,
  setBoardLocation,
  setBoards
} from "../../actions/";
import { capitalizeFirstLetters, getFirstLetters } from "../../helpers";
import Logo from "../Logo";

import "../../assets/locations.css";

class Locations extends React.Component {
  componentWillMount() {
    const { location, board } = this.props.match.params;
    if (location) {
      this.props.setCurrentLocation(location);
    }
    if (board) {
      this.props.setBoardLocation(board);
    }
    this.getTabDistance(this.props);
  }

  componentWillReceiveProps(nextProps) {
    const {
      locations,
      tab1Open: tab1OpenNew,
      tab2Open: tab2OpenNew
    } = nextProps;
    const { tab1Open: tab1OpenOld, tab2Open: tab2OpenOld } = this.props;

    if (
      (locations.length && tab1OpenNew !== tab1OpenOld) ||
      tab2OpenNew !== tab2OpenOld
    ) {
      this.getTabDistance(nextProps);
    }
  }

  getTabDistance(props) {
    const {
      locations,
      tab1Open,
      tab2Open,
      setTabDistanceDownNav,
      boardLocation,
      currentLocation
    } = props;
    let stopReduce = false;

    // set height manually due to logo and 50px margin on tab1
    let start = tab1Open ? 9.75 : 5.125;
    if (boardLocation && !tab2Open) {
      start = start / 2;
    }
    const distanceDownNav = locations.reduce((acc, item, index) => {
      var locAbbrev = getFirstLetters(capitalizeFirstLetters(item, true));

      if (currentLocation === item && index === 0 && tab1Open) {
        stopReduce = true;
        return acc + locAbbrev.length - 1;
      }
      if (currentLocation === item) {
        stopReduce = true;
        return acc + locAbbrev.length + 1;
      }
      if (stopReduce) {
        return acc;
      }
      return acc + locAbbrev.length + 1;
    }, start);

    setTabDistanceDownNav(distanceDownNav);
  }

  createNewLocation(e, newLocationName) {
    if (e) e.preventDefault();

    if (newLocationName !== "") {
      db.ref(`boards/${newLocationName}`).set("no data yet");
      db.ref(`location_list/${newLocationName}`).set(true, () => {
        this.props.setBoardLocation("");
        this.props.setBoards([]);
        this.moveToBoardsRoute(newLocationName);
      });
    }
  }

  moveToBoardsRoute(location) {
    this.props.setCurrentLocation(location);
    this.props.history.push(`/admin/home/${location}`);
  }

  render() {
    const {
      locations,
      tab1Open,
      tab2Open,
      toggleTab1,
      currentLocation
    } = this.props;

    if (locations.length) {
      var listOfLocations = locations.map((item, index) => {
        var locAbbrev =
          currentLocation !== item && !tab1Open
            ? getFirstLetters(capitalizeFirstLetters(item, true))
            : item;

        if (currentLocation) {
          var selectedClassName =
            currentLocation === item ? "selectedLocation" : "";
          var selectedContainerName = selectedClassName
            ? "selected-container"
            : "";
        }

        const locationHeight = {
          height: `${locAbbrev.length / 2 + 1}em`
        };
        if (tab1Open) {
          var tabItemHeight = { height: `${item.split(" ").length + 0.5}em` };
        }
        const itemStyle = Object.assign({}, locationHeight, tabItemHeight);

        return (
          <li
            style={itemStyle}
            key={index}
            className={`${selectedClassName} location-item`}
            onClick={e => {
              this.moveToBoardsRoute(item);
            }}
          >
            <div className={`location-item-container ${selectedContainerName}`}>
              <div className="location grow-container">
                <div className={`location grow-item ${selectedContainerName}`}>
                  {locAbbrev}
                </div>
              </div>
            </div>
          </li>
        );
      });
    }

    return (
      <div
        onMouseEnter={e => toggleTab1()}
        onMouseLeave={e => toggleTab1()}
        className={`locations-container`}
      >
        <Logo />
        <ul className="locations-list">{listOfLocations}</ul>
        <AddNewLocation
          addNewItem={this.createNewLocation.bind(this)}
          newText={"Location"}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tab1Open: state.navData.tab1Open,
    tab2Open: state.navData.tab2Open,
    locations: state.data.locations,
    currentLocation: state.data.currentLocation,
    boardLocation: state.data.currentBoardLocation
  };
}

export default connect(
  mapStateToProps,
  {
    toggleTab1,
    setTabDistanceDownNav,
    setCurrentLocation,
    setBoardLocation,
    setBoards
  }
)(Locations);
