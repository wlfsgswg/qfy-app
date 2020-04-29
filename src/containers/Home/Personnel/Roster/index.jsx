import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import { Title } from "./../../../../components";
import PropTypes from "prop-types";
import "./index.less";
class Roster extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-roster`}>
        <div className={`${classPrefix}-home-personnel-roster-content`}>
          <Title>员工花名册</Title>
          1111
        </div>
      </div>
    );
  }
}

Roster.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Roster);
