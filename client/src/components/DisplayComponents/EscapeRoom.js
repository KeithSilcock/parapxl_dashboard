import React from "react";
import ReactPlayer from "react-player";

export default props => {
  const { displayData } = props;

  const bkgImgStyle = {
    backgroundImage: `url(${displayData.background_img})`
  };

  if (props.history)
    var backButton =
      props.history.length > 1 ? (
        <button
          className="back-button"
          id="back-button"
          onClick={e => {
            props.history.goBack();
          }}
        >
          <i class="fas fa-chevron-left" />
        </button>
      ) : null;

  return (
    <div className="board-preview escape-room container" style={bkgImgStyle}>
      {backButton}
      <div className="escape-room text-content">
        <h2 className="escape-room title">{displayData.title}</h2>
        <h4 className="escape-room subtitle">{displayData.subtitle}</h4>
        <div className="escape-room text-box">
          <span>{displayData.content}</span>
        </div>
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
