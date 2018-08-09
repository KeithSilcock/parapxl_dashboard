import React from "react";
import TextBoard from "./DisplayComponents/TextBoard";
import EscapeRoom from "./DisplayComponents/EscapeRoom";
import EscapeRoomList from "./DisplayComponents/EscapeRoomList";
import EscapeRoomCarousel from "./DisplayComponents/EscapeRoomCarousel";

class RenderDisplayComponent extends React.Component {
  render() {
    const { currentDisplayData } = this.props;
    var toRender = null;
    if (currentDisplayData)
      switch (currentDisplayData.type) {
        case "escape-room":
          toRender = (
            <EscapeRoom {...this.props} displayData={currentDisplayData} />
          );
          break;
        case "text-board":
          toRender = <TextBoard displayData={currentDisplayData} />;
          break;
        case "escape-room-list":
          toRender = (
            <EscapeRoomList {...this.props} displayData={currentDisplayData} />
          );
          break;
        case "carousel":
          toRender = <EscapeRoomCarousel displayData={currentDisplayData} />;
          break;

        default:
          toRender = null;
          break;
      }
    return toRender;
  }
}

export default RenderDisplayComponent;
