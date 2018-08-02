import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import AddNewLocation from "./AddNewLocation";
import { toggleTab1, setTabDistanceDownNav, setLocation } from "../../actions/";
import { capitalizeFirstLetters, getFirstLetters } from "../../helpers";
import Logo from "../Logo";

import "../../assets/locations.css";

class Locations extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { location, board } = nextProps.match.params;
    const { locations, tab1Open, tab2Open, setTabDistanceDownNav } = nextProps;

    let stopReduce = false;
    // set height manually due to logo and 50px margin on tab1
    let start = tab1Open ? 9.75 : 5.125;
    if (board && !tab2Open) {
      start = start / 2;
    }
    const distanceDownNav = locations.reduce((acc, item, index) => {
      var locAbbrev = getFirstLetters(capitalizeFirstLetters(item, true));

      if (location === item && index === 0 && tab1Open) {
        stopReduce = true;
        return acc + locAbbrev.length - 1;
      }
      if (location === item) {
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
      db.ref(`location_list/${newLocationName}`).set(true);
    }
  }

  moveToBoardsRoute(location) {
    this.props.setLocation(location);
    this.props.history.push(`/admin/home/${location}`);
  }

  render() {
    const { locations, tab1Open, tab2Open, toggleTab1 } = this.props;
    const { location } = this.props.match.params;

    const listOfLocations = locations.map((item, index) => {
      var locAbbrev =
        location !== item && !tab1Open
          ? getFirstLetters(capitalizeFirstLetters(item, true))
          : item;

      if (location) {
        var selectedClassName = location === item ? "selectedLocation" : "";
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
    tab2Open: state.navData.tab2Open
  };
}

export default connect(
  mapStateToProps,
  { toggleTab1, setTabDistanceDownNav, setLocation }
)(Locations);
