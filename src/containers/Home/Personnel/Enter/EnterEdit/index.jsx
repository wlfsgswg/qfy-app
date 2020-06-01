import React from "react";
import { classPrefix } from "./../../../../../const";
import "./index.less";
import Edit from "./../../Roster/RadioFiles/Basic";
import { TitleBack } from "./../../../../../components";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
class EnterEdit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div className={`${classPrefix}-home-personnel-enter-edit`}>
        <div className={`${classPrefix}-home-personnel-enter-edit-content`}>
          <TitleBack onBack={() => this.props.history.push("/personnel/entry")}>
            修改员工信息
          </TitleBack>
          <Edit
            history={this.props.history}
            preAxiosUrl={"/member/saveJson"}
            preUrl={"/personnel/entry"}
          />
        </div>
      </div>
    );
  }
}

EnterEdit.propTypes = {
  histoy: PropTypes.object,
};

export default withRouter(EnterEdit);
