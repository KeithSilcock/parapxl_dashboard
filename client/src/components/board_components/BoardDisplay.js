import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import { setDisplayData } from "../../actions";
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
      currentDisplayData: {}
    };
  }
  componentWillReceiveProps(nextProps) {
    if (!this.props.miniBoard) {
      const { location, board } = nextProps.match.params;
      const { dbData, currentDisplayData } = nextProps;
      const prevBoard = this.props.match.params.board;
      const currentDisplay = dbData[location][board];

      if (!board) {
        this.setState({
          ...this.state,
          displayData: {}
        });
        return;
      }
      if (prevBoard !== board) {
        this.getDisplayData(currentDisplay);
      }

      if (
        !Object.keys(currentDisplayData).length &&
        Object.keys(currentDisplay).length
      ) {
        this.props.setDisplayData({ alive: true });
        this.getDisplayData(currentDisplay);
      }
    }
  }

  getDisplayData(display) {
    if (display !== "no data yet") {
      var path = `/displays/${display.current_display.display_id}`;
      db.ref(path).on("value", snapshot => {
        const activeDisplay = snapshot.val();

        this.props.setDisplayData(activeDisplay);
        this.setState({
          ...this.state,
          displayData: display
        });
      });
    } else {
      this.props.setDisplayData(display);
    }
  }

  showAllDisplays() {
    const { location, board } = this.props.match.params;

    this.props.history.push(`/admin/home/${location}/${board}/add-new/display`);
  }

  render() {
    if (!this.props.miniBoard) {
      var { currentDisplayData } = this.props;
    } else {
      currentDisplayData = this.props.displayData;
    }

    var toRender = null;
    if (currentDisplayData) {
      switch (currentDisplayData.type) {
        case "escape-room":
          toRender = <EscapeRoom displayData={currentDisplayData} />;
          break;
        case "text-board":
          toRender = <TextBoard displayData={currentDisplayData} />;
          break;
        case "escape-room-list":
          toRender = (
            <EscapeRoomList
              displayData={currentDisplayData}
              miniBoard={this.props.miniBoard}
            />
          );
          break;
        case "carousel":
          toRender = <EscapeRoomCarousel displayData={currentDisplayData} />;
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
    dbData: state.data.dbData,
    boards: state.data.boards,
    currentDisplayData: state.data.currentDisplayData
  };
}

export default connect(
  mapStateToProps,
  { setDisplayData }
)(BoardDisplay);
