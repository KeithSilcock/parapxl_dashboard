import React from "react";
import { Route } from "react-router-dom";
import db from "../firebase";
import Locations from "./location_components/Locations";
import Boards from "./board_components/Boards";
import EditDisplays from "./display_components/EditDisplays";

import "../assets/landing_page.css";
import NoLocationSelected from "./NoLocationSelected";

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

  timedAnimation(slidingDown, instant = false, pushTo = null) {
    const { location } = this.props.match.params;
    if (instant) {
      this.setState({
        ...this.state,
        boardsAreHidden: !slidingDown,
        boardsAreTransitioning: { up: false, down: false }
      });
      if (pushTo) {
        this.props.history.push(pushTo);
      }
      return;
    }

    this.setState({
      ...this.state,
      boardsAreHidden: slidingDown,
      boardsAreTransitioning: { up: !slidingDown, down: slidingDown }
    });
    setTimeout(() => {
      if (pushTo) {
        this.props.history.push(pushTo);
      }
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
      currentLocation,
      currentBoard,
      currentDisplay_id,
      currentDisplayData,

      boardsAreHidden,
      boardsAreTransitioning
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
          path={`/admin/home/:location?`}
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
          exact
          path={`/admin/home/`}
          render={props => <NoLocationSelected {...props} />}
        />
        <Route
          path={`/admin/home/:location/:board?`}
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
          path={`/admin/home/:location/:board/:selected?`}
          render={props => (
            <EditDisplays
              {...props}
              timedAnimation={this.timedAnimation.bind(this)}
              boardsAreHidden={boardsAreHidden}
              boardsAreTransitioning={boardsAreTransitioning}
            />
          )}
        />
      </div>
    );
  }
}

export default DatabaseTest;
