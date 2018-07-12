import React from "react";
import ReactPlayer from "react-player";

class TemplateOptions extends React.Component {
  render() {
    const { displayData } = this.props;

    const title = displayData.title ? (
      <h2 className="template-display title">Title</h2>
    ) : null;
    const subtitle = displayData.subtitle ? (
      <h4 className="template-display subtitle">Subtitle</h4>
    ) : null;

    const content = displayData.content ? (
      <span className="template-display contents">
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

    const escapeRoomList = displayData.list_of_displays ? (
      <ul className="template-display display-list">
        <li
          className="template-display display-item"
          style={{
            backgroundImage:
              "url(https://brainyactzsocal.com/wp-content/uploads/2018/02/barbershopbacklash-1600xauto@2x.jpg)"
          }}
        >
          <div className="escape-room-list hover-cover">Escape Room 1</div>
        </li>
        <li
          className="template-display display-item"
          style={{
            backgroundImage:
              "url(https://brainyactzsocal.com/wp-content/uploads/2018/02/santas-cabin-2-1600xauto@2x.jpg)"
          }}
        >
          <div className="escape-room-list hover-cover">Escape Room 2</div>
        </li>
        <li
          className="template-display display-item"
          style={{
            backgroundImage:
              "url(https://brainyactzsocal.com/wp-content/uploads/2018/02/cwzgudmxxq5gfn0oita2160922-cropped-400x230-1600xauto@2x.jpg)"
          }}
        >
          <div className="escape-room-list hover-cover">Escape Room 3</div>
        </li>
        <li
          className="template-display display-item"
          style={{
            backgroundImage:
              "url(https://brainyactzsocal.com/wp-content/uploads/2018/02/carnivalchallenge-1600xauto@2x.jpg)"
          }}
        >
          <div className="escape-room-list hover-cover">Escape Room 4</div>
        </li>
        <li
          className="template-display display-item"
          style={{
            backgroundImage:
              "url(https://brainyactzsocal.com/wp-content/uploads/2018/02/thegreatpirateescape-1600xauto@2x.jpg)"
          }}
        >
          <div className="escape-room-list hover-cover">Escape Room 5</div>
        </li>
      </ul>
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

    // const listOfDisplays = displayData.list_of_rooms ? (
    //   <ChooseDisplays />
    // ) : null;

    return (
      <div className="template-display container">
        <div className="template-display top">
          {title} {subtitle}
        </div>
        <div className="template-display content">
          {content} {image} {video} {escapeRoomList}
        </div>
        <div className="template-display misc">{backgroundImg}</div>
      </div>
    );
  }
}

export default TemplateOptions;
