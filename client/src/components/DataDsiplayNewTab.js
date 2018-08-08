import React from "react";
import db from "../firebase";
import RenderDisplayComponent from "./RenderDisplayComponent";
import NoData from "./DisplayComponents/NoData";

import "../assets/newTabDisplay.css";

class DataDisplayNewTab extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      currentDisplayData: {}
    };
  }

  componentDidUpdate(newProps, newState) {
    this.props;
    this.state;

    if (
      this.props.match.params.display_id !== newProps.match.params.display_id
    ) {
      this.componentWillMount();
    }
  }

  componentWillMount() {
    const { location, board, display_id } = this.props.match.params;

    if (location && board) {
      const path2 = `/boards/${location}/${board}`;
      db.ref(path2).on("value", snapshot => {
        const localDisplay = snapshot.val();

        const path1 = `/displays/${localDisplay.current_display.display_id}`;
        db.ref(path1).on("value", snapshot => {
          const currentDisplay = snapshot.val();

          this.setState({
            ...this.state,
            currentDisplayData: currentDisplay
          });
        });
      });
      return;
    } else {
      const path1 = `/displays/${display_id}`;
      db.ref(path1).on("value", snapshot => {
        const currentDisplay = snapshot.val();

        this.setState({
          ...this.state,
          currentDisplayData: currentDisplay
        });
      });
    }
  }

  render() {
    const { currentDisplayData } = this.state;

    if (this.props.match.params.display_id !== "no-data") {
      return (
        <div className="new-tab">
          <RenderDisplayComponent
            {...this.props}
            currentDisplayData={currentDisplayData}
          />
        </div>
      );
    } else {
      return <NoData />;
    }
  }
}

export default DataDisplayNewTab;
