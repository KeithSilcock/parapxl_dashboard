import React from "react";
import RenderDisplayComponent from "../RenderDisplayComponent";
import ChooseDisplays from "./ChooseDisplays";
import db from "../../firebase";

class EditTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      template: {},
      escapeRoomsListOpen: false,
      prev_ids: []
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      template: { ...nextProps.selectedTemplate }
    });
  }

  toggleEscapeRoomsList() {
    const { escapeRoomsListOpen } = this.state;
    this.setState({
      escapeRoomsListOpen: !escapeRoomsListOpen
    });
  }

  onInputChange(e) {
    const { name, value } = e.target;
    this.setState({
      ...this.state,
      template: { ...this.state.template, [name]: value }
    });
  }

  emptyInputOnFocus(e) {
    const { template } = this.state;
    const { name, value } = e.target;
    if (
      template[name] === "<template>" ||
      template[name] === "My New Template"
    ) {
      this.setState({
        ...this.state,
        template: { ...this.state.template, [name]: "" }
      });
    }
  }

  closeEdit(e) {
    const { slideAnim } = this.props;
    this.setState(
      {
        ...this.state,
        template: {},
        escapeRoomsListOpen: false,
        prev_ids: []
      },
      () => {
        slideAnim();
      }
    );
  }

  addDisplaysToTemplate(list_of_displays, list_of_ids) {
    this.setState({
      ...this.state,
      escapeRoomsListOpen: false,
      template: { ...this.state.template, list_of_displays },
      prev_ids: list_of_ids
    });
  }

  submitTemplate(e) {
    //add template to options
    //take you back to /admin/home/Reno/lobby/add-new/display
    //and make sure the new template is displayed
    const { template } = this.state;
    const { location, board, new_type } = this.props.match.params;
    debugger;

    db.ref(`/displays`).push(template, snapshot => {
      this.props.history.push(
        `/admin/home/${location}/${board}/add-new/${new_type}`
      );
    });
  }

  render() {
    const { template, escapeRoomsListOpen, prev_ids } = this.state;
    const { aCLS, aCRS, positionEnd, slideAnim, selectedTemplate } = this.props;

    if (Object.keys(selectedTemplate).length) {
      var renderTemplateEdit = Object.keys(selectedTemplate).map(
        (item, index) => {
          const val = selectedTemplate[item];

          var inputCont = null;
          switch (item) {
            case "type":
              break;
            case "name":
              break;
            case "list_of_displays":
              inputCont = (
                <li key={index} className={`template-edit item ${item}`}>
                  <button
                    onClick={e => this.toggleEscapeRoomsList(e)}
                    className="standard-button template-edit escape-room"
                  >
                    Add Escape Rooms
                  </button>
                </li>
              );
              break;
            case "content":
              inputCont = (
                <li key={index} className={`template-edit item ${item}`}>
                  <p>{item}:</p>
                  <textarea
                    onFocus={e => this.emptyInputOnFocus(e)}
                    rows="7"
                    onChange={e => this.onInputChange(e)}
                    type="text"
                    name={item}
                    placeholder="<template>"
                    value={template[item]}
                  />
                </li>
              );
              break;

            default:
              inputCont = (
                <li className={`template-edit item ${item}`} key={index}>
                  <p>{item}:</p>
                  <input
                    onFocus={e => this.emptyInputOnFocus(e)}
                    onChange={e => this.onInputChange(e)}
                    type="text"
                    name={item}
                    value={template[item]}
                    placeholder="<template>"
                  />
                </li>
              );
              break;
          }
          return inputCont;
        }
      );
    }

    const prevTemplate = prev_ids.length ? prev_ids : null;
    const renderEscapeRoomList = escapeRoomsListOpen ? (
      <ChooseDisplays
        toggleEscapeRoomsList={this.toggleEscapeRoomsList.bind(this)}
        prevDisplays={prevTemplate}
        submit={this.addDisplaysToTemplate.bind(this)}
      />
    ) : null;

    return (
      <div className={`template-edit container ${aCLS || aCRS} ${positionEnd}`}>
        <div className="template-edit top">
          <h1>Template Display</h1>
        </div>
        <div className="template-edit bottom">
          <div className="template-edit list-box">
            <div className="template-edit header">
              <h4>Please Update Your Content:</h4>
            </div>
            <ul className="template-edit list">
              <li className={`template-edit item template-name`}>
                <p>Please enter a name for your new template:</p>
                <input
                  onFocus={e => this.emptyInputOnFocus(e)}
                  onChange={e => this.onInputChange(e)}
                  type="text"
                  name="name"
                  value={template.name}
                  placeholder="Enter a Name"
                />
              </li>
              {renderEscapeRoomList}
              {renderTemplateEdit}
            </ul>
            <div className="template-edit button-box">
              <button
                className="template-edit create-template standard-button"
                onClick={e => {
                  this.submitTemplate(e);
                }}
              >
                Add New Display
              </button>
              <button
                className="template-edit delete-button"
                onClick={e => {
                  this.closeEdit(e);
                }}
              >
                Cancel
              </button>
            </div>
          </div>
          <div className="template-edit live-display">
            <h4 className="template-edit header">Live Preview:</h4>
            <RenderDisplayComponent currentDisplayData={template} />
          </div>
        </div>
      </div>
    );
  }
}

export default EditTemplate;
