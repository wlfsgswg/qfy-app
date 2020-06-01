import React from "react";
import { classPrefix } from "./../../../../../const";
import { TitleBack } from "./../../../../../components";
import { withRouter } from "react-router-dom";
import moment from "moment";
import Common from "./../Common";
import "./index.less";
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
    const type = this.props.location.search.split("?operateType=")[1] - 0;
    this.handleGetMemberInfo({ id, operateType: type });
  }
  // 获取个人信息
  handleGetMemberInfo = (e) => {
    Request.post(`/memberOperate/infoJson`, { ...e }).then((res) => {
      if (res.status === 200) {
        res.data.targetDate = res.data.targetDate
          ? moment(res.data.targetDate)
          : null;
        this.setState({ obj: { ...res.data } });
      }
    });
  };
  render() {
    const { obj } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-transfer-edit`}>
        <div className={`${classPrefix}-home-personnel-transfer-edit-content`}>
          <TitleBack
            onBack={() => this.props.history.push("/personnel/transfer")}
          >
            修改调动信息
          </TitleBack>
          {JSON.stringify(obj) !== "{}" && <Common obj={obj} />}
        </div>
      </div>
    );
  }
}

export default withRouter(Edit);
