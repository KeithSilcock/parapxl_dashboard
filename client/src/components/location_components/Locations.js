import React from "react";
import db from "../../firebase";
import { connect } from "react-redux";
import AddNewLocation from "./AddNewLocation";
import {
  toggleTab1,
  setTabDistanceDownNav,
  getData,
  setDisplayData,
  setBoardsForLocation
} from "../../actions/";
import { capitalizeFirstLetters, getFirstLetters } from "../../helpers";
import Logo from "../Logo";

import "../../assets/locations.css";

class Locations extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      firstInstance: true
    };
  }

  componentWillMount() {
    this.getTabDistance(this.props);
  }

  componentDidUpdate(nextProps) {
    const { location: newLocation } = nextProps;
    const { location: oldLocation } = this.props;

    if (newLocation !== oldLocation) {
      this.getTabDistance(nextProps);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      tab1Open: tab1OpenNew,
      tab2Open: tab2OpenNew,
      locations,
      boards: nextBoards
    } = nextProps;
    const {
      tab1Open: tab1OpenOld,
      tab2Open: tab2OpenOld,
      boards: prevBoards
    } = this.props;

    //set tab2 text height
    if (this.state.firstInstance && locations.length) {
      this.setState(
        {
          ...this.state,
          firstInstance: false
        },
        () => {
          const { location, board } = this.props.match.params;
          if (location) {
            this.props.setBoardsForLocation(location);
          }
          if (board) {
            //TODO
          }
          this.getTabDistance(nextProps);
        }
      );
      return;
    }

    if (JSON.stringify(nextBoards) !== JSON.stringify(prevBoards)) {
      this.getTabDistance(nextProps);
    }

    if (
      (locations.length && tab1OpenNew !== tab1OpenOld) ||
      tab2OpenNew !== tab2OpenOld
    ) {
      this.getTabDistance(nextProps);
    }
  }

  getTabDistance(props) {
    const { tab1Open, tab2Open, setTabDistanceDownNav, locations } = props;
    const { location, board } = props.match.params;

    let stopReduce = false;
    if (locations.length) {
      // set height manually due to logo and 50px margin on tab1
      let start = tab1Open ? locations.indexOf(location) : 1;
      start = tab2Open ? start + (locations.indexOf(location) + 1) : start / 2;
      // if (board && !tab2Open) {
      //   start = start / 2;
      // } else if (tab2Open) {
      //   start = start;
      // }
      const distanceDownNav = locations.reduce((acc, item, index) => {
        var locAbbrev = getFirstLetters(capitalizeFirstLetters(item, true));

        if (location === item && index === 0 && tab1Open) {
          stopReduce = true;
          return acc + item.length - 1;
        }
        if (location === item) {
          stopReduce = true;
          return acc + item.length;
        }
        if (stopReduce) {
          return acc;
        }
        return acc + locAbbrev.length + 1;
      }, start);

      setTabDistanceDownNav(distanceDownNav);
    }
  }

  createNewLocation(e, newLocationName) {
    if (e) e.preventDefault();

    if (newLocationName !== "") {
      db.ref(`boards/${newLocationName}`).set("no data yet", () => {
        this.props.history.push(`/admin/home/${newLocationName}`);
        this.props.setDisplayData({});
        this.props.getData();
      });
    }
  }

  moveToBoardsRoute(location) {
    const { location: prevLocation } = this.props.match.params;

    if (location !== prevLocation) {
      this.props.setDisplayData({});
      this.props.setBoardsForLocation(location);
      this.props.history.push(`/admin/home/${location}`);
    }
  }

  render() {
    const { tab1Open, toggleTab1, locations } = this.props;
    const { location } = this.props.match.params;

    if (locations.length) {
      var listOfLocations = locations.map((item, index) => {
        var locAbbrev =
          location !== item && !tab1Open
            ? getFirstLetters(capitalizeFirstLetters(item, true))
            : item;

        if (location) {
          var selectedClassName = location === item ? "selectedLocation" : "";
          var selectedContainerName = selectedClassName
            ? "selected-container"
            : "";
        }

        const locationHeight = {
          height: `${locAbbrev.length / 2 + 1}em`
        };
        if (tab1Open) {
          var tabItemHeight = { height: `${item.split(" ").length + 0.5}em` };
        }
        const itemStyle = Object.assign({}, locationHeight, tabItemHeight);

        return (
          <li
            style={itemStyle}
            key={index}
            className={`${selectedClassName} location-item`}
            onClick={e => {
              this.moveToBoardsRoute(item);
            }}
          >
            <div className={`location-item-container ${selectedContainerName}`}>
              <div className="location grow-container">
                <div className={`location grow-item ${selectedContainerName}`}>
                  {locAbbrev}
                </div>
              </div>
            </div>
          </li>
        );
      });
    }

    return (
      <div
        onMouseEnter={e => toggleTab1()}
        onMouseLeave={e => toggleTab1()}
        className={`locations-container`}
      >
        <Logo {...this.props} />
        <ul className="locations-list">{listOfLocations}</ul>
        <AddNewLocation
          addNewItem={this.createNewLocation.bind(this)}
          newText={"Location"}
        />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {
    locations: state.data.locations,
    boards: state.data.boards,
    tab1Open: state.navData.tab1Open,
    tab2Open: state.navData.tab2Open
  };
}

export default connect(
  mapStateToProps,
  {
    toggleTab1,
    setTabDistanceDownNav,
    getData,
    setBoardsForLocation,
    setDisplayData
  }
)(Locations);
