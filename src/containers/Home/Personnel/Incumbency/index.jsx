import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Incumbency extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-incumbency`}>
        <div className={`${classPrefix}-home-personnel-incumbency-content`}>
          Incumbency
        </div>
      </div>
    );
  }
}

Incumbency.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Incumbency);
