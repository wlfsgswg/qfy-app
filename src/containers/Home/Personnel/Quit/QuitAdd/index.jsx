import React from "react";
import { classPrefix } from "./../../../../../const";
import { TitleBack } from "./../../../../../components";
import { withRouter } from "react-router-dom";
import Common from "./../Common";
import "./index.less";
class Add extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-quit-add`}>
        <div className={`${classPrefix}-home-personnel-quit-add-content`}>
          <TitleBack onBack={() => this.props.history.push("/personnel/quit")}>
            办理离职
          </TitleBack>
          <Common obj="" />
        </div>
      </div>
    );
  }
}

export default withRouter(Add);
