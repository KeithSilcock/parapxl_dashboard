import React from "react";

class DataDisplayAdmin extends React.Component {
  render() {
    const {
      currentDisplayData,
      onDisplayDataChange,
      updateDisplays
    } = this.props;
    const currentDisplayKeys = Object.keys(currentDisplayData);
    const displayItems = currentDisplayKeys.map((key, index) => {
      return (
        <input
          key={index}
          onChange={onDisplayDataChange}
          type="text"
          name={key}
          value={currentDisplayData[key]}
        />
      );
    });
    return (
      <div>
        <h4>Display Data: {currentDisplayData["type"] || null}</h4>
        <form onSubmit={updateDisplays}>
          <ul>{displayItems}</ul>
          <button>Update Displays</button>
        </form>
      </div>
    );
  }
}

export default DataDisplayAdmin;
