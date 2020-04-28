import React from "react";
import { classPrefix } from "./../../../const";
import { renderRoutes } from "react-router-config";

import "./index.less";
class Personnel extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel`}>
        <div className={`${classPrefix}-home-personnel-content`}>
          {renderRoutes(this.props.route.routes)}
        </div>
      </div>
    );
  }
}

export default Personnel;
