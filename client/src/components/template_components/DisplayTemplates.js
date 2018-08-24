import React from "react";
import db from "../../firebase";
import TemplateOptions from "./TemplateOptions";

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

          const key = {
            "escape-room": "Escape Room",
            "text-board": "Text Board",
            carousel: "Carousel",
            "escape-room-list": "Escape Room List"
          };

          return (
            <li
              key={index}
              className={`add-from-template item ${selectedClass}`}
              onClick={e => this.selectTemplate(e, templateData[templateType])}
            >
              {/* <div className="add-from-template type-box"> */}
              {/* <div className="add-from-template rotated"> */}
              <p className="add-from-template item-name">{key[templateType]}</p>
              {/* </div> */}
              {/* </div> */}
              <TemplateOptions displayData={templateData[templateType]} />
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
        <div className="add-from-template left-container">
          <h3>Available Templates</h3>
          <p>
            Choose from any of the available templates to the right and then
            press the edit button below! After doing so you'll be prompted to
            add your relevant data to your chosen template.
          </p>
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
        <div className="add-from-template right-container">
          {/* <div className="add-from-template header">
          <h1>Available Templates</h1>
        </div> */}
          <div className="add-from-template content">
            <ul className="add-from-template list">{renderTemplates}</ul>
          </div>
        </div>
      </div>
    );
  }
}

export default DisplayTemplates;
