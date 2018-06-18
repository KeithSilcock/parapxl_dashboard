import React from "react";
import db from "../firebase";

class Locations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openInput: false,
      newLocation: ""
    };
  }

  toggleNewLocation() {
    const { openInput } = this.state;
    this.setState({
      openInput: !openInput
    });
  }

  handleInput(event) {
    const { name, value } = event.currentTarget;

    this.setState({
      ...this.state,
      [name]: value
    });
  }
  createNewLocation(e) {
    e.preventDefault();

    const { newLocation } = this.state;

    const newLocData = {
      [newLocation]: {
        views: {
          data: null
        }
      }
    };

    db.ref("locations/").set(newLocData);
  }

  render() {
    const { openInput, newLocation } = this.state;
    const { locations, getAvailableBoards } = this.props;

    const addLocForm = openInput ? (
      <form onSubmit={this.createNewLocation.bind(this)}>
        <input
          type="text"
          name="newLocation"
          onChange={this.handleInput.bind(this)}
          value={newLocation}
        />
      </form>
    ) : null;

    const listOfLocations = locations.map((item, index) => {
      return (
        <li key={index} onClick={getAvailableBoards.bind(null, item)}>
          {item}
        </li>
      );
    });

    return (
      <div>
        <h1>Locations:</h1>
        <button onClick={this.toggleNewLocation.bind(this)}>
          New Location
        </button>
        {addLocForm}
        <ul>{listOfLocations}</ul>
      </div>
    );
  }
}

export default Locations;
