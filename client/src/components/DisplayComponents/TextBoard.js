import React from "react";

export default props => {
  const { displayData } = props;
  return (
    <div className="board-preview text-board container">
      <div className="text-board text-content">
        <h2 className="text-board title">{displayData.title}</h2>
        <h4 className="text-board subtitle">{displayData.subtitle}</h4>
        <div className="text-board text-box">
          <span>{displayData.content}</span>
        </div>
      </div>
      <div className="text-board image">
        <img src={displayData.image} alt="" />
      </div>
    </div>
  );
};
