import React from "react";
import db from "../firebase";

class DataDisplayNewTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDisplayData: {}
    };
  }

  componentWillMount() {
    const display_id = this.props.match.params["0"];
    const path = `/displays/${display_id}`;
    const testDispRef = db.ref(path);

    testDispRef.on("value", snapshot => {
      const currentDisplayData = snapshot.val();
      this.setState({
        ...this.state,
        currentDisplayData
      });
    });
  }

  render() {
    const { currentDisplayData } = this.state;

    const currentDisplayKeys = Object.keys(currentDisplayData);
    const displayItems = currentDisplayKeys.map((key, index) => {
      return (
        <li key={index}>
          {key}: {currentDisplayData[key]}
        </li>
      );
    });
    return (
      <div>
        <h4>Display Data: {currentDisplayData["type"] || null}</h4>
        <ul>{displayItems}</ul>
      </div>
    );
  }
}

export default DataDisplayNewTab;
