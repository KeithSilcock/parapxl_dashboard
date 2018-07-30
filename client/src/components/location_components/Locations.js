import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import AddNewLocation from "./AddNewLocation";
import { toggleTab1 } from "../../actions/";
import { capitalizeFirstLetters, getFirstLetters } from "../../helpers";

import "../../assets/locations.css";

class Locations extends React.Component {
  createNewLocation(e, newLocationName) {
    e.preventDefault();

    db.ref(`boards/${newLocationName}`).set(true);
    db.ref(`location_list/${newLocationName}`).set(true);
  }

  moveToBoardsRoute(location) {
    this.props.history.push(`/admin/home/${location}`);
  }

  render() {
    const {
      locations,
      timedAnimation,
      boardsAreHidden,
      tab1Open,
      toggleTab1
    } = this.props;
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
      const locationWidth = {
        // width: `${locAbbrev.length / 2 + 1}em`
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
            if (boardsAreHidden) {
              timedAnimation(boardsAreHidden);
            }
          }}
        >
          <div className={`location-item-container ${selectedContainerName}`}>
            <div className="location grow-container">
              <div
                style={locationWidth}
                className={`location grow-item ${selectedContainerName}`}
              >
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
        <ul className="locations-list">
          {listOfLocations}

          <AddNewLocation
            addNewItem={this.createNewLocation.bind(this)}
            newText={"Location"}
          />
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    tab1Open: state.navData.tab1Open
  };
}

export default connect(
  mapStateToProps,
  { toggleTab1 }
)(Locations);
