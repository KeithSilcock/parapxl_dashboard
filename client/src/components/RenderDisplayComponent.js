import React from "react";
import TextBoard from "./DisplayComponents/TextBoard";
import EscapeRoom from "./DisplayComponents/EscapeRoom";
import EscapeRoomList from "./DisplayComponents/EscapeRoomList";

class RenderDisplayComponent extends React.Component {
  render() {
    const { currentDisplayData } = this.props;
    var toRender = null;
    switch (currentDisplayData.type) {
      case "escape-room":
        toRender = <EscapeRoom displayData={currentDisplayData} />;
        break;
      case "text-board":
        toRender = <TextBoard displayData={currentDisplayData} />;
        break;
      case "escape-room-list":
        toRender = <EscapeRoomList displayData={currentDisplayData} />;
        break;

      default:
        toRender = null;
        break;
    }
    return toRender;
  }
}

export default RenderDisplayComponent;