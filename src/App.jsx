import React, { Component } from "react";
import { HashRouter as Router } from "react-router-dom";
import { renderRoutes } from "react-router-config";
import { routes } from "./routes";
import { classPrefix } from "./const";
import { connect } from "react-redux";
import PropTypes from "prop-types";
const cookie = "658484CA907B6F6DF1DF3CDBA214B2B4";
class App extends Component {
  componentDidMount() {
    // 此处获取码表，并把它保存到store
    Request.post(`/code/codesJson`, {}).then((res) => {
      if (res.status === 200) this.props.addCodeTable(res.data);
    });
    document.cookie = `JSESSIONID=${cookie}`;
  }
  render() {
    return (
      <div className={`${classPrefix}-app`}>
        <Router>{renderRoutes(routes)}</Router>
      </div>
    );
  }
}

App.propTypes = {
  addCodeTable: PropTypes.func,
};

const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};

const mapDispatchToProps = (dispatch) => {
  return {
    addCodeTable: (e) => {
      dispatch({ type: "ADD-CODE", data: e });
    },
  };
};

const AppStore = connect(mapStateToProps, mapDispatchToProps)(App);

export default AppStore;

// 点击保存按钮后toast提示“保存成功”，点击删除时toast提示“删除完成”
// 入职管理：确认入职后toast提示“完成入职”
// 入职管理：放弃入职后toast提示“放弃入职成功”
// 转正管理：办理转正后toast提示“完成转正”
// 转正管理：延长试用期后toast提示“延长试用期成功”
// 调动管理：确认调动后toast提示“完成调动”
// 调动管理：确认调动后toast提示“放弃调动成功”
// 离职管理：确认离职后toast提示“确认离职完成”
// 离职管理：放弃离职后toast提示“放弃离职成功”
// 兼职实习管理：转全职后toast提示“转全职成功”
// 合同管理：添加合同后toast提示“添加完成”
// 员工关怀：发送祝福后toast提示”已发送祝福“
