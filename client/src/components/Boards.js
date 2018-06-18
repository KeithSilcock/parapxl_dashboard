import React from "react";

class Boards extends React.Component {
  render() {
    const { views, getDisplayTypes } = this.props;
    const listOfBoards = Object.keys(views).map((item, index) => {
      const displays = views[item];

      return (
        <li key={index} onClick={getDisplayTypes.bind(null, displays)}>
          {item}
        </li>
      );
    });

    return (
      <div>
        <h2>Boards Avaiable</h2>
        <ul>{listOfBoards}</ul>
      </div>
    );
  }
}

export default Boards;
