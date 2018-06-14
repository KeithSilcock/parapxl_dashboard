import React from "react";
import db from "./firebase";

class DatabaseTest extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      locations: [],
      views: [],
      displays: [],
      currentDisplay: {}
    };

    this.getAllLocations();
  }

  getAllLocations() {
    const path = "/location_list";
    const testLocListRef = db.ref(path);

    testLocListRef.on("value", snapshot => {
      const listOfLocations = Object.keys(snapshot.val());

      this.setState({
        ...this.state,
        locations: listOfLocations
      });
    });
  }

  getAvailableBoards(location) {
    const path = `/locations/${location}/views`;
    const testLocRef = db.ref(path);

    testLocRef.on("value", snapshot => {
      const listOfViews = snapshot.val();

      this.setState({
        ...this.state,
        views: listOfViews
      });
    });
  }

  getDisplayTypes(displays) {
    const displayArray = [];

    for (const display_id in displays) {
      displayArray.push(displays[display_id]);
    }

    this.setState({
      ...this.state,
      displays: displayArray
    });
  }

  getDisplayData(display_id) {
    const path = `/displays/${display_id}`;
    const testDispRef = db.ref(path);

    testDispRef.on("value", snapshot => {
      const currentDisplay = snapshot.val();
      this.setState({
        ...this.state,
        currentDisplay
      });
    });
  }

  render() {
    const { locations, views, displays, currentDisplay } = this.state;

    const listOfLocations = locations.map((item, index) => {
      return (
        <li key={index} onClick={this.getAvailableBoards.bind(this, item)}>
          {item}
        </li>
      );
    });

    const listOfBoards = Object.keys(views).map((item, index) => {
      console.log(views[item]);
      const displays = views[item].displays;

      return (
        <li key={index} onClick={this.getDisplayTypes.bind(this, displays)}>
          {item}
        </li>
      );
    });

    const listOfDisplayTypes = displays.map((item, index) => {
      return (
        <li
          key={index}
          onClick={this.getDisplayData.bind(this, item.display_id)}
        >
          {item.type}
        </li>
      );
    });

    function formatCurrentData() {
      const { content, subtitle, title } = currentDisplay;

      if (currentDisplay.content)
        return (
          <ul>
            <li>
              <h5>Title: {title}</h5>
            </li>
            <li>
              <h6> Subtitle: {subtitle}</h6>
            </li>
            <li>Content: {content}</li>
          </ul>
        );
    }

    return (
      <div>
        <h1>Locations:</h1>
        <ul>{listOfLocations}</ul>

        <h2>Boards Avaiable</h2>
        <ul>{listOfBoards}</ul>

        <h3>Displays</h3>
        <ul>{listOfDisplayTypes}</ul>

        <h4>Display Data</h4>
        {formatCurrentData()}
      </div>
    );
  }
}

export default DatabaseTest;
