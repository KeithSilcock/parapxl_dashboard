import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";
import DatabaseTest from "./databaseTest";

class App extends Component {
  render() {
    return (
      <div className="App">
        <DatabaseTest />
      </div>
    );
  }
}

export default App;
