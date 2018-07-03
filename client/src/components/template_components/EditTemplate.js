import React from "react";

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

  submitTemplate(e) {
    this.state;
    debugger;
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
                  <span>{item}:</span>
                  <textarea
                    rows="7"
                    onChange={e => this.onInputChange(e)}
                    type="text"
                    name={item}
                    value={template[item]}
                  />
                </li>
              );
              break;

            default:
              inputCont = (
                <li className={`template-edit item ${item}`} key={index}>
                  <span>{item}</span>
                  <input
                    onChange={e => this.onInputChange(e)}
                    type="text"
                    name={item}
                    value={template[item]}
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
        <ul className="template-edit list">{renderTemplateEdit}</ul>
        <button
          onClick={e => {
            this.submitTemplate(e);
            slideAnim();
          }}
        >
          Move back
        </button>
      </div>
    );
  }
}

export default EditTemplate;
