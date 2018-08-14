import React from "react";

class EscapeRoomList extends React.Component {
  moveToEscapeRoom(e, display_id) {
    if (this.props.history) this.props.history.push(`/displays/${display_id}`);
  }

  render() {
    const {
      displayData,
      displayData: { list_of_displays },
      miniBoard
    } = this.props;
    const miniClass = miniBoard ? "-mini" : "";

    if (list_of_displays && list_of_displays !== "<template>") {
      var renderDisplays = list_of_displays.map((data, index) => {
        const bkgImgStyle = {
          backgroundImage: `url(${data.background_img})`
        };
        return (
          <li
            onClick={e => this.moveToEscapeRoom(e, data.display_id)}
            className={`escape-room-list item${miniClass}`}
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
