import React from "react";
import ReactPlayer from "react-player";

export default props => {
  return (
    <div className="no-location container">
      <div className="top">
        <h1>
          To start using the BrainyActz dashboard, please select a location on
          the left!
        </h1>
        <h3>Or if you're pressed for time, please watch my overview below.</h3>
        <div className="no-location main-text">
          <p>
            This application was designed as a CMS Dashboard for{" "}
            <a
              target="_blank"
              rel="noopener noreferrer"
              href="https://brainyactzsocal.com/"
            >
              escape-room companies
            </a>{" "}
            to create and view their info-board displays.
          </p>
          <p>
            Users can <span className="bold">Create</span>,{" "}
            <span className="bold">Read</span>,{" "}
            <span className="bold">Update</span> and{" "}
            <span className="bold">Delete</span> displays in live time without
            having to change the display television in any way.
          </p>
          <p>
            This application was created using ReactJS, ReduxJS and Firebase.
          </p>
        </div>
        <p> Thank you for visting!</p>
        <p>Keith Silcock</p>
        <ReactPlayer
          url="https://youtu.be/8NYX6F4ny1U"
          controls={true}
          config={{
            youtube: {
              playerVars: { origin: "https://cbdashboard.keithsilcock.com" }
            }
          }}
        />
      </div>
      <div className="no-location links">
        <a
          href="https://github.com/KeithSilcock/parapxl_dashboard"
          target="_blank"
          rel="noopener noreferrer"
        >
          <i className="fab fa-github-square" />
        </a>
        <a
          href="https://keithsilcock.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          My porfolio
        </a>
      </div>
    </div>
  );
};
