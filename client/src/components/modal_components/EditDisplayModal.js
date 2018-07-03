import React from "react";
import db from "../../firebase";

class EditDisplayModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentData: {},
      currentDisplay_id: ""
    };
    this.onDisplayDataChange = this.onDisplayDataChange.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { currentSelection } = nextProps;

    this.setState({
      ...this.state,
      currentData: currentSelection.displayData,
      currentDisplay_id: currentSelection.display_id
    });
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

  addDisplayToAvailable(e) {
    const { currentData, currentDisplay_id } = this.state;
    const { location, board } = this.props.match.params;
    const dataToSend = {
      display_id: currentDisplay_id,
      name: currentData.name,
      type: currentData.type
    };
    const path = `/boards/${location}/${board}/available_displays`;
    db.ref(path).push(dataToSend);
  }

  updateDisplays(e) {
    e.preventDefault();
    const { currentData, currentDisplay_id } = this.state;

    const path = `/displays/${currentDisplay_id}/`;
    db.ref(path).set({ ...currentData });
  }

  render() {
    const { currentData } = this.state;
    const { closeModal } = this.props;
    const { board } = this.props.match.params;
    // const { currentSelection } = this.props;

    if (currentData) {
      var displayItems = Object.keys(currentData).map((dataKey, index) => {
        const value = currentData[dataKey];
        var inputCont = null;
        switch (dataKey) {
          case "type":
            break;
          case "display_id":
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

    const update_data_form = currentData ? (
      <form className="edit-data form" onSubmit={e => this.updateDisplays(e)}>
        <ul className="edit-data edit-list">{displayItems}</ul>
        <button
          className="edit-data form-button"
          onClick={e => {
            this.addDisplayToAvailable(e);
            closeModal();
          }}
        >
          Add Display to {board}
        </button>
      </form>
    ) : null;

    return (
      <div className="edit-data container">
        <div className="edit-data data">
          <p className="edit-text">
            Select any available displays. You may recognize some from different
            locations. Please be aware, editing them will edit any of their live
            versions. Once you've found the display you'd like to show, press
            the "Change Current Display" to add that to your list of available
            options. If you'd like to create a new display, press the "Create
            New Display" button in the top right corner to create a new Display
            from the templates
          </p>
          {update_data_form}
        </div>
      </div>
    );
  }
}

export default EditDisplayModal;
