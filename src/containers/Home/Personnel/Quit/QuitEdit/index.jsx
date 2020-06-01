import React from "react";
import { classPrefix } from "./../../../../../const";
import { TitleBack } from "./../../../../../components";
import { withRouter } from "react-router-dom";
import Common from "./../Common";
import "./index.less";
import moment from "moment";

class Edit extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      obj: {},
    };
  }
  componentDidMount() {
    const { match } = this.props;
    const id = match && match.params && match.params.id && match.params.id;
    this.handleGetMemberInfo(id);
  }
  // 获取个人信息
  handleGetMemberInfo = (id) => {
    Request.post(`/memberOperate/infoJson`, { id, operateType: 5 }).then(
      (res) => {
        if (res.status === 200) {
          res.data.applyDate = res.data.applyDate
            ? moment(res.data.applyDate)
            : null;
          res.data.targetDate = res.data.targetDate
            ? moment(res.data.targetDate)
            : null;
          this.setState({ obj: { ...res.data } });
        }
      }
    );
  };
  render() {
    const { obj } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-quit-edit`}>
        <div className={`${classPrefix}-home-personnel-quit-edit-content`}>
          <TitleBack onBack={() => this.props.history.push("/personnel/quit")}>
            修改离职信息
          </TitleBack>
          {JSON.stringify(obj) !== "{}" && <Common obj={obj} />}
        </div>
      </div>
    );
  }
}

export default withRouter(Edit);
