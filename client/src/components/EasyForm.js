import React from "react";
import { connect } from "react-redux";
import { toggleModal } from "../actions";

class EasyInput extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      inputData: ""
    };
  }

  handleInputChange(event) {
    const { name, value } = event.currentTarget;

    this.setState({
      ...this.state,
      [name]: value
    });
  }

  render() {
    const { inputData } = this.state;
    const { placeholder, autoFocus, onSub, toggleModal } = this.props;

    return (
      <form
        onSubmit={e => {
          onSub(e, inputData);
          toggleModal();
        }}
      >
        <input
          placeholder={placeholder}
          autoFocus={autoFocus}
          type="text"
          name="inputData"
          onChange={this.handleInputChange.bind(this)}
          value={inputData}
        />
      </form>
    );
  }
}

function mapStateToProps(state) {
  return state;
}
export default connect(
  mapStateToProps,
  { toggleModal }
)(EasyInput);
