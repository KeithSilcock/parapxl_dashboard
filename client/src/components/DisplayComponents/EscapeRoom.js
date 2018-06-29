import React from "react";
import ReactPlayer from "react-player";

export default props => {
  const { displayData } = props;

  const bkgImgStyle = {
    backgroundImage: `url(${displayData.background_img})`
  };

  return (
    <div className="board-preview escape-room container" style={bkgImgStyle}>
      <div className="escape-room text-content">
        <h2 className="escape-room title">{displayData.title}</h2>
        <h4 className="escape-room subtitle">{displayData.subtitle}</h4>
        {/* <div className="escape-room image">
      <img src="" alt=""/>
      </div> */}
      </div>
      <div className="escape-room video-box">
        <div className="escape-room video">
          <ReactPlayer width="100" height="100" url={displayData.video} />
        </div>
      </div>
    </div>
  );
};
