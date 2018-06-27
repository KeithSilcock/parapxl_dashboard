import React, { Component } from "react";
import { Route } from "react-router-dom";
import "../assets/App.css";
import LandingPage from "./LandingPage";
import Nav from "./Nav";
import DataDisplayNewTab from "./DataDsiplayNewTab";
import NewDisplayModal from "./NewDisplayModal";

//TODO Finish adding animation for "EditDisplays"

class App extends Component {
  constructor(props) {
    super(props);

    this.state = {
      openModal: false,
      modalData: {},
      buttonState: false
    };

    this.toggleModal = this.toggleModal.bind(this);
  }

  toggleModal(dataToDisplay) {
    const { openModal } = this.state;

    this.setState({
      ...this.state,
      openModal: !openModal,
      modalData: dataToDisplay
    });
  }

  clickButton() {
    const { buttonState } = this.state;

    this.setState({
      ...this.state,
      buttonState: !buttonState
    });
  }

  render() {
    const { buttonState, openModal, modalData } = this.state;
    const buttonText = buttonState ? "true" : "false";
    const path = buttonState ? "/test" : "/test2";

    const modal = openModal ? (
      <Route
        exact
        path="/admin"
        render={props => (
          <NewDisplayModal
            toggleModal={this.toggleModal}
            modalData={modalData}
          />
        )}
      />
    ) : null;

    return (
      <div className="App">
        <link
          href="https://fonts.googleapis.com/css?family=Karla"
          rel="stylesheet"
        />
        {modal}
        <Route path="/admin" component={Nav} />
        <Route
          path="/admin"
          render={props => (
            <LandingPage {...props} toggleModal={this.toggleModal} />
          )}
        />
        <Route path="/display/*" component={DataDisplayNewTab} />
      </div>
    );
  }
}

export default App;
