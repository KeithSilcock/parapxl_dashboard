import React from "react";

export default props => {
  const { displayData } = props;
  return (
    <div className="text-board container">
      <h2 className="text-board title">{displayData.title}</h2>
      <h4 className="text-board subtitle">{displayData.subtitle}</h4>
      <div className="text-board text-box">{displayData.content}</div>
    </div>
  );
};
