import React from "react";
import db from "../firebase";
import AddNewLocation from "./AddNewLocation";
import "../assets/locations.css";

class Locations extends React.Component {
  createNewLocation(e, newLocationName) {
    e.preventDefault();

    db.ref(`boards/${newLocationName}`).set(true);
    db.ref(`location_list/${newLocationName}`).set(true);
  }

  render() {
    const { locations, getAvailableBoards, currentData } = this.props;

    const listOfLocations = locations.map((item, index) => {
      const selectedClassName =
        currentData.currentLocation === item ? "selectedLocation" : "";

      return (
        <li
          key={index}
          className={`${selectedClassName} location-item`}
          onClick={getAvailableBoards.bind(null, item)}
        >
          {item}
        </li>
      );
    });

    return (
      <div className="locations-container">
        <div className="locations-header">
          <h3>Locations:</h3>
        </div>
        <ul className="locations-list">
          {listOfLocations}
          <li>
            <AddNewLocation
              addNewItem={this.createNewLocation.bind(this)}
              newText={"Location"}
            />
          </li>
        </ul>
      </div>
    );
  }
}

export default Locations;
