import React from "react";

class EscapeRoomList extends React.Component {
  selectedEscapeRoom(e, data) {
    this.props;

    if (this.props.match) {
      if (this.props.match.params.display_id) {
        this.props.history.push(`/display/${data.display_id}`);
        return;
      }
    }
  }

  render() {
    const {
      displayData,
      displayData: { list_of_displays }
    } = this.props;

    if (list_of_displays && list_of_displays !== "<template>") {
      var renderDisplays = list_of_displays.map((data, index) => {
        const bkgImgStyle = {
          backgroundImage: `url(${data.background_img})`
        };
        return (
          <li
            onClick={e => this.selectedEscapeRoom(e, data)}
            className="escape-room-list item"
            key={index}
          >
            <div className="container" style={bkgImgStyle}>
              <div className="escape-room-list hover-cover">
                <h2 className="title">{data.title}</h2>
                {/* <h4 className="escape-room subtitle">{data.subtitle}</h4> */}
              </div>
            </div>
          </li>
        );
      });
    }
    var bkgImgStyle = {
      backgroundImage: `url(${displayData.background_img})`,
      backgroundSize: "cover"
    };

    return (
      <div
        className="board-preview escape-room-list container"
        style={bkgImgStyle}
      >
        <div className="escape-room-list text-content">
          <h4 className="escape-room-list title">{displayData.title}</h4>
        </div>
        <div className="escape-room-list board-displays">
          <ul className="escape-room-list list">{renderDisplays}</ul>
        </div>
      </div>
    );
  }
}
export default EscapeRoomList;
