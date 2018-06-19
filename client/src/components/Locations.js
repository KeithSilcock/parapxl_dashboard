import React from "react";
import db from "../firebase";
import AddNewDBItem from "./AddNewDBItem";

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
        currentData.currentLocation === item ? "selectedItem" : "";

      return (
        <li
          key={index}
          className={selectedClassName}
          onClick={getAvailableBoards.bind(null, item)}
        >
          {item}
        </li>
      );
    });

    return (
      <div>
        <h1>Locations:</h1>
        <AddNewDBItem
          addNewItem={this.createNewLocation.bind(this)}
          newText={"Location"}
        />
        <ul>{listOfLocations}</ul>
      </div>
    );
  }
}

export default Locations;
