import React from "react";
import { classPrefix } from "./../../../../const";
import PropTypes from "prop-types";
import Search from "./Search";
import { Title, Table } from "./../../../../components";
import { Spin, Tabs, Button, message } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { textFromCodeTables } from "./../../../../utils/index";
import "./index.less";
import * as SendDialog from "./SendDialog";
const { TabPane } = Tabs;
class Staff extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableObj: {
        pageSize: 20,
        totalRecord: "",
        page: 1,
      },
      // 筛选条件对象
      condition: {},
      list: [],
      // 岗位
      post: [],
      // 部门
      depart: [],
      activeKey: "2",
      selectedRowKeys: [],
      selectedRows: [],
      email: "",
    };
  }

  componentDidMount() {
    this.handleGetTableList();
    this.handleGetPost();
    this.handleGetDepart();
    this.handleGetEmailConfig();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  // 提交
  handleSummit = (e) => {
    const { tableObj } = this.state;
    this.setState(
      {
        condition: { ...e },
        tableObj: { ...tableObj, totalRecord: "", page: 1 },
      },
      () => this.handleGetTableList()
    );
  };
  // 默认请求列表
  handleGetTableList = () => {
    const { tableObj, condition, activeKey } = this.state;
    const { totalRecord, ...rest } = tableObj;
    const data = { ...rest };
    data.item = { ...condition, queryType: activeKey - 0 };
    if (totalRecord) data.totalRecord = totalRecord;
    // 参数处理结束
    this.setState({ loading: true });
    Request.post(`/memberRelation/welfareListPageJson`, data)
      .then((res) => {
        if (res.status === 200) {
          res.data.list.map((it, i) => (it.key = i));
          this.setState({
            list: res.data.list,
            loading: false,
            tableObj: { ...tableObj, totalRecord: res.data.totalRecord },
          });
        }
      })
      .catch(() => this.setState({ loading: false }));
  };
  // 获取岗位数组
  handleGetPost = () => {
    Request.post(`/postManage/listJson`).then((res) => {
      if (res.status === 200) {
        this.setState({ post: res.data && res.data.list && res.data.list });
      }
    });
  };

  // 获取部门树状结构
  handleGetDepart = () => {
    Request.post(`/memberDepart/getDepartTree`).then((res) => {
      if (res.status === 200) {
        this.setState({ depart: res.data && res.data });
      }
    });
  };
  // 发送祝福
  handleSend = (e) => {
    const { email, activeKey } = this.state;
    SendDialog.open({
      data: { item: e, email, activeKey },
      onSuccess: () => {
        this.setState({ selectedRowKeys: [], selectedRows: [] });
      },
    });
  };
  // 验证邮箱是否绑定
  handleGetEmailConfig = () => {
    Request.post(`/email/config/getEmailConfig`).then((res) => {
      if (res.status === 200) {
        this.setState({
          email: res.data.status === "-1" ? "" : res.data.email,
        });
      }
    });
  };
  // 批量发送祝福
  handleSendBless = () => {
    const { selectedRows, email, activeKey } = this.state;
    if (!selectedRows.length) return message.error("请先选择要发送的人");
    SendDialog.open({
      data: { item: selectedRows, email, activeKey },
      onSuccess: () => {
        this.setState({ selectedRowKeys: [], selectedRows: [] });
      },
    });
  };

  render() {
    const columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        width: 120,
        render: (text) => {
          return <div>{text ? text : "--"}</div>;
        },
      },
      {
        title: "手机号",
        dataIndex: "mobilephone",
        key: "mobilephone",
        width: 150,
        render: (text) => {
          return <div>{text ? text : "--"}</div>;
        },
      },
      {
        title: "部门",
        dataIndex: "deptName",
        key: "deptName",
        width: 130,
        render: (text) => {
          return <div>{text ? text : "--"}</div>;
        },
      },
      {
        title: "岗位",
        dataIndex: "postName",
        key: "postName",
        width: 130,
        render: (text) => {
          return <div>{text ? text : "--"}</div>;
        },
      },
      {
        title: "性别",
        dataIndex: "sex",
        key: "sex",
        width: 120,
        render: (text) => {
          const { sex } = this.props.codeTable && this.props.codeTable;
          let tableText = textFromCodeTables(text, sex);
          return <div>{tableText}</div>;
        },
      },
      {
        title: "入职日期",
        dataIndex: "joinTime",
        key: "joinTime",
        width: 180,
        render: (text) => {
          return <div>{text ? text.split(" ")[0] : ""}</div>;
        },
      },
      {
        title: "出生日期",
        dataIndex: "birth",
        key: "birth",
        width: 180,
        render: (text) => {
          return <div>{text ? text.split(" ")[0] : ""}</div>;
        },
      },
      {
        title: "员工类型",
        dataIndex: "memberType",
        key: "memberType",
        width: 180,
        render: (text) => {
          const { memberType } = this.props.codeTable && this.props.codeTable;
          let tableText = textFromCodeTables(text, memberType);
          return <div>{tableText}</div>;
        },
      },
      {
        title: "操作",
        dataIndex: "op",
        key: "op",
        width: 200,
        render: (text, record) => (
          <div className="clearfix columns-op">
            <div className="l-left" onClick={() => this.handleSend(record)}>
              发送祝福
            </div>
          </div>
        ),
      },
    ];
    const {
      list,
      tableObj,
      loading,
      post,
      depart,
      activeKey,
      selectedRowKeys,
    } = this.state;
    const rowSelection = {
      selectedRowKeys,
      onChange: (selectedRowKeys, selectedRows) => {
        this.setState({ selectedRowKeys, selectedRows });
      },
    };
    return (
      <div className={`${classPrefix}-home-personnel-staff`}>
        <div className={`${classPrefix}-home-personnel-staff-content`}>
          <Title>员工关怀</Title>
          <Tabs
            activeKey={activeKey}
            onChange={(e) => {
              const { tableObj } = this.state;
              this.setState(
                {
                  activeKey: e,
                  tableObj: { ...tableObj, page: 1, totalRecord: "" },
                },
                () => this.handleGetTableList()
              );
            }}
          >
            <TabPane tab="生日祝福" key={2}></TabPane>
            <TabPane tab="周年祝福" key={3}></TabPane>
          </Tabs>
          <Search
            onSummit={this.handleSummit}
            post={post}
            depart={depart}
            act={activeKey}
          />
          <div className="p-t-20">
            <Button onClick={this.handleSendBless} type="primary">
              批量发送祝福
            </Button>
          </div>
          <div className="p-t-20">
            <Spin spinning={loading}>
              <Table
                columns={columns}
                list={list}
                tableObj={tableObj}
                rowSelection={rowSelection}
                current={(e) => {
                  this.setState(
                    {
                      tableObj: {
                        ...tableObj,
                        page: e.current,
                        pageSize: e.pageSize,
                      },
                      selectedRowKeys: [],
                      selectedRows: [],
                    },
                    () => this.handleGetTableList()
                  );
                }}
              />
            </Spin>
          </div>
        </div>
      </div>
    );
  }
}

Staff.propTypes = {
  history: PropTypes.object,
};
const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};
const StaffStore = connect(mapStateToProps)(withRouter(Staff));
export default StaffStore;
