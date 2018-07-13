import React from "react";
import db from "../../firebase";
import TextBoard from "../DisplayComponents/TextBoard";
import EscapeRoom from "../DisplayComponents/EscapeRoom";
import EscapeRoomList from "../DisplayComponents/EscapeRoomList";
import EscapeRoomCarousel from "../DisplayComponents/EscapeRoomCarousel";

import "../../assets/displayComponents.css";

class BoardDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayData: null
    };
  }
  componentWillMount() {
    const { thisBoard } = this.props;

    try {
      var path = `/displays/${thisBoard.current_display.display_id}`;
    } catch (err) {
      if (err.constructor === TypeError) {
        path = `/displays/${thisBoard.display_id}`;
      } else {
        throw err;
      }
    }
    db.ref(path).on("value", snapshot => {
      const displayData = snapshot.val();

      this.setState({
        ...this.state,
        displayData
      });
    });
  }

  componentWillReceiveProps() {
    const { thisBoard } = this.props;
    try {
      var path = `/displays/${thisBoard.current_display.display_id}`;
    } catch (err) {
      if (err.constructor === TypeError) {
        path = `/displays/${thisBoard.display_id}`;
      } else {
        throw err;
      }
    }
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

    const display = thisBoard.current_display
      ? thisBoard.current_display.type
      : thisBoard.type;

    var toRender = null;
    if (displayData) {
      switch (display) {
        case "escape-room":
          toRender = <EscapeRoom displayData={displayData} />;
          break;
        case "text-board":
          toRender = <TextBoard displayData={displayData} />;
          break;
        case "escape-room-list":
          toRender = <EscapeRoomList displayData={displayData} />;
          break;
        case "carousel":
          toRender = <EscapeRoomCarousel displayData={displayData} />;
          break;
        default:
          toRender = null;
          break;
      }
    }

    return <div className="display-preview">{toRender}</div>;
  }
}

export default BoardDisplay;
