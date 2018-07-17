import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Carousel } from "react-responsive-carousel";
import RenderDisplayComponent from "../RenderDisplayComponent";
import { formatToMiliSeconds } from "../../helpers";

import db from "../../firebase";

class EscapeRoomCarousel extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displays: {}
    };
  }

  componentDidMount() {
    const path = `/displays/`;
    db.ref(path).on("value", snapshot => {
      const displays = snapshot.val();

      this.setState({
        ...this.state,
        displays
      });
    });
  }

  render() {
    const {
      displayData,
      displayData: { list_of_displays }
    } = this.props;

    const interval = displayData.interval ? displayData.interval : 2;

    const { displays } = this.state;
    if (typeof displayData.carousel_displays === "object") {
      var renderDisplays = displayData.carousel_displays.map(
        (display, index) => {
          if (Object.keys(displays).indexOf(display.display_id) >= 0) {
            return (
              <RenderDisplayComponent
                key={index}
                currentDisplayData={display}
              />
            );
          }
        }
      );
    }

    return (
      <Carousel
        className="carousel container"
        infiniteLoop={true}
        showThumbs={false}
        showArrows={false}
        showStatus={false}
        autoPlay={true}
        interval={formatToMiliSeconds(interval)}
        transitionTime={350}
        stopOnHover={false}
      >
        {renderDisplays}
      </Carousel>
    );
  }
}

export default EscapeRoomCarousel;
