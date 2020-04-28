import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Formal extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-formal`}>
        <div className={`${classPrefix}-home-personnel-formal-content`}>
          roster
        </div>
      </div>
    );
  }
}

Formal.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Formal);
