import React from "react";
import { Route } from "react-router-dom";
import db from "../firebase";
import Locations from "./Locations";
import Boards from "./Boards";
import EditDisplays from "./EditDisplays";

import "../assets/landing_page.css";

class DatabaseTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      currentLocation: "",
      boards: [],
      currentBoard: "",
      displays: [],
      currentDisplayType: "",
      currentDisplay_id: "",
      currentDisplayData: {},

      boardsAreTransitioning: { up: false, down: false },
      boardsAreHidden: false
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

  selectNewTemplate(currentBoard, templateType, display_id) {
    this.getDisplayTypes(currentBoard);
    this.getDisplayData(templateType, display_id);
  }

  timedAnimation(slidingDown) {
    this.setState({
      ...this.state,
      boardsAreHidden: slidingDown,
      boardsAreTransitioning: { up: !slidingDown, down: slidingDown }
    });

    setTimeout(() => {
      this.setState({
        ...this.state,
        boardsAreHidden: !slidingDown,
        boardsAreTransitioning: { up: false, down: false }
      });
    }, 990);
  }

  render() {
    const {
      locations,
      boards,
      displays,
      currentLocation,
      currentBoard,
      currentDisplayType,
      currentDisplay_id,
      currentDisplayData,

      boardsAreHidden,
      boardsAreTransitioning
    } = this.state;

    const currentData = {
      currentLocation,
      currentBoard,
      currentDisplayType,
      currentDisplay_id,
      currentDisplayData
    };

    return (
      <div className="landing-page-container">
        <Route
          path="/admin/home"
          render={props => (
            <Locations
              {...props}
              locations={locations}
              timedAnimation={this.timedAnimation.bind(this)}
              boardsAreHidden={boardsAreHidden}
              currentData={currentData}
            />
          )}
        />
        <Route
          path={`/admin/home/:location`}
          render={props => (
            <Boards
              {...props}
              currentData={currentData}
              timedAnimation={this.timedAnimation.bind(this)}
              boardsAreHidden={boardsAreHidden}
              boardsAreTransitioning={boardsAreTransitioning}
            />
          )}
        />
        <Route
          path={`/admin/home/:location/:board`}
          render={props => (
            <EditDisplays
              {...props}
              boards={boards}
              currentData={currentData}
              timedAnimation={this.timedAnimation.bind(this)}
              boardsAreHidden={boardsAreHidden}
              boardsAreTransitioning={boardsAreTransitioning}
            />
          )}
        />
        {/* <Displays
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
        /> */}
      </div>
    );
  }
}

export default DatabaseTest;
