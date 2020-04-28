import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Enter extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-enter`}>
        <div className={`${classPrefix}-home-personnel-enter-content`}>
          Enter
        </div>
      </div>
    );
  }
}

Enter.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Enter);
