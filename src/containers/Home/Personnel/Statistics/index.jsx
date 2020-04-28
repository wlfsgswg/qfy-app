import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Statistics extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-statistics`}>
        <div className={`${classPrefix}-home-personnel-statistics-content`}>
          Statistics
        </div>
      </div>
    );
  }
}

Statistics.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Statistics);
