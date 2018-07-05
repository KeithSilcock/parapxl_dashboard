import React from "react";
import RenderDisplayComponent from "../RenderDisplayComponent";
import db from "../../firebase";

class EditTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      template: {}
    };
  }

  onInputChange(e) {
    const { name, value } = e.target;

    this.setState({
      ...this.state,
      template: { ...this.state.template, [name]: value }
    });
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      ...this.state,
      template: { ...nextProps.selectedTemplate }
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

  submitTemplate(e) {
    //add template to options
    //take you back to /admin/home/Reno/lobby/add-new/display
    //and make sure the new template is displayed
    const { template } = this.state;
    const { location, board, new_type } = this.props.match.params;

    db.ref(`/displays`).push(template, snapshot => {
      this.props.history.push(
        `/admin/home/${location}/${board}/add-new/${new_type}`
      );
    });
  }

  render() {
    const { template } = this.state;
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

    return (
      <div className={`template-edit container ${aCLS || aCRS} ${positionEnd}`}>
        <div className="template-edit list-box">
          <h4 className="template-edit header">Please Update Your Content:</h4>
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
            {renderTemplateEdit}
          </ul>
          <div className="template-edit button-box">
            <button
              className="template-edit create-template"
              onClick={e => {
                this.submitTemplate(e);
                slideAnim();
              }}
            >
              Add New Display
            </button>
            <button
              className="template-edit cancel"
              onClick={e => {
                slideAnim();
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
    );
  }
}

export default EditTemplate;
