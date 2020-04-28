import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Roster extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-roster`}>
        <div className={`${classPrefix}-home-personnel-roster-content`}>
          roster
        </div>
      </div>
    );
  }
}

Roster.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Roster);
