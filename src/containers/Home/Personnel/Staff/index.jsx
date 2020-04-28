import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Staff extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-staff`}>
        <div className={`${classPrefix}-home-personnel-staff-content`}>
          Staff
        </div>
      </div>
    );
  }
}

Staff.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Staff);
