import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Transfer extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-transfer`}>
        <div className={`${classPrefix}-home-personnel-transfer-content`}>
          transfer
        </div>
      </div>
    );
  }
}

Transfer.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Transfer);
