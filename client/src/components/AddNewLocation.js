import React from "react";
import "../assets/addNewLocation.css";

class AddNewDBItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openInput: false,
      newDataName: ""
    };
  }

  toggleInputOpen() {
    const { openInput } = this.state;
    this.setState({
      openInput: !openInput,
      newDataName: ""
    });
  }

  handleInputChange(event) {
    const { name, value } = event.currentTarget;

    this.setState({
      ...this.state,
      [name]: value
    });
  }
  render() {
    const { openInput, newDataName } = this.state;
    const { addNewItem, newText } = this.props;

    const openForm = openInput ? (
      <form
        onSubmit={e => {
          addNewItem(e, newDataName);
          this.toggleInputOpen();
        }}
      >
        <input
          autoFocus
          type="text"
          name="newDataName"
          onChange={this.handleInputChange.bind(this)}
          value={newDataName}
        />
      </form>
    ) : null;

    return (
      <div className="add-new-item-container">
        <button
          className="add-new-item-button"
          onClick={this.toggleInputOpen.bind(this)}
        >
          Add a New {newText}
        </button>
        <div className="add-new-item-form-container">{openForm}</div>
      </div>
    );
  }
}

export default AddNewDBItem;
