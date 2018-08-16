import React from "react";
import "../../assets/options_dropdown.css";

class OptionsDropDown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggleOpen(e) {
    e.stopPropagation();
    const { isOpen } = this.state;

    this.setState({
      ...this.state,
      isOpen: !isOpen
    });
  }

  openInNewWindow(e) {
    e.stopPropagation();
  }

  render() {
    const { isOpen } = this.state;

    const menu = isOpen ? (
      <ul className="options-drop-down list">
        <a
          href={`/displays/${this.props.boardHash}`}
          target="_blank"
          onClick={e => this.openInNewWindow(e)}
          className="options-drop-down item"
        >
          Open in new Window
        </a>
      </ul>
    ) : null;

    return (
      <div className="options-drop-down container">
        <i onClick={e => this.toggleOpen(e)} className="fas fa-ellipsis-v" />
        {menu}
      </div>
    );
  }
}

export default OptionsDropDown;
