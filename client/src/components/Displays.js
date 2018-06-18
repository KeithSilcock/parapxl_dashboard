import React from "react";

class Displays extends React.Component {
  render() {
    const { displays, getDisplayData } = this.props;
    const listOfDisplayTypes = Object.keys(displays).map(
      (displayType, index) => {
        return (
          <li
            key={index}
            onClick={getDisplayData.bind(null, displays[displayType])}
          >
            {displayType}
          </li>
        );
      }
    );

    return (
      <div>
        <h3>Displays</h3>
        <ul>{listOfDisplayTypes}</ul>
      </div>
    );
  }
}

export default Displays;
