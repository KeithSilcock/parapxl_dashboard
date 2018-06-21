import React from "react";
import db from "../firebase";
import TextBoard from "./DisplayComponents/TextBoard";
import EscapeRoom from "./DisplayComponents/EscapeRoom";

import "../assets/displayComponents.css";

class BoardDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayData: {}
    };
  }

  componentWillMount() {
    const { thisBoard } = this.props;

    const path = `/displays/${thisBoard.current_display.display_id}`;
    db.ref(path).on("value", snapshot => {
      const displayData = snapshot.val();

      this.setState({
        ...this.state,
        displayData
      });
    });
  }

  render() {
    const { displayData } = this.state;
    const { thisBoard } = this.props;
    var toRender = null;
    switch (thisBoard.current_display.type) {
      case "escape-room":
        toRender = <EscapeRoom displayData={displayData} />;
        break;
      case "text-board":
        toRender = <TextBoard displayData={displayData} />;
        break;
      default:
        toRender = null;
        break;
    }
    return <div className="display-preview">{toRender}</div>;
  }
}

export default BoardDisplay;
