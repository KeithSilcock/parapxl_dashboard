import React from "react";
import db from "../firebase";
import RenderDisplayComponent from "./RenderDisplayComponent";

import "../assets/newTabDisplay.css";

class DataDisplayNewTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDisplayData: {}
    };
  }

  componentWillMount() {
    const display_id = this.props.match.params["0"];
    const path = `/displays/${display_id}`;
    const testDispRef = db.ref(path);

    testDispRef.on("value", snapshot => {
      const currentDisplayData = snapshot.val();

      this.setState({
        ...this.state,
        currentDisplayData
      });
    });
  }

  render() {
    const { currentDisplayData } = this.state;

    return (
      <div className="new-tab">
        <RenderDisplayComponent currentDisplayData={currentDisplayData} />
      </div>
    );
  }
}

export default DataDisplayNewTab;
