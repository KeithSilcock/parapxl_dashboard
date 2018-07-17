import React from "react";
import db from "../../firebase";

class DisplayListOfDisplays extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      localData: [],
      excludedDisplays: []
    };
  }

  componentDidMount() {
    const { currentData } = this.props;

    if (currentData.type === "carousel") {
      var list_of_displays = currentData.carousel_displays;
      var name = "carousel_displays";
    } else if (currentData.type === "escape-room-list") {
      var list_of_displays = currentData.list_of_displays;
      var name = "list_of_displays";
    }

    this.setState({
      ...this.state,
      localData: list_of_displays
    });
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
    const { excludedDisplays, localData } = this.state;
    const { currentDisplay, currentData } = this.props;

    if (currentData.type === "carousel") {
      var name = "carousel_displays";
    } else if (currentData.type === "escape-room-list") {
      var name = "list_of_displays";
    }

    //remove targeted displays
    const newListOfDisplays = [...localData];
    let count = 0;
    for (let exIndex = 0; exIndex < excludedDisplays.length; exIndex++) {
      const indexToRemove = excludedDisplays[exIndex];
      newListOfDisplays.splice(indexToRemove - count++, 1);
    }

    const newData = {
      ...currentData,
      [name]: newListOfDisplays
    };

    const path = `/displays/${currentDisplay.display_id}/`;
    db.ref(path).set(newData);
  }

  render() {
    const { localData } = this.state;
    //display all escape rooms as checkboxes
    const carouselDisplays = localData.map((display, index2) => {
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
          <label for={`checkbox${display.display_id}`}>{display.title}</label>
        </li>
      );
    });

    return (
      <li className="edit-data item escape-room-list-edit">
        <p>Displayed Escape Rooms:</p>
        <ul className="escape-room-list-edit list">{carouselDisplays}</ul>
        <button
          type="button"
          onClick={e => this.updateEscapeRoomListDisplay(e)}
          className="escape-room-list-edit standard-button"
        >
          Update Display
        </button>
      </li>
    );
  }
}

export default DisplayListOfDisplays;
