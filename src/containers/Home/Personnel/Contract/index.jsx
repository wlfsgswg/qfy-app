import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Contract extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-contract`}>
        <div className={`${classPrefix}-home-personnel-contract-content`}>
          Contract
        </div>
      </div>
    );
  }
}

Contract.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Contract);
