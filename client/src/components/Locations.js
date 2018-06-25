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

  moveToBoardsRoute(location) {
    this.props.history.push(`/admin/${location}`);
  }

  render() {
    const { locations } = this.props;
    const location = this.props.location.pathname.replace("/admin/", "");

    const listOfLocations = locations.map((item, index) => {
      const selectedClassName = location === item ? "selectedLocation" : "";

      return (
        <li
          key={index}
          className={`${selectedClassName} location-item`}
          onClick={e => {
            this.moveToBoardsRoute(item);
          }}
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
