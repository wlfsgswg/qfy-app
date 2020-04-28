import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Quit extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-quit`}>
        <div className={`${classPrefix}-home-personnel-quit-content`}>Quit</div>
      </div>
    );
  }
}

Quit.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Quit);
