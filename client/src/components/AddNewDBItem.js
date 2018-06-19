import React from "react";

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
          type="text"
          name="newDataName"
          onChange={this.handleInputChange.bind(this)}
          value={newDataName}
        />
      </form>
    ) : null;

    return (
      <div>
        <button onClick={this.toggleInputOpen.bind(this)}>New {newText}</button>
        {openForm}
      </div>
    );
  }
}

export default AddNewDBItem;
