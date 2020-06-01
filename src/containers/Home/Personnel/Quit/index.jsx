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
import "./index.less";
class Quit extends React.Component {
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
      // 离职原因
      reasonList: [],
      sureLoading: false,
      quitLoading: false,
    };
  }

  componentDidMount() {
    this.handleGetTableList();
    this.handleGetPost();
    this.handleGetDepart();
    this.handleGetReasons();
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
    Request.post(`/memberRelation/leaveListPageJson`, data)
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

  // 获取离职原因
  handleGetReasons = () => {
    Request.get(`/option/optionListJson`, { optionCode: "quit_reasons" }).then(
      (res) => {
        if (res.status === 200) {
          this.setState({
            reasonList: res.data && res.data.list && res.data.list,
          });
        }
      }
    );
  };

  // 确认离职
  handleQuitSure = (e) => {
    const { sureLoading } = this.state;
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认离职，确认离职后该员工将从花名册中删除",
      okText: "确认",
      cancelText: "取消",
      okButtonProps: {
        loading: sureLoading,
      },
      onOk: () => {
        this.setState({ sureLoading: true });
        Request.post(`/memberOperate/confirm`, { id: e, operateType: 5 })
          .then((res) => {
            if (res.status === 200) {
              message.success("确认离职完成");
              this.setState({ sureLoading: false }, () =>
                this.handleGetTableList()
              );
            }
          })
          .catch(() => this.setState({ sureLoading: false }));
      },
    });
  };
  // 放弃离职
  handleQuitNo = (e) => {
    const { quitLoading, tableObj } = this.state;
    Modal.confirm({
      title: "提示",
      icon: <ExclamationCircleOutlined />,
      content: "是否确认离职，确认离职后该员工将从花名册中删除",
      okText: "确认",
      cancelText: "取消",
      okButtonProps: {
        loading: quitLoading,
      },
      onOk: () => {
        this.setState({ quitLoading: true });
        Request.post(`/memberOperate/cancel`, { id: e, operateType: 5 })
          .then((res) => {
            if (res.status === 200) {
              message.success("放弃离职成功");
              // 因为列表少一项所以会出现不翻页找不到数据的情况，所以需要手动操作page适应要求
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

  render() {
    const { list, tableObj, loading, post, depart, reasonList } = this.state;
    const { history } = this.props;

    const columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        width: 140,
        render: (text) => {
          return <div>{text ? text : "--"}</div>;
        },
      },
      {
        title: "手机号",
        dataIndex: "mobilephone",
        key: "mobilephone",
        width: 120,
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
        width: 180,
        render: (text) => {
          return <div>{text ? text : "--"}</div>;
        },
      },
      {
        title: "性别",
        dataIndex: "sex",
        key: "sex",
        width: 110,
        render: (text) => {
          const { sex } = this.props.codeTable && this.props.codeTable;
          let tableText = textFromCodeTables(text, sex);
          return <div>{tableText}</div>;
        },
      },
      {
        title: "预计离职日期",
        dataIndex: "targetDate",
        key: "targetDate",
        width: 300,
        render: (text) => {
          return <div>{text ? text.split(" ")[0] : "--"}</div>;
        },
      },
      {
        title: "离职日期",
        dataIndex: "dimissionTime",
        key: "dimissionTime",
        width: 200,
        render: (text) => {
          return <div>{text ? text.split(" ")[0] : "--"}</div>;
        },
      },
      {
        title: "离职原因",
        dataIndex: "optionId",
        key: "optionId",
        width: 250,
        render: (text) => {
          let tableText = textFromCodeTables(
            text,
            reasonList,
            "optionId",
            "optionName"
          );
          return <div>{tableText}</div>;
        },
      },
      {
        title: "操作",
        dataIndex: "op",
        key: "op",
        width: 350,
        render: (text, record) => (
          <div className="clearfix columns-op">
            {record.status === 3 ? (
              <div
                className="l-left m-r-10"
                onClick={() => {
                  this.props.history.push(
                    `/personnel/entry/edit/${record.id}?infoType=2`
                  );
                }}
              >
                重新入职
              </div>
            ) : (
              <React.Fragment>
                <div
                  className="l-left m-r-10"
                  onClick={() => this.handleQuitSure(record.operateId)}
                >
                  确认离职
                </div>
                <div
                  className="l-left m-r-10"
                  onClick={() =>
                    history.push(`/personnel/quit/edit/${record.operateId}`)
                  }
                >
                  修改
                </div>
                <div
                  className="l-left"
                  onClick={() => this.handleQuitNo(record.operateId)}
                >
                  放弃离职
                </div>
              </React.Fragment>
            )}
          </div>
        ),
      },
    ];

    return (
      <div className={`${classPrefix}-home-personnel-quit`}>
        <div className={`${classPrefix}-home-personnel-quit-content`}>
          <Title>离职管理</Title>
          <Search onSummit={this.handleSummit} post={post} depart={depart} />
          <div className="p-t-20 t-a-r">
            <Button
              type="primary"
              onClick={() => history.push("/personnel/quit/add")}
            >
              办理离职
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

Quit.propTypes = {
  history: PropTypes.object,
};
const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};
const QuitStore = connect(mapStateToProps)(withRouter(Quit));
export default QuitStore;
