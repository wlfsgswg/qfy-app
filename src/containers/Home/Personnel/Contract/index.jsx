import React from "react";
import { classPrefix } from "./../../../../const";
import PropTypes from "prop-types";
import Search from "./Search";
import { Title, Table } from "./../../../../components";
import { Spin } from "antd";
import { connect } from "react-redux";
import { withRouter } from "react-router-dom";
import "./index.less";
// 添加合同dialog和花名册个人添加合同修改合同为统一组件
import * as EditDialog from "./../Roster/RadioFiles/Contract/EditDialog";
import { fromTypeToTitle } from "./../Roster/RadioFiles/Contract/type";

class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      tableObj: {
        pageSize: 20,
        totalRecord: "",
        page: 1,
        queryType: 2,
      },
      // 筛选条件对象
      condition: {},
      list: [],
      // 岗位
      post: [],
      // 部门
      depart: [],
      // 公司
      companys: [],
    };
  }

  componentDidMount() {
    this.handleGetTableList();
    this.handleGetPost();
    this.handleGetDepart();
    this.handleGetCompanys();
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
  // 获取签署公司数组
  handleGetCompanys = () => {
    Request.post(`/company/listSelectJson`).then((res) => {
      if (res.status === 200) {
        this.setState({ companys: res.data && res.data });
      }
    });
  };

  // 添加合同
  handleContractAdd = (e) => {
    const { companys } = this.state;
    const { id } = e;
    EditDialog.open({
      data: {
        memberId: id,
        type: "add",
        companys,
      },
      onSuccess: () => {
        this.handleGetTableList();
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
        fixed: "left",
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
      // {
      //   title: "岗位",
      //   dataIndex: "postName",
      //   key: "postName",
      //   width: 130,
      //   render: (text) => {
      //     return <div>{text ? text : "--"}</div>;
      //   },
      // },
      // {
      //   title: "性别",
      //   dataIndex: "sex",
      //   key: "sex",
      //   width: 100,
      //   render: (text) => {
      //     const { sex } = this.props.codeTable && this.props.codeTable;
      //     let tableText = textFromCodeTables(text, sex);
      //     return <div>{tableText}</div>;
      //   },
      // },
      {
        title: "签署公司",
        dataIndex: "signedCompanyName",
        key: "signedCompanyName",
        width: 180,
        render: (text) => {
          return <div>{text ? text : "--"}</div>;
        },
      },
      {
        title: "合同类型",
        dataIndex: "contractType",
        key: "contractType",
        width: 250,
        render: (text) => {
          return (
            <div title={text ? fromTypeToTitle(text) : ""} className="line-2">
              {text ? fromTypeToTitle(text) : "--"}
            </div>
          );
        },
      },
      // {
      //   title: "合同编号",
      //   dataIndex: "contractNo",
      //   key: "contractNo",
      //   width: 120,
      // },
      // {
      //   title: "签署日期",
      //   dataIndex: "signedDate",
      //   key: "signedDate",
      //   width: 120,
      //   render: (text) => {
      //     return <div>{text ? text.split(" ")[0] : ""}</div>;
      //   },
      // },
      {
        title: "生效日期",
        dataIndex: "contractEffectiveTime",
        key: "contractEffectiveTime",
        width: 180,
        render: (text) => {
          return <div>{text ? text.split(" ")[0] : ""}</div>;
        },
      },
      {
        title: "到期日期",
        dataIndex: "contractExpireTime",
        key: "contractExpireTime",
        width: 180,
        render: (text) => {
          return <div>{text ? text.split(" ")[0] : ""}</div>;
        },
      },
      {
        title: "操作",
        dataIndex: "op",
        key: "op",
        width: 200,
        fixed: "right",
        render: (text, record) => (
          <div className="clearfix columns-op">
            <div
              className="l-left"
              onClick={() => this.handleContractAdd(record)}
            >
              添加合同
            </div>
          </div>
        ),
      },
    ];
    const { list, tableObj, loading, post, depart, companys } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-contract`}>
        <div className={`${classPrefix}-home-personnel-contract-content`}>
          <Title>合同管理</Title>
          <Search
            onSummit={this.handleSummit}
            post={post}
            depart={depart}
            companys={companys}
          />
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

Contract.propTypes = {
  history: PropTypes.object,
};
const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};
const ContractStore = connect(mapStateToProps)(withRouter(Contract));
export default ContractStore;
