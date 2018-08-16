import React from "react";
import { connect } from "react-redux";
import { Route } from "react-router-dom";
import db from "../firebase";
import { getData } from "../actions";
import Locations from "./location_components/Locations";
import Boards from "./board_components/Boards";
import EditDataDisplayed from "./display_components/EditDataDisplayed";
import AllDisplays from "./display_components/AllDisplays";

import NoLocationSelected from "./NoLocationSelected";
import NoBoardSelected from "./NoBoardSelected";
import BoardDisplay from "./board_components/BoardDisplay";

class DatabaseTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      currentDisplay_id: "",
      currentDisplayData: {}
    };
  }

  componentWillMount() {
    this.props.getData();
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
    return (
      <div className="landing-page-container">
        <Route path={`/admin/home/:location?/:board?`} component={Locations} />
        <Route path={`/admin/home/:location/:board?`} component={Boards} />
        <Route
          exact
          path="/admin/home/:location/:board/add-new/display"
          render={props => <AllDisplays {...props} />}
        />
        <Route
          exact
          path={`/admin/home/:location/:board`}
          component={BoardDisplay}
        />
        <Route
          exact
          path={`/admin/home/:location/:board/:selected?`}
          component={EditDataDisplayed}
        />

        <Route
          exact
          path={`/admin/home/:location`}
          component={NoBoardSelected}
        />
        <Route exact path={`/admin/home/`} component={NoLocationSelected} />
      </div>
    );
  }
}

function mSTP(state) {
  return state;
}

export default connect(
  mSTP,
  { getData }
)(DatabaseTest);
