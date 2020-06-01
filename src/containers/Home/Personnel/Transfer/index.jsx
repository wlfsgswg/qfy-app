import React from "react";
import { classPrefix } from "./../../../../const";
import PropTypes from "prop-types";
import Search from "./Search";
import { Title, Table } from "./../../../../components";
import { Spin, Button, Modal, message } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { textFromCodeTables } from "./../../../../utils/index";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import * as TransferDialog from "./TransferDialog";
import "./index.less";
class Transfer extends React.Component {
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
      quitLoading: false,
      email: "",
      Mb: [],
    };
  }

  componentDidMount() {
    this.handleGetTableList();
    this.handleGetPost();
    this.handleGetDepart();
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
    const { tableObj, condition } = this.state;
    const { totalRecord, ...rest } = tableObj;
    const data = { ...rest };
    data.item = { ...condition };
    if (totalRecord) data.totalRecord = totalRecord;
    // 参数处理结束
    this.setState({ loading: true });
    Request.post(`/memberRelation/transferListPageJson`, data)
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

  // 调动模板
  // 2--晋升通知，3--调岗通知，4--降级通知
  handleGetZt = (e, cb) => {
    Request.post(`/sysPersonnelTemplate/listJson`, { templateCode: e }).then(
      (res) => {
        if (res.status === 200) {
          this.setState(
            { Mb: res.data && res.data.list && res.data.list },
            () => cb()
          );
        }
      }
    );
  };

  // 确认调动
  handleTransferSure = (e) => {
    this.handleGetZt(e.operateType, () => {
      const { email, Mb, tableObj } = this.state;
      TransferDialog.open({
        data: {
          ...e,
          Mb,
          email,
          mailTheme:
            e.operateType === 2
              ? "晋升通知"
              : e.operateType === 3
              ? "调岗通知"
              : e.operateType === 4
              ? "降级通知"
              : "",
        },
        onSuccess: () => {
          tableObj.totalRecord = tableObj.totalRecord - 1;
          const paraPage = Math.ceil(tableObj.totalRecord / tableObj.pageSize);
          tableObj.page = tableObj.page > paraPage ? paraPage : tableObj.page;
          this.setState({ tableObj }, () => this.handleGetTableList());
        },
      });
    });
  };
  // 放弃调动
  handleTransferNo = (e) => {
    const { quitLoading, tableObj } = this.state;
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "是否放弃对该员工的岗位调动操作？",
      okText: "确认",
      cancelText: "取消",
      okButtonProps: {
        loading: quitLoading,
      },
      onOk: () => {
        this.setState({ quitLoading: true });
        Request.post(`/memberOperate/cancel`, { ...e })
          .then((res) => {
            if (res.status === 200) {
              message.success("放弃调动成功");
              tableObj.totalRecord = tableObj.totalRecord - 1;
              const paraPage = Math.ceil(
                tableObj.totalRecord / tableObj.pageSize
              );
              tableObj.page =
                tableObj.page > paraPage ? paraPage : tableObj.page;
              this.setState({ quitLoading: false, tableObj }, () =>
                this.handleGetTableList()
              );
            }
          })
          .catch(() => this.setState({ quitLoading: false }));
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
        width: 100,
        render: (text) => {
          const { sex } = this.props.codeTable && this.props.codeTable;
          let tableText = textFromCodeTables(text, sex);
          return <div>{tableText}</div>;
        },
      },
      {
        title: "调动日期",
        dataIndex: "targetDate",
        key: "targetDate",
        width: 160,
        render: (text) => {
          return <div>{text ? text.split(" ")[0] : "--"}</div>;
        },
      },
      {
        title: "调动类型",
        dataIndex: "operateType",
        key: "operateType",
        width: 180,
        render: (text) => {
          return (
            <div>{text === 2 ? "晋升" : text === 3 ? "调岗" : "降级"}</div>
          );
        },
      },
      {
        title: "调动后岗位",
        dataIndex: "newPostName",
        key: "newPostName",
        width: 230,
      },
      {
        title: "操作",
        dataIndex: "op",
        key: "op",
        width: 400,
        render: (text, record) => (
          <div className="clearfix columns-op">
            <div
              className="l-left m-r-10"
              onClick={() => this.handleTransferSure(record)}
            >
              确认调动
            </div>
            <div
              className="l-left m-r-10"
              onClick={() =>
                this.props.history.push(
                  `/personnel/transfer/edit/${record.operateId}?operateType=${record.operateType}`
                )
              }
            >
              修改
            </div>
            <div
              className="l-left m-r-10"
              onClick={() =>
                this.handleTransferNo({
                  id: record.operateId,
                  operateType: record.operateType,
                })
              }
            >
              放弃调动
            </div>
          </div>
        ),
      },
    ];
    const { list, tableObj, loading, post, depart } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-transfer`}>
        <div className={`${classPrefix}-home-personnel-transfer-content`}>
          <Title>调动管理</Title>
          <Search onSummit={this.handleSummit} post={post} depart={depart} />
          <div className="p-t-20 t-a-r">
            <Button
              type="primary"
              onClick={() => this.props.history.push("/personnel/transfer/add")}
            >
              发起调动
            </Button>
          </div>
          <div className="p-t-20">
            <Spin spinning={loading}>
              <Table
                columns={columns}
                list={list}
                tableObj={tableObj}
                current={(e) => {
                  this.setState(
                    {
                      tableObj: {
                        ...tableObj,
                        page: e.current,
                        pageSize: e.pageSize,
                      },
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

Transfer.propTypes = {
  history: PropTypes.object,
};
const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};
const TransferStore = connect(mapStateToProps)(withRouter(Transfer));
export default TransferStore;
