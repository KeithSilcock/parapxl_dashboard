import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import {} from "../../actions";
import TextBoard from "../DisplayComponents/TextBoard";
import EscapeRoom from "../DisplayComponents/EscapeRoom";
import EscapeRoomList from "../DisplayComponents/EscapeRoomList";
import EscapeRoomCarousel from "../DisplayComponents/EscapeRoomCarousel";

import "../../assets/displayComponents.css";

class BoardDisplay extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      displayData: {},
      activeDisplay: {}
    };
  }
  componentWillMount() {
    const { currentLocation, boardLocation } = this.props;

    if (boardLocation) {
      // var path1 = `/boards/${currentLocation}/${boardLocation}`;
      // db.ref(path1).on("value", snapshot => {
      //   const displayData = snapshot.val();
      //   if (displayData && displayData !== "no data yet") {
      //     var path2 = `/displays/${displayData.current_display.display_id}`;
      //     db.ref(path2).on("value", snapshot => {
      //       const activeDisplay = snapshot.val();
      //       this.setState({
      //         ...this.state,
      //         displayData,
      //         activeDisplay
      //       });
      //     });
      //   }
      // });
    }
  }

  componentWillReceiveProps(nextProps) {
    const { location, board } = nextProps.match.params;
    const { currentDisplay } = nextProps;
    const prevBoard = this.props.boardLocation;
    const { activeDisplay } = this.state;

    if (!board) {
      this.setState({
        ...this.state,
        displayData: {},
        activeDisplay: {}
      });
      return;
    }

    if (prevBoard !== board && Object.keys(currentDisplay).length) {
      this.getDisplayData(currentDisplay);
    }
    if (
      !Object.keys(activeDisplay).length &&
      Object.keys(currentDisplay).length
    ) {
      this.setState(
        {
          ...this.state,
          activeDisplay: { alive: true }
        },
        () => {
          this.getDisplayData(currentDisplay);
        }
      );
    }
  }

  getDisplayData(display) {
    if (display !== "no data yet") {
      var path = `/displays/${display.current_display.display_id}`;
      db.ref(path).on("value", snapshot => {
        const activeDisplay = snapshot.val();

        this.setState({
          ...this.state,
          displayData: display,
          activeDisplay
        });
      });
    } else {
      this.setState({
        ...this.state,
        activeDisplay: display
      });
    }
  }

  showAllDisplays() {
    const { currentLocation, boardLocation } = this.props;

    this.props.history.push(
      `/admin/home/${currentLocation}/${boardLocation}/add-new/display`
    );
  }

  render() {
    const { activeDisplay } = this.state;

    var toRender = null;
    if (activeDisplay && activeDisplay !== "no data yet") {
      switch (activeDisplay.type) {
        case "escape-room":
          toRender = <EscapeRoom displayData={activeDisplay} />;
          break;
        case "text-board":
          toRender = <TextBoard displayData={activeDisplay} />;
          break;
        case "escape-room-list":
          toRender = <EscapeRoomList displayData={activeDisplay} />;
          break;
        case "carousel":
          toRender = <EscapeRoomCarousel displayData={activeDisplay} />;
          break;
        default:
          toRender = (
            <div className="no-board-selected">
              <h1>No Boards Available</h1>
              <p>
                Please select <span className="bold">More Options</span> below
                to add a display!
              </p>
              <button
                type="button"
                onClick={e => {
                  this.showAllDisplays();
                }}
                className="new standard-button"
              >
                More Options
              </button>
            </div>
          );
          break;
      }
    }

    return <div className="display-preview">{toRender}</div>;
  }
}

function mapStateToProps(state) {
  return {
    currentLocation: state.data.currentLocation,
    currentBoards: state.data.boards,
    currentDisplay: state.data.display,
    boardLocation: state.data.currentBoardLocation
  };
}

export default connect(
  mapStateToProps,
  {}
)(BoardDisplay);
