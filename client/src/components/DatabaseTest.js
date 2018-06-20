import React from "react";
import { Route } from "react-router-dom";
import db from "../firebase";
import Locations from "./Locations";
import Boards from "./Boards";
import Displays from "./Displays";
import DataDisplayAdmin from "./DataDisplayAdmin";

import "../assets/style.css";

class DatabaseTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      currentLocation: "",
      boards: [],
      currentBoard: "",
      displays: [],
      currentDisplay_id: "",
      currentDisplayData: {}
    };
  }

  // TODO
  // make sure to clear appropriate state components when changing location/boards/displays
  // double click to edit anything
  // remove currentDisplayType from state

  componentWillMount() {
    this.getAllLocations();
  }

  componentWillUnmount() {
    this.setState({
      locations: [],
      boards: [],
      displays: [],
      currentDisplayType: "",
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
        currentLocation: "",
        boards: [],
        currentBoard: "",
        displays: [],
        currentDisplayType: "",
        currentDisplay_id: "",
        currentDisplayData: {}
      });
    });
  }

  getAvailableBoards(location) {
    const path = `/boards/${location}`;
    db.ref(path).on("value", snapshot => {
      const listOfBoards = snapshot.val();

      this.setState({
        ...this.state,
        currentLocation: location,
        boards: listOfBoards,
        currentBoard: "",
        displays: [],
        currentDisplayType: "",
        currentDisplay_id: "",
        currentDisplayData: {}
      });
    });
  }

  getDisplayTypes(clickedBoard) {
    const { currentLocation } = this.state;
    const path = `/boards/${currentLocation}/${clickedBoard}`;
    db.ref(path).on("value", snapshot => {
      const listOfDisplays = snapshot.val();

      this.setState({
        ...this.state,
        currentBoard: clickedBoard,
        displays: listOfDisplays,
        currentDisplayType: "",
        currentDisplay_id: "",
        currentDisplayData: {}
      });
    });
  }

  getDisplayData(displayType, display_id) {
    const path = `/displays/${displayType}/${display_id}`;
    db.ref(path).on("value", snapshot => {
      const currentDisplayData = snapshot.val();

      this.setState({
        ...this.state,
        currentDisplayData,
        currentDisplayType: displayType,
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

  selectNewTemplate(currentBoard, templateType, display_id) {
    this.getDisplayTypes(currentBoard);
    this.getDisplayData(templateType, display_id);
  }

  updateDisplays(e) {
    e.preventDefault();
    const {
      currentDisplayType,
      currentDisplayData,
      currentDisplay_id
    } = this.state;

    const path = `/displays/${currentDisplayType}/${currentDisplay_id}/`;
    db.ref(path).set({ ...currentDisplayData });
  }

  openNewWindow(e) {
    const { currentDisplay_id } = this.state;
    window.open(`http://localhost:3000/display/${currentDisplay_id}`);
  }

  render() {
    const { toggleModal } = this.props;
    const {
      locations,
      boards,
      displays,
      currentLocation,
      currentBoard,
      currentDisplayType,
      currentDisplay_id,
      currentDisplayData
    } = this.state;

    const currentData = {
      currentLocation,
      currentBoard,
      currentDisplayType,
      currentDisplay_id,
      currentDisplayData
    };

    return (
      <div>
        <Locations
          locations={locations}
          currentData={currentData}
          getAvailableBoards={this.getAvailableBoards.bind(this)}
        />

        <Boards
          boards={boards}
          currentData={currentData}
          getDisplayTypes={this.getDisplayTypes.bind(this)}
        />

        <Displays
          displays={displays}
          currentData={currentData}
          toggleModal={toggleModal}
          selectNewTemplate={this.selectNewTemplate.bind(this)}
          getDisplayData={this.getDisplayData.bind(this)}
        />

        <DataDisplayAdmin
          currentData={currentData}
          currentDisplay_id={currentDisplay_id}
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
