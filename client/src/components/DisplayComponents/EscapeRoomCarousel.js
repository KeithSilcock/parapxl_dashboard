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
      displays: {},
      canRotate: true
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

  didPlayVideo() {
    const { canRotate } = this.state;
    this.setState({
      ...this.state,
      canRotate: !canRotate
    });
  }

  render() {
    const { canRotate } = this.state;
    const { displayData } = this.props;

    const interval = displayData.interval ? displayData.interval : 2;

    const { displays } = this.state;
    if (typeof displayData.carousel_displays === "object") {
      var renderDisplays = displayData.carousel_displays.map(
        (display, index) => {
          if (Object.keys(displays).indexOf(display.display_id) >= 0) {
            return (
              <RenderDisplayComponent
                didPlayVideo={this.didPlayVideo.bind(this)}
                key={index}
                currentDisplayData={display}
              />
            );
          } else {
            return null;
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
        // autoPlay={canRotate}
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
