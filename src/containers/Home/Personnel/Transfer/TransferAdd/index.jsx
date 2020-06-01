import React from "react";
import { classPrefix } from "./../../../../../const";
import { TitleBack } from "./../../../../../components";
import { withRouter } from "react-router-dom";
import Common from "./../Common";
import "./index.less";
class Add extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-home-personnel-transfer-add`}>
        <div className={`${classPrefix}-home-personnel-transfer-add-content`}>
          <TitleBack
            onBack={() => this.props.history.push("/personnel/transfer")}
          >
            发起调动
          </TitleBack>
          <Common obj={{ operateType: 2 }} />
        </div>
      </div>
    );
  }
}

export default withRouter(Add);
