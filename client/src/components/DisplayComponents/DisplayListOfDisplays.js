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
    } else if (currentData.type === "escape-room-list") {
      var list_of_displays = currentData.list_of_displays;
    }

    if (list_of_displays === "<template>") {
      list_of_displays = [];
    }
    this.setState({
      ...this.state,
      localData: list_of_displays
    });
  }
  componentDidUpdate(prevProps, prevState) {
    const { currentData, isTemplate } = this.props;

    //Will only update if it is in a template
    if (isTemplate) {
      if (currentData.type === "carousel") {
        var name = "carousel_displays";
      } else if (currentData.type === "escape-room-list") {
        var name = "list_of_displays";
      }

      if (
        prevProps.currentData[name] !== this.props.currentData[name] &&
        this.props.currentData[name] !== "<template>"
      ) {
        const localData = this.props.currentData[name].map((display, index) => {
          return {
            ...display,
            checked: true
          };
        });

        this.setState({
          ...this.state,
          localData
        });
      }
    }
  }

  toggleEscapeRoom(e, display, arrayIndex) {
    const { excludedDisplays, localData } = this.state;
    const { checked, value } = e.target;

    const newLocalData = localData.map((item, index) => {
      if (index === arrayIndex) {
        item.checked = checked;
      }
      return item;
    });

    //add or remove index from display data
    if (checked) {
      const displayIndex = excludedDisplays.indexOf(arrayIndex);
      const copy = [...excludedDisplays];
      const removedDisplay = copy.splice(displayIndex, 1);

      this.setState({
        ...this.state,
        localData: newLocalData,
        excludedDisplays: [...copy]
      });
    } else {
      this.setState({
        ...this.state,
        localData: newLocalData,
        excludedDisplays: [...excludedDisplays, arrayIndex]
      });
    }
  }

  updateEscapeRoomListDisplay(e) {
    const { excludedDisplays, localData } = this.state;
    const { currentDisplay, currentData, submitTemps } = this.props;

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
    if (currentDisplay.display_id) {
      const path = `/displays/${currentDisplay.display_id}/`;
      db.ref(path).set(newData);
    } else {
      submitTemps(newListOfDisplays);
    }
  }

  render() {
    const { localData } = this.state;

    //display all escape rooms as checkboxes
    const carouselDisplays = localData.map((display, index2) => {
      return (
        <li key={index2} className="escape-room-list-edit item">
          <input
            checked={display.checked}
            onClick={e => {
              this.toggleEscapeRoom(e, display, index2);
            }}
            type="checkbox"
            id={`checkbox${index2}${display.display_id}`}
            defaultChecked
          />
          <label for={`checkbox${index2}${display.display_id}`}>
            {display.title}
          </label>
        </li>
      );
    });

    const updateButton = localData.length ? (
      <button
        type="button"
        onClick={e => this.updateEscapeRoomListDisplay(e)}
        className="escape-room-list-edit standard-button"
      >
        Update Display
      </button>
    ) : null;

    const containerClass =
      this.props.location.pathname.indexOf("create-new/display") > 0
        ? "template-edit item escape-room-list-edit"
        : "edit-data item escape-room-list-edit";

    return (
      <div className={containerClass}>
        <p>Displayed Escape Rooms:</p>
        <ul className="escape-room-list-edit list">{carouselDisplays}</ul>
        {updateButton}
      </div>
    );
  }
}

export default DisplayListOfDisplays;
