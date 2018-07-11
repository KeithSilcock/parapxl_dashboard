import React from "react";

export default props => {
  const {
    displayData,
    displayData: { list_of_displays }
  } = props;

  if (list_of_displays && list_of_displays !== "<template>") {
    var renderDisplays = list_of_displays.map((displayData, index) => {
      var bkgImgStyle = {
        backgroundImage: `url(${displayData.background_img})`
      };
      return (
        <li className="escape-room-list item" key={index}>
          <div className="container" style={bkgImgStyle}>
            <div className="escape-room-list hover-cover">
              <h2 className="title">{displayData.title}</h2>
              {/* <h4 className="escape-room subtitle">{displayData.subtitle}</h4> */}
            </div>
          </div>
        </li>
      );
    });
  } else {
    return null;
  }

  return (
    <div className="board-preview escape-room-list container">
      <div className="escape-room-list text-content">
        <h4 className="escape-room-list subtitle">{displayData.subtitle}</h4>
      </div>
      <div className="escape-room-list board-displays">
        <ul className="escape-room-list list">{renderDisplays}</ul>
      </div>
    </div>
  );
};
