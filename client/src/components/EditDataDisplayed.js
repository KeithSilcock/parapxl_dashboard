import React from "react";
import db from "../firebase";

class EditDataDisplayed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentData: {}
    };
    this.onDisplayDataChange = this.onDisplayDataChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { clickedDisplay, currentDisplay } = nextProps;

    if (Object.keys(clickedDisplay).length) {
      var path = `/displays/${clickedDisplay.display_id}`;
      db.ref(path).on("value", snapshot => {
        const currentData = snapshot.val();

        this.setState({
          ...this.state,
          currentData
        });
      });
    } else {
      var path = `/displays/${currentDisplay.display_id}`;
      db.ref(path).on("value", snapshot => {
        const currentData = snapshot.val();

        this.setState({
          ...this.state,
          currentData
        });
      });
    }
  }

  onDisplayDataChange(event) {
    const { currentData } = this.state;
    const { name, value } = event.currentTarget;

    const newData = { ...currentData, [name]: value };

    this.setState({
      ...this.state,
      currentData: newData
    });
  }

  updateDisplays(e) {
    e.preventDefault();
    const { currentData } = this.state;
    const { currentDisplay } = this.props;

    const path = `/displays/${currentDisplay.display_id}/`;
    db.ref(path).set({ ...currentData });
  }

  removeDisplayFromBoard(e) {
    e.preventDefault();
    const { clickedDisplay } = this.props;
    const { location, board } = this.props.match.params;
    const path = `/boards/${location}/${board}/available_displays/${
      clickedDisplay.availableDisplay_id
    }`;
    db.ref(path).remove();
  }

  render() {
    const { currentData } = this.state;
    const {
      updateCurrentDisplay,
      currentDisplay,
      closeAnimation,
      boardsAreHidden,
      clickedDisplay
    } = this.props;

    if (currentData) {
      var displayItems = Object.keys(currentData).map((dataKey, index) => {
        const value = currentData[dataKey];

        var inputCont = null;
        switch (dataKey) {
          case "type":
            break;

          case "content":
            inputCont = (
              <li className="edit-data item">
                <p>{dataKey}:</p>
                <textarea
                  rows="7"
                  key={index}
                  onChange={this.onDisplayDataChange}
                  type="text"
                  name={dataKey}
                  value={value}
                />
              </li>
            );
            break;

          default:
            inputCont = (
              <li className="edit-data item">
                <p>{dataKey}:</p>
                <input
                  key={index}
                  onChange={this.onDisplayDataChange}
                  type="text"
                  name={dataKey}
                  value={value}
                />
              </li>
            );
            break;
        }
        return inputCont;
      });
    } else {
      var displayItems = null;
    }

    const removeButtonClass =
      clickedDisplay.availableDisplay_id !==
        currentDisplay.availableDisplay_id && clickedDisplay.availableDisplay_id
        ? "remove"
        : "";

    const update_data_form = currentData ? (
      <form className="edit-data form" onSubmit={e => this.updateDisplays(e)}>
        <ul className="edit-data edit-list">{displayItems}</ul>
        <button className="edit-data form-button">Update Data</button>
        <button
          type="button"
          className={`edit-data form-button update ${removeButtonClass}`}
          onClick={e => {
            if (removeButtonClass) {
              this.removeDisplayFromBoard(e);
            }
          }}
        >
          Remove
        </button>
      </form>
    ) : null;

    const selectedClassName =
      clickedDisplay.availableDisplay_id !==
        currentDisplay.availableDisplay_id && clickedDisplay.availableDisplay_id
        ? "selectedDisplay"
        : "";

    return (
      <div className="edit-data container">
        <div className="edit-data data">
          <p className="edit-text">
            Select any available display. Once you've found the display you'd
            like to show, press the "Change Current Display". If you'd like to
            add a new board, press the "+" button below to create a new Display
            from the templates
          </p>
          {update_data_form}
        </div>

        <div className="buttons">
          <button
            className={`update ${selectedClassName}`}
            onClick={e => {
              if (selectedClassName) {
                updateCurrentDisplay();

                if (typeof boardsAreHidden !== "undefined")
                  closeAnimation(boardsAreHidden);
              }
            }}
          >
            Change Current Display
          </button>
          <button className="new">+</button>
        </div>
      </div>
    );
  }
}

export default EditDataDisplayed;
