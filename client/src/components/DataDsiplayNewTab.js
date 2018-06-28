import React from "react";
import db from "../firebase";
import TextBoard from "./DisplayComponents/TextBoard";
import EscapeRoom from "./DisplayComponents/EscapeRoom";

import "../assets/newTabDisplay.css";

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

    var toRender = null;
    switch (currentDisplayData.type) {
      case "escape-room":
        toRender = <EscapeRoom displayData={currentDisplayData} />;
        break;
      case "text-board":
        toRender = <TextBoard displayData={currentDisplayData} />;
        break;
      default:
        toRender = null;
        break;
    }
    return <div className="new-tab">{toRender}</div>;
  }
}

export default DataDisplayNewTab;
