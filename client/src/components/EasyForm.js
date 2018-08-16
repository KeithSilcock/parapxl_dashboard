import React from "react";
import { connect } from "react-redux";
import { toggleModal, handleFormChange } from "../actions";

class EasyInput extends React.Component {
  // constructor(props) {
  //   super(props);

  //   this.state = {
  //     inputData: ""
  //   };
  // }

  // handleInputChange(event) {
  //   const { name, value } = event.currentTarget;

  //   this.setState({
  //     ...this.state,
  //     [name]: value
  //   });
  // }

  render() {
    // const { inputData } = this.state;
    const {
      placeholder,
      autoFocus,
      onSub,
      toggleModal,
      inputValue
    } = this.props;

    return (
      <form
        onSubmit={e => {
          onSub(e);
          toggleModal();
        }}
      >
        <input
          placeholder={placeholder}
          autoFocus={autoFocus}
          type="text"
          name="inputData"
          onChange={e => this.props.handleFormChange(e)}
          value={inputValue}
        />
      </form>
    );
  }
}

function mapStateToProps(state) {
  return {
    inputValue: state.data.modalInputValue
  };
}
export default connect(
  mapStateToProps,
  { toggleModal, handleFormChange }
)(EasyInput);
