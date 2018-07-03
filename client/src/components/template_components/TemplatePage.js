import React from "react";
import EditTemplate from "./EditTemplate";
import DisplayTemplates from "./DisplayTemplates";

class TemplatePage extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      templatesHidden: false,
      templatesAreTransitioning: { left: false, right: false },
      selectedTemplate: {}
    };
  }

  //   componentWillUpdate(one, two, three) {
  //     debugger;
  //   }

  timedAnimation() {
    const slidingLeft = !this.state.templatesHidden;
    this.setState({
      ...this.state,
      templatesHidden: !slidingLeft,
      templatesAreTransitioning: { left: slidingLeft, right: !slidingLeft }
    });

    setTimeout(() => {
      this.setState({
        ...this.state,
        templatesHidden: slidingLeft,
        templatesAreTransitioning: { left: false, right: false }
      });
    }, 980);
  }

  getSelectedTemplate(selectedTemplate) {
    this.setState({
      ...this.state,
      selectedTemplate
    });
  }

  render() {
    const {
      templatesHidden,
      templatesAreTransitioning,
      selectedTemplate
    } = this.state;

    if (templatesAreTransitioning) {
      var animationClassLeftStart = templatesAreTransitioning.left
        ? "template-slide-left-start"
        : "";
      var animationClassRightStart = templatesAreTransitioning.right
        ? "template-slide-right-start"
        : "";
    }
    if (templatesHidden) {
      var positionEnd =
        !templatesAreTransitioning.left && !templatesAreTransitioning.right
          ? "template-slide-left-end"
          : "";
    } else {
      var positionEnd =
        !templatesAreTransitioning.left && !templatesAreTransitioning.right
          ? "template-slide-right-end"
          : "";
    }

    return (
      <div className={`create-new-display-box`}>
        <DisplayTemplates
          aCLS={animationClassLeftStart}
          aCRS={animationClassRightStart}
          positionEnd={positionEnd}
          slideAnim={this.timedAnimation.bind(this)}
          callBackData={this.getSelectedTemplate.bind(this)}
        />
        <EditTemplate
          aCLS={animationClassLeftStart}
          aCRS={animationClassRightStart}
          positionEnd={positionEnd}
          slideAnim={this.timedAnimation.bind(this)}
          selectedTemplate={selectedTemplate}
        />
      </div>
    );
  }
}

export default TemplatePage;
