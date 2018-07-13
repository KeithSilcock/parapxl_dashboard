import React from "react";
import db from "../../firebase";

class EditDataDisplayed extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentData: {},
      excludedDisplays: []
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
    } else if (currentDisplay) {
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

  toggleEscapeRoom(e, display, arrayIndex) {
    const { excludedDisplays } = this.state;
    const { checked } = e.target;

    //add or remove index from display data
    if (checked) {
      const displayIndex = excludedDisplays.indexOf(arrayIndex);
      const copy = [...excludedDisplays];
      const removedDisplay = copy.splice(displayIndex, 1);

      this.setState({
        ...this.state,
        excludedDisplays: [...copy]
      });
    } else {
      this.setState({
        ...this.state,
        excludedDisplays: [...excludedDisplays, arrayIndex]
      });
    }
  }
  updateEscapeRoomListDisplay(e) {
    const { currentData, excludedDisplays } = this.state;

    if (currentData.type === "carousel") {
      var list_of_displays = currentData.carousel_displays;
      var name = "carousel_displays";
    } else if (currentData.type === "escape-room-list") {
      var list_of_displays = currentData.list_of_displays;
      var name = "list_of_displays";
    }
    //remove targeted displays
    const newListOfDisplays = [...list_of_displays];
    let count = 0;
    for (let exIndex = 0; exIndex < excludedDisplays.length; exIndex++) {
      const indexToRemove = excludedDisplays[exIndex];
      newListOfDisplays.splice(indexToRemove - count++, 1);
    }

    const newData = {
      ...this.state.currentData,
      [name]: newListOfDisplays
    };
    const path = `/displays/${this.props.currentDisplay.display_id}/`;
    db.ref(path).set(newData);
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
      clickedDisplay,
      displaysAvailable
    } = this.props;

    if (currentData) {
      var displayItems = Object.keys(currentData).map((dataKey, index) => {
        const value = currentData[dataKey];

        var inputCont = null;
        switch (dataKey) {
          case "type":
            break;

          case "carousel_displays":
            //display all escape rooms as checkboxes
            const carouselDisplays = value.map((display, index2) => {
              return (
                <li key={index2} className="escape-room-list-edit item">
                  <input
                    onClick={e => {
                      this.toggleEscapeRoom(e, display, index2);
                    }}
                    type="checkbox"
                    id={`checkbox${""}${display.display_id}`}
                    defaultChecked
                  />
                  <label for={`checkbox${display.display_id}`}>
                    {display.title}
                  </label>
                </li>
              );
            });

            inputCont = (
              <li key={index} className="edit-data item escape-room-list-edit">
                <p>Displayed Escape Rooms:</p>
                <ul className="escape-room-list-edit list">
                  {carouselDisplays}
                </ul>
                <button
                  type="button"
                  onClick={e => this.updateEscapeRoomListDisplay(e)}
                  className="escape-room-list-edit standard-button"
                >
                  Update Display
                </button>
              </li>
            );
            break;

          case "list_of_displays":
            //display all escape rooms as checkboxes
            const displays = value.map((display, index2) => {
              return (
                <li key={index2} className="escape-room-list-edit item">
                  <input
                    onClick={e => {
                      this.toggleEscapeRoom(e, display, index2);
                    }}
                    type="checkbox"
                    id={`checkbox${display.display_id}`}
                    defaultChecked
                  />
                  <label for={`checkbox${display.display_id}`}>
                    {display.title}
                  </label>
                </li>
              );
            });

            inputCont = (
              <li key={index} className="edit-data item escape-room-list-edit">
                <p>Displayed Escape Rooms:</p>
                <ul className="escape-room-list-edit list">{displays}</ul>
                <button
                  type="button"
                  onClick={e => this.updateEscapeRoomListDisplay(e)}
                  className="escape-room-list-edit standard-button"
                >
                  Update Display
                </button>
              </li>
            );
            break;
          case "content":
            inputCont = (
              <li key={index} className="edit-data item">
                <p>{dataKey}:</p>
                <textarea
                  rows="7"
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
              <li key={index} className="edit-data item">
                <p>{dataKey}:</p>
                <input
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

    if (Object.keys(clickedDisplay).length) {
      var removeButtonClass =
        clickedDisplay.availableDisplay_id !==
          currentDisplay.availableDisplay_id &&
        clickedDisplay.availableDisplay_id
          ? "delete-button"
          : "";

      var selectedClassName =
        clickedDisplay.availableDisplay_id !==
          currentDisplay.availableDisplay_id &&
        clickedDisplay.availableDisplay_id
          ? "standard-button"
          : "";
    }

    const buttonsDisplay = displaysAvailable ? (
      <div className="edit-data button-box">
        <button type="submit" className="edit-data form-button standard-button">
          Update Data
        </button>
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
      </div>
    ) : null;

    const update_data_form = currentData ? (
      <form className="edit-data form" onSubmit={e => this.updateDisplays(e)}>
        <ul className="edit-data edit-list">{displayItems}</ul>
        {buttonsDisplay}
      </form>
    ) : null;

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
