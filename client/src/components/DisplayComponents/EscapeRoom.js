import React from "react";

export default props => {
  const { displayData } = props;

  const bkgImgStyle = {
    backgroundImage: `url(${displayData.background_img})`
  };

  return (
    <div className="escape-room container" style={bkgImgStyle}>
      <h2 className="escape-room title">{displayData.title}</h2>
      <h4 className="escape-room subtitle">{displayData.subtitle}</h4>
      {/* <div className="escape-room image">
      <img src="" alt=""/>
      </div> */}
      <div className="escape-room video-box">
        <iframe
          width="200"
          height="250"
          src={`${displayData.video}`}
          frameborder="0"
        />
      </div>
    </div>
  );
};
