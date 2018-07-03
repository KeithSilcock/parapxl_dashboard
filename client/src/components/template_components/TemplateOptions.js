import React from "react";
import ReactPlayer from "react-player";

export default props => {
  const { displayData } = props;

  const title = displayData.title ? (
    <h2 className="template-display title">Title</h2>
  ) : null;
  const subtitle = displayData.subtitle ? (
    <h4 className="template-display subtitle">Subtitle</h4>
  ) : null;

  const content = displayData.content ? (
    <span className="template-display content">
      Content... (Lorem ipsum dolor sit amet consectetur adipisicing elit.
      Laborum, corporis sit. Tempora doloremque modi provident voluptatibus,
      illo pariatur blanditiis ad unde officia minus, iste ipsa?)
    </span>
  ) : null;

  const image = displayData.image ? (
    <img
      className="template-display image"
      src="https://www.potterybarn.com/pbimgs/rk/images/dp/wcm/201824/0424/faux-potted-orchid-c.jpg"
      alt="template image"
    />
  ) : null;

  const backgroundImg = displayData.background_img ? (
    <div>
      <input
        onClick={e => e.preventDefault()}
        type="checkbox"
        defaultChecked
        className="template-display background_img"
      />
      <span> Has Background Image</span>
    </div>
  ) : null;

  const video = displayData.video ? (
    <ReactPlayer
      className="template_display video"
      width="100"
      height="100"
      url="https://www.youtube.com/watch?v=q2fIWB8o-bs"
    />
  ) : null;

  return (
    <div className="template-display container">
      <div className="template-display top">
        {title} {subtitle}
      </div>
      <div className="template-display content">
        {content} {image} {video}
      </div>
      <div className="template-display misc">{backgroundImg}</div>
    </div>
  );
};
