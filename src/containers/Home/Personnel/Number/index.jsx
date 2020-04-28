import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Number extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-number`}>
        <div className={`${classPrefix}-home-personnel-number-content`}>
          number
        </div>
      </div>
    );
  }
}

Number.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Number);
