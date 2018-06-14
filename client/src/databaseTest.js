import React from "react";
import db from "./firebase";

class DatabaseTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      views: [],
      displays: []
    };

    this.getAllLocations();
  }

  getAllLocations() {
    const path = "/location_list";
    const testLocListRef = db.ref(path);

    testLocListRef.on("value", snapshot => {
      const listOfLocations = Object.keys(snapshot.val());

      this.setState({
        ...this.state,
        locations: listOfLocations
      });
    });
  }

  getAvailableBoards(location) {
    const path = `/locations/${location}/views`;
    const testLocRef = db.ref(path);

    testLocRef.on("value", snapshot => {
      const listOfViews = snapshot.val();

      this.setState({
        ...this.state,
        views: listOfViews
      });
    });
  }

  getDisplayedData(displays) {
    const path = `/displays`;
    const testDispRef = db.ref("path");

    const displayTypes = [];

    for (const display_id in displays) {
      displayTypes.push(displays[display_id].type);
      debugger;
    }
  }

  render() {
    // testDispRef.on("value", snapshot => {
    //   console.log(snapshot.val());
    // });

    //

    //get the name of the location you want to view
    //
    const { locations, views } = this.state;
    const listOfLocations = locations.map((item, index) => {
      return (
        <li key={index} onClick={this.getAvailableBoards.bind(this, item)}>
          {item}
        </li>
      );
    });

    const listOfBoards = Object.keys(views).map((item, index) => {
      console.log(views[item]);
      const displays = views[item].displays;

      return (
        <li key={index} onClick={this.getDisplayedData.bind(this, displays)}>
          {item} x
        </li>
      );
    });

    const listOfDisplays = null;

    return (
      <div>
        <h1>Locations:</h1>
        <ul>{listOfLocations}</ul>

        <h1>Boards Avaiable</h1>
        <ul>{listOfBoards}</ul>

        <h1>Displays</h1>
        <ul>{listOfDisplays}</ul>
      </div>
    );
  }
}

export default DatabaseTest;
