import React, { Component } from "react";
import { Route } from "react-router-dom";
import { connect } from "react-redux";
import { setMobileView } from "../actions";
import "../assets/App.css";
import LandingPage from "./LandingPage";
import DataDisplayNewTab from "./DataDsiplayNewTab";
import TemplatePage from "./template_components/TemplatePage";
import EscapeRoomCarousel from "./DisplayComponents/EscapeRoomCarousel";
import TempAuth from "./TempAuth";
import WarningModal from "./EasyModal";

import "../assets/mediaQueries.css";

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonState: false
    };
  }
  componentDidMount() {
    document.title = "BrainyActz Dashboard";
    const mq = window.matchMedia("(max-width: 500px)");
    if (mq.matches) {
      //is phone or smaller
      this.props.setMobileView();
    }
  }

  clickButton() {
    const { buttonState } = this.state;

    this.setState({
      ...this.state,
      buttonState: !buttonState
    });
  }

  render() {
    return (
      <div className="App">
        <link
          href="https://fonts.googleapis.com/css?family=Karla"
          rel="stylesheet"
        />
        <link
          rel="stylesheet"
          href="https://use.fontawesome.com/releases/v5.2.0/css/all.css"
          integrity="sha384-hWVjflwFxL6sNzntih27bfxkr27PmbbK/iSvJ+a4+0owXq79v+lsFkW54bOGbiDQ"
          crossOrigin="anonymous"
        />
        <WarningModal />
        <Route exact path="/" render={props => <TempAuth {...props} />} />
        <Route
          path="/admin/home/:location?/:board?"
          render={props => <LandingPage {...props} />}
        />
        <Route
          exact
          path={`/admin/:location/:board/create-new/:new_type`}
          render={props => <TemplatePage {...props} />}
        />
        <Route
          path={`/displays/:display_id?`}
          render={props => <DataDisplayNewTab {...props} />}
        />
        <Route
          path={`/display/:location/:board/`}
          render={props => <DataDisplayNewTab {...props} />}
        />
        <Route
          path={`/carousel`}
          render={props => <EscapeRoomCarousel {...props} />}
        />
      </div>
    );
  }
}

function mSTP(state) {
  return state;
}
export default connect(
  mSTP,
  { setMobileView }
)(App);
