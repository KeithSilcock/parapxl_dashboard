import React from "react";

import "../assets/warningModal.css";

export default props => {
  const { header, confirm, cancel } = props;

  return (
    <div
      onClick={e => e.stopPropagation()}
      className="warning-modal cant-click-through"
    >
      <div className="warning-modal container">
        <div className="warning-modal header">
          <div className="spacer" />
          <h3>Delete {`${header}`}</h3>
          <span className="close" onClick={e => cancel(e)}>
            &times;
          </span>
        </div>
        <div className="warning-modal content">
          <span>{`Are you sure you want to delete ${header}?`}</span>
        </div>
        <div className="warning-modal footer">
          <button onClick={e => confirm(e)} className="delete-button">
            Delete
          </button>
          <button onClick={e => cancel(e)} className="standard-button">
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
};
