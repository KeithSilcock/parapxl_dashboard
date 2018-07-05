import React from "react";
import db from "../../firebase";
import TemplateDisplay from "./TemplateOptions";

import "../../assets/displayFromTemplate.css";
import "../../assets/animations/openEditNewDisplay.css";

class DisplayTemplates extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      templateData: "",
      selectedTemplate: ""
    };
  }

  componentDidMount() {
    //get all template data
    const path = `display_list`;
    db.ref(path).once("value", snapshot => {
      const templateData = snapshot.val();
      this.setState({
        ...this.state,
        templateData
      });
    });
  }

  selectTemplate(e, template) {
    this.props.callBackData(template);
    this.setState({
      ...this.state,
      selectedTemplate: template
    });
  }

  onCancel() {
    //push history back to prev location
    const { location, board } = this.props.match.params;
    this.props.history.push(`/admin/home/${location}/${board}/add-new/display`);
  }

  render() {
    const { templateData, selectedTemplate } = this.state;

    const { aCLS, aCRS, positionEnd, slideAnim } = this.props;

    if (templateData) {
      var renderTemplates = Object.keys(templateData).map(
        (templateType, index) => {
          const selectedClass =
            selectedTemplate.type === templateType ? "selected-template" : "";

          return (
            <li
              key={index}
              className={`add-from-template item ${selectedClass}`}
              onClick={e => this.selectTemplate(e, templateData[templateType])}
            >
              <p className="add-from-template item-name">{templateType}</p>
              <TemplateDisplay displayData={templateData[templateType]} />
            </li>
          );
        }
      );
    }

    const selectedClass = selectedTemplate ? "click-allowed" : "";

    return (
      <div
        className={`add-from-template container ${aCLS || aCRS} ${positionEnd}`}
      >
        <div className="add-from-template header">
          <h1>Available Templates</h1>
        </div>
        <div className="add-from-template content">
          <ul className="add-from-template list">{renderTemplates}</ul>
        </div>
        <div className="add-from-template footer">
          <button
            onClick={e => {
              if (selectedTemplate) {
                // this.addTemplateToBoard(e);
                slideAnim();
              }
            }}
            className={`add-from-template add-button ${selectedClass}`}
          >
            Edit Template Data
          </button>
          <button
            onClick={e => {
              this.onCancel(e);
            }}
            className={`add-from-template cancel`}
          >
            Cancel
          </button>
        </div>
      </div>
    );
  }
}

export default DisplayTemplates;
