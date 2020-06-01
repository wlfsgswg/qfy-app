import React from "react";
import { classPrefix } from "./../../../../const";
import PropTypes from "prop-types";
import Search from "./Search";
import { Title, Table } from "./../../../../components";
import { Spin } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import { textFromCodeTables } from "./../../../../utils/index";
import * as InternshipDialog from "./InternshipDialog";
import "./index.less";
class Internship extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableObj: {
        pageSize: 20,
        totalRecord: "",
        page: 1,
        queryType: 6,
      },
      // 筛选条件对象
      condition: {},
      list: [],
      // 岗位
      post: [],
      // 部门
      depart: [],
      Zqz: [],
      email: "",
    };
  }

  componentDidMount() {
    this.handleGetTableList();
    this.handleGetPost();
    this.handleGetDepart();
    this.handleGetZqz();
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
    const { tableObj, condition } = this.state;
    const { totalRecord, queryType, ...rest } = tableObj;
    const data = { ...rest };
    data.item = { ...condition, queryType };
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

  // 转全职
  handleTransfer = (e) => {
    const { Zqz, email, tableObj } = this.state;
    const { memberstatus } = this.props.codeTable;
    InternshipDialog.open({
      data: { ...e, Zqz, email, status: memberstatus },
      onSuccess: () => {
        // 因为列表少一项所以会出现不翻页找不到数据的情况，所以需要手动操作page适应要求
        const paraPage = Math.ceil(
          tableObj.totalRecord - 1 / tableObj.pageSize
        );
        tableObj.page = tableObj.page > paraPage ? paraPage : tableObj.page;
        this.setState({ tableObj }, () => this.handleGetTableList());
      },
    });
  };

  // 转全职通知模板
  handleGetZqz = () => {
    Request.post(`/sysPersonnelTemplate/listJson`, { templateCode: "9" }).then(
      (res) => {
        if (res.status === 200) {
          this.setState({ Zqz: res.data && res.data.list && res.data.list });
        }
      }
    );
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
    const { list, tableObj, loading, post, depart } = this.state;
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
        width: 80,
        render: (text) => {
          const { sex } = this.props.codeTable && this.props.codeTable;
          let tableText = textFromCodeTables(text, sex);
          return <div>{tableText}</div>;
        },
      },
      {
        title: "员工类型",
        dataIndex: "memberType",
        key: "memberType",
        width: 200,
        render: (text) => {
          const { memberType } = this.props.codeTable && this.props.codeTable;
          let tableText = textFromCodeTables(text, memberType);
          return <div>{tableText}</div>;
        },
      },
      {
        title: "入职日期",
        dataIndex: "joinTime",
        key: "joinTime",
        width: 160,
        render: (text) => {
          return <div>{text.split(" ")[0]}</div>;
        },
      },
      {
        title: "操作",
        dataIndex: "op",
        key: "op",
        width: 200,
        render: (text, record) => (
          <div className="clearfix columns-op">
            <div className="l-left" onClick={() => this.handleTransfer(record)}>
              转全职
            </div>
          </div>
        ),
      },
    ];
    return (
      <div className={`${classPrefix}-home-personnel-internship`}>
        <div className={`${classPrefix}-home-personnel-internship-content`}>
          <Title>兼职实习管理</Title>
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

Internship.propTypes = {
  history: PropTypes.object,
};
const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};
const InternshipStore = connect(mapStateToProps)(withRouter(Internship));
export default InternshipStore;
