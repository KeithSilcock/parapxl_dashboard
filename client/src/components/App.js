import React, { Component } from "react";
import { Route } from "react-router-dom";
import "../assets/App.css";
import LandingPage from "./LandingPage";
import Nav from "./Nav";
import DataDisplayNewTab from "./DataDsiplayNewTab";
import NewDisplayModal from "./NewDisplayModal";

//TODO Finish adding animation for "EditDisplays"

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      buttonState: false
    };
  }

  clickButton() {
    const { buttonState } = this.state;

    this.setState({
      ...this.state,
      buttonState: !buttonState
    });
  }

  render() {
    const { buttonState, openModal, modalData } = this.state;

    // const modal = openModal ? (

    // ) : null;

    return (
      <div className="App">
        <link
          href="https://fonts.googleapis.com/css?family=Karla"
          rel="stylesheet"
        />
        <Route
          path="/admin/:location/:board/add-new/:new_type"
          render={props => <NewDisplayModal {...props} />}
        />
        <Route path="/admin" component={Nav} />
        <Route path="/admin" render={props => <LandingPage {...props} />} />
        <Route path="/display/*" component={DataDisplayNewTab} />
      </div>
    );
  }
}

export default App;
