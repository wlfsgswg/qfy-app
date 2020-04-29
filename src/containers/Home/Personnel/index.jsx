import React from "react";
import { classPrefix } from "./../../../const";
import { MyContent } from "./../../../components";
import { siderObject } from "./sider";
import "./index.less";
class Personnel extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel`}>
        <div className={`${classPrefix}-home-personnel-content`}>
          <MyContent
            siderObject={siderObject}
            routes={this.props.route.routes}
          />
        </div>
      </div>
    );
  }
}

export default Personnel;
