import React from "react";
import { classPrefix } from "./../../../../const";
import PropTypes from "prop-types";
import Search from "./Search";
import { Title, Table } from "./../../../../components";
import { Spin } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { textFromCodeTables } from "./../../../../utils/index";
import "./index.less";
class Record extends React.Component {
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
    Request.post(`/logMemberChangesRecord/listPageJson`, data)
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

  render() {
    const columns = [
      {
        title: "姓名",
        dataIndex: "memberName",
        key: "memberName",
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
        dataIndex: "groupName",
        key: "groupName",
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
        width: 80,
        render: (text) => {
          const { sex } = this.props.codeTable && this.props.codeTable;
          let tableText = textFromCodeTables(text, sex);
          return <div>{tableText}</div>;
        },
      },
      {
        title: "异动类型",
        dataIndex: "changesType",
        key: "changesType",
        width: 160,
        render: (text) => {
          const { changesType } = this.props.codeTable && this.props.codeTable;
          let tableText = textFromCodeTables(text, changesType);
          return <div>{tableText}</div>;
        },
      },
      {
        title: "异动时间",
        dataIndex: "handleTime",
        key: "handleTime",
        width: 160,
      },
      {
        title: "异动详情",
        dataIndex: "changesDetails",
        key: "changesDetails",
        width: 250,
        render: (text) => {
          return <div className="line-2">{text}</div>;
        },
      },
    ];
    const { list, tableObj, loading, post, depart } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-record`}>
        <div className={`${classPrefix}-home-personnel-record-content`}>
          <Title>人事异动记录</Title>
          <Search onSummit={this.handleSummit} post={post} depart={depart} />
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

Record.propTypes = {
  history: PropTypes.object,
};
const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};
const RecordStore = connect(mapStateToProps)(withRouter(Record));
export default RecordStore;
