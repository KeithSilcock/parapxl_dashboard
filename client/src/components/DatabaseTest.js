import React from "react";
import { Route } from "react-router-dom";
import db from "../firebase";
import Locations from "./Locations";
import Boards from "./Boards";
import Displays from "./Displays";
import DataDisplayAdmin from "./DataDisplayAdmin";

class DatabaseTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      views: [],
      displays: [],
      currentDisplayData: {},
      currentDisplay_id: ""
    };
  }

  //make sure to clear appropriate state components when changing location/boards/displays

  componentWillMount() {
    this.getAllLocations();
  }

  componentWillUnmount() {
    this.setState({
      locations: [],
      views: [],
      displays: [],
      currentDisplayData: {},
      currentDisplay_id: ""
    });
  }

  getAllLocations() {
    const path = "/location_list";
    db.ref(path).on("value", snapshot => {
      const listOfLocations = Object.keys(snapshot.val());

      this.setState({
        ...this.state,
        locations: listOfLocations,
        views: [],
        displays: [],
        currentDisplayData: {},
        currentDisplay_id: ""
      });
    });
  }

  getAvailableBoards(location) {
    const path = `/boards/${location}`;
    const stuff = this.state;
    db.ref(path).on("value", snapshot => {
      const listOfViews = snapshot.val();

      this.setState({
        ...this.state,
        views: listOfViews,
        displays: [],
        currentDisplayData: {},
        currentDisplay_id: ""
      });
    });
  }

  getDisplayTypes(displays) {
    this.setState({
      ...this.state,
      displays: displays,
      currentDisplayData: {},
      currentDisplay_id: ""
    });
  }

  getDisplayData(display_id) {
    const path = `/displays/${display_id}`;
    db.ref(path).on("value", snapshot => {
      const currentDisplayData = snapshot.val();

      this.setState({
        ...this.state,
        currentDisplayData,
        currentDisplay_id: display_id
      });
    });
  }

  onDisplayDataChange(event) {
    const { currentDisplayData } = this.state;
    const { name, value } = event.currentTarget;

    const newData = { ...currentDisplayData, [name]: value };

    this.setState({
      ...this.state,
      currentDisplayData: newData
    });
  }

  updateDisplays(e) {
    e.preventDefault();
    const { currentDisplay_id, currentDisplayData } = this.state;

    const path = `/displays/${currentDisplay_id}/`;
    db.ref(path).set({ ...currentDisplayData });
  }

  openNewWindow(e) {
    const { currentDisplay_id } = this.state;
    window.open(`http://localhost:3000/display/${currentDisplay_id}`);
  }

  render() {
    const { locations, views, displays, currentDisplayData } = this.state;

    return (
      <div>
        <Locations
          locations={locations}
          getAvailableBoards={this.getAvailableBoards.bind(this)}
        />

        <Boards
          views={views}
          getDisplayTypes={this.getDisplayTypes.bind(this)}
        />

        <Displays
          displays={displays}
          getDisplayData={this.getDisplayData.bind(this)}
        />

        <DataDisplayAdmin
          currentDisplayData={currentDisplayData}
          onDisplayDataChange={this.onDisplayDataChange.bind(this)}
          updateDisplays={this.updateDisplays.bind(this)}
        />

        <button onClick={this.openNewWindow.bind(this)}>
          Open this display in New Window
        </button>
      </div>
    );
  }
}

export default DatabaseTest;
