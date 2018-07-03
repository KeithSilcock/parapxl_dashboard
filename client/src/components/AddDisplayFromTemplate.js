import React from "react";
import db from "../firebase";
import TemplateDisplay from "./TemplateDisplay";

import "../assets/displayFromTemplate.css";

class AddDisplayFromTemplate extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      templateData: null
    };
  }

  componentWillMount() {
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

  render() {
    const { templateData } = this.state;

    if (templateData) {
      var renderTemplates = Object.keys(templateData).map(
        (templateType, index) => {
          return (
            <li className="add-from-template item">
              <p className="add-from-template item-name">{templateType}</p>
              <TemplateDisplay displayData={templateData[templateType]} />
            </li>
          );
        }
      );
    }

    return (
      <div className="add-from-template container">
        <div className="add-from-template header">
          <h1>Available Templates</h1>
        </div>
        <ul className="add-from-template list">{renderTemplates}</ul>
      </div>
    );
  }
}

export default AddDisplayFromTemplate;
