import React from "react";
import { classPrefix } from "./../../../../const";
import PropTypes from "prop-types";
import Search from "./Search";
import { Title, Table } from "./../../../../components";
import { Spin, Button, Modal, message } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import { textFromCodeTables } from "./../../../../utils/index";
import * as SureDialog from "./SureDialog";
import * as QuitDialog from "./QuitDialog";
import "./index.less";
class Enter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      deleteLoading: false,
      ydLoading: false,
      tableObj: {
        pageSize: 20,
        totalRecord: "",
        page: 1,
        queryType: 4,
      },
      // 筛选条件对象
      condition: {},
      list: [],
      // 岗位
      post: [],
      // 部门
      depart: [],
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
    const { queryType, totalRecord, ...rest } = tableObj;
    const data = { ...rest };
    data.item = { queryType, ...condition };
    if (totalRecord) data.totalRecord = totalRecord;
    // 参数处理结束
    this.setState({ loading: true });
    Request.post(`/memberRelation/newListPageJson`, data)
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
  // 确认入职
  handleEnterSure = (obj) => {
    const { post, depart, tableObj } = this.state;
    SureDialog.open({
      data: {
        defaultObj: obj,
        post,
        depart,
        codeTable: this.props.codeTable,
      },
      onSuccess: () => {
        tableObj.totalRecord = tableObj.totalRecord - 1;
        const paraPage = Math.ceil(tableObj.totalRecord / tableObj.pageSize);
        tableObj.page = tableObj.page > paraPage ? paraPage : tableObj.page;
        this.setState({ tableObj }, () => this.handleGetTableList());
      },
    });
  };
  // 放弃入职
  handleEnterQuit = (e) => {
    const { codeTable } = this.props;
    QuitDialog.open({
      data: { id: e, codeTable },
      onSuccess: () => this.handleGetTableList(),
    });
  };
  // 移动到待入职
  handleEnterYd = (e) => {
    const { ydLoading } = this.state;
    Modal.confirm({
      title: "移动到待入职",
      icon: <ExclamationCircleOutlined />,
      content: "确认移动到待入职？",
      okButtonProps: {
        loading: ydLoading,
      },
      onOk: () => {
        this.setState({ ydLoading: true });
        Request.post(`/memberRelation/moveToEntry`, { id: e })
          .then((res) => {
            if (res.status === 200) {
              message.success("移动成功！");
              this.setState({ ydLoading: false }, () =>
                this.handleGetTableList()
              );
            }
          })
          .catch(() => this.setState({ ydLoading: false }));
      },
    });
  };
  // 删除
  handleEnterDelete = (e) => {
    const { deleteLoading, tableObj } = this.state;
    Modal.confirm({
      title: "删除人员",
      icon: <ExclamationCircleOutlined />,
      content: "删除后不可恢复，是否确定删除？",
      okButtonProps: {
        loading: deleteLoading,
      },
      onOk: () => {
        this.setState({ deleteLoading: true });
        Request.post(`/memberRelation/deleteEntry`, { id: e })
          .then((res) => {
            if (res.status === 200) {
              message.success("删除成功");
              // 因为列表少一项所以会出现不翻页找不到数据的情况，所以需要手动操作page适应要求
              tableObj.totalRecord = tableObj.totalRecord - 1;
              const paraPage = Math.ceil(
                tableObj.totalRecord / tableObj.pageSize
              );
              tableObj.page =
                tableObj.page > paraPage ? paraPage : tableObj.page;
              this.setState({ deleteLoading: false, tableObj }, () =>
                this.handleGetTableList()
              );
            }
          })
          .catch(() => this.setState({ deleteLoading: false }));
      },
    });
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
  render() {
    const columns = [
      {
        title: "姓名",
        dataIndex: "name",
        key: "name",
        width: 100,
        render: (text) => {
          return <div>{text ? text : "--"}</div>;
        },
      },
      {
        title: "手机号",
        dataIndex: "mobilephone",
        key: "mobilephone",
        width: 130,
        render: (text) => {
          return <div>{text ? text : "--"}</div>;
        },
      },
      {
        title: "部门",
        dataIndex: "deptName",
        key: "deptName",
        width: 100,
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
        title: "入职日期",
        dataIndex: "joinTime",
        key: "joinTime",
        width: 150,
        render: (text) => {
          return <div>{text ? text.split(" ")[0] : "--"}</div>;
        },
      },
      {
        title: "放弃原因",
        dataIndex: "abandonReason",
        key: "abandonReason",
        width: 200,
        render: (text) => {
          const { dimissionReason } =
            this.props.codeTable && this.props.codeTable;
          let tableText = textFromCodeTables(text, dimissionReason);
          return <div>{tableText}</div>;
        },
      },
      {
        title: "放弃备注",
        dataIndex: "abandonRemark",
        key: "abandonRemark",
        width: 300,
        render: (text) => {
          return (
            <div className="line-2" title={text ? text : ""}>
              {text ? text : "--"}
            </div>
          );
        },
      },
      {
        title: "操作",
        dataIndex: "op",
        key: "op",
        width: 400,
        render: (text, record) => (
          <div className="clearfix columns-op">
            {record.adjustType === 3 ? (
              <div
                className="l-left m-r-10"
                onClick={() => this.handleEnterYd(record.id)}
              >
                移动到待入职
              </div>
            ) : (
              <React.Fragment>
                <div
                  className="l-left m-r-10"
                  onClick={() =>
                    this.handleEnterSure({
                      memberType: record.memberType,
                      id: record.id,
                      status: record.status,
                      department: record.department,
                      postId: record.postId,
                      joinTime: record.joinTime,
                      conversionTime: record.conversionTime,
                    })
                  }
                >
                  确认入职
                </div>
                <div
                  className="l-left m-r-10"
                  onClick={() => {
                    // 跳转修改页面
                    this.props.history.push(
                      `/personnel/entry/edit/${record.id}`
                    );
                  }}
                >
                  修改
                </div>
                <div
                  className="l-left m-r-10"
                  onClick={() => this.handleEnterQuit(record.id)}
                >
                  放弃入职
                </div>
              </React.Fragment>
            )}
            <div
              className="l-left"
              onClick={() => this.handleEnterDelete(record.id)}
            >
              删除
            </div>
          </div>
        ),
      },
    ];
    const { list, tableObj, loading, post, depart } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-enter`}>
        <div className={`${classPrefix}-home-personnel-enter-content`}>
          <Title>入职管理</Title>
          <Search onSummit={this.handleSummit} post={post} depart={depart} />
          <div className="p-t-20" style={{ textAlign: "right" }}>
            <Button
              type="primary"
              onClick={() => {
                // 跳转新增页面
                this.props.history.push("/personnel/entry/add");
              }}
            >
              办理入职
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

Enter.propTypes = {
  history: PropTypes.object,
};
const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};
const EnterStore = connect(mapStateToProps)(withRouter(Enter));
export default EnterStore;
