import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";

class Record extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-record`}>
        <div className={`${classPrefix}-home-personnel-record-content`}>
          record
        </div>
      </div>
    );
  }
}

Record.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Record);
