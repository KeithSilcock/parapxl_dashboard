import React, { Component } from "react";
import { Route } from "react-router-dom";
import "../assets/App.css";
import DatabaseTest from "./DatabaseTest";
import BoringRoute from "./boringComponent";
import BoringRoute2 from "./anotherBoringComponent";
import Nav from "./Nav";
import Locations from "./Locations";
import DataDisplayNewTab from "./DataDsiplayNewTab";

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
    const { buttonState } = this.state;
    const buttonText = buttonState ? "true" : "false";
    const path = buttonState ? "/test" : "/test2";

    return (
      <div className="App">
        <Route exact path="/admin" component={Nav} />
        <Route path="/admin" component={DatabaseTest} />
        <Route path={path} component={BoringRoute} />
        <Route path="/test2" component={BoringRoute2} />
        <Route path="/display/*" component={DataDisplayNewTab} />
        <button onClick={this.clickButton.bind(this)}>{buttonText}</button>
      </div>
    );
  }
}

export default App;
