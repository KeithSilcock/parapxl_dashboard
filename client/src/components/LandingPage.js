import React from "react";
import { Route } from "react-router-dom";
import db from "../firebase";
import Locations from "./location_components/Locations";
import Boards from "./board_components/Boards";
import EditDisplays from "./display_components/EditDisplays";

import NoLocationSelected from "./NoLocationSelected";
import BoardDisplay from "./board_components/BoardDisplay";

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
        currentDisplay_id: display_id
      });
    });
  }

  selectNewTemplate(currentBoard, templateType, display_id) {
    this.getDisplayTypes(currentBoard);
    this.getDisplayData(templateType, display_id);
  }

  render() {
    const {
      locations,
      currentLocation,
      currentBoard,
      currentDisplay_id,
      currentDisplayData
    } = this.state;

    const currentData = {
      currentLocation,
      currentBoard,
      currentDisplay_id,
      currentDisplayData
    };

    return (
      <div className="landing-page-container">
        <Route
          path={`/admin/home/:location?/:board?`}
          render={props => (
            <Locations
              {...props}
              locations={locations}
              currentData={currentData}
            />
          )}
        />
        <Route
          exact
          path={`/admin/home/`}
          render={props => <NoLocationSelected {...props} />}
        />
        <Route
          path={`/admin/home/:location/:board?`}
          render={props => <Boards {...props} currentData={currentData} />}
        />
        <Route
          path={`/admin/home/:location/:board?`}
          render={props => (
            <BoardDisplay {...props} currentData={currentData} />
          )}
        />
        <Route
          path={`/admin/home/:location/:board/:selected?`}
          render={props => <EditDisplays {...props} />}
        />
      </div>
    );
  }
}

export default DatabaseTest;
