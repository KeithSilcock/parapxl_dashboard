import React from "react";
import { Link } from "react-router-dom";

class Nav extends React.Component {
  render() {
    return (
      <div>
        <h1>Nav Bar</h1>
        <Link to="/">To Home</Link>
        <Link to="/test">To boring</Link>
        <Link to="/test2">To boring 2</Link>
      </div>
    );
  }
}

export default Nav;
