import React from "react";
import { connect } from "react-redux";
import { toggleMobileNav, toggleTab1, toggleTab2 } from "../actions";

import "../assets/mobileNav.css";

class MobileNav extends React.Component {
  render() {
    const { toggleMobileNav, toggleTab1, mobileNavOpen } = this.props;

    const rotateArrowClass = mobileNavOpen ? "open" : "";

    return (
      <div className="mobile-nav container">
        <div
          className="mobile-nav pull-out"
          onClick={e => {
            toggleMobileNav();
          }}
        >
          <i class={`fas fa-arrow-right ${rotateArrowClass}`} />
        </div>
        <div className="mobile-nav center-text">Brainy-actz</div>
        <div className="mobile-nav right-spacer" />
      </div>
    );
  }
}

function mapStateToProps(state) {
  return { mobileNavOpen: state.navData.mobileNavOpen };
}
export default connect(
  mapStateToProps,
  {
    toggleMobileNav,
    toggleTab1,
    toggleTab2
  }
)(MobileNav);
