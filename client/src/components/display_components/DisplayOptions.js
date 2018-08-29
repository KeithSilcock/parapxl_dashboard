import React from "react";
import "../../assets/options_dropdown.css";

class OptionsDropDown extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      thisHash: null
    };
  }

  componentWillMount() {
    document.addEventListener("mouseup", this.handleClick, false);
    this.setState({
      ...this.state,
      thisHash: this.props.boardHash
    });
  }
  componentWillUnmount() {
    document.removeEventListener("mouseup", this.handleClick, false);
  }

  handleClick = e => {
    e.stopPropagation();

    if (
      e.target.className.includes("options-drop-down container") ||
      e.target.className.includes("fas fa-ellipsis-v")
    ) {
      return;
    } else if (e.target.className !== "options-drop-down item") {
      this.closeList(e);
    }
  };

  closeList(e) {
    this.setState({
      ...this.state,
      isOpen: false
    });
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
          className="options-drop-down item ignore-parent-clicks"
        >
          Open in new Window
        </a>
      </ul>
    ) : null;

    return (
      <div
        onClick={e => this.toggleOpen(e)}
        className={`options-drop-down container ignore-parent-clicks ${
          this.props.boardHash
        }`}
      >
        <i className="fas fa-ellipsis-v ignore-parent-clicks" />
        {menu}
      </div>
    );
  }
}

export default OptionsDropDown;
