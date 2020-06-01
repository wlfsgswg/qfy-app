import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import { Title, Table } from "./../../../../components";
import Top from "./Top";
import Search from "./Search";
// import Table from "./Table";
import PropTypes from "prop-types";
import "./index.less";
import { Button, Spin } from "antd";
import { connect } from "react-redux";
import { switchRender } from "./render";
import { tableWidth } from "./tableWidth";
import { UnorderedListOutlined } from "@ant-design/icons";
import * as RadioDialog from "./RadioDialog";
import * as ExportDialog from "./ExportDialog";
import * as ResultDialog from "./ResultDialog";
import * as ImportDialog from "./ImportDialog";

class Roster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      tableTopData: [],
      list: [],
      tableLoading: false,
      tableObj: {
        pageSize: 20,
        totalRecord: "",
        page: 1,
        queryType: 1,
      },
      columns: [],
      // 筛选条件对象
      condition: {},
      // 表格宽度
      allLength: 1000,
    };
  }

  componentDidMount() {
    this.handleGetTableList();
    this.handleGetColumns();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  // 顶端选中
  handleSelect = (e) => {
    const { tableObj } = this.state;
    this.setState(
      {
        tableObj: { ...tableObj, queryType: e.queryType },
      },
      () => this.handleGetTableList()
    );
  };
  // 查询
  handleSummit = (e) => {
    const { tableObj } = this.state;
    this.setState(
      { tableObj: { ...tableObj, page: 1, totalRecord: "" }, condition: e },
      () => this.handleGetTableList()
    );
  };
  // 默认请求数据列表
  handleGetTableList = () => {
    const { condition, tableObj } = this.state;
    const { queryType, ...rest } = tableObj;
    this.setState({ tableLoading: true });
    Request.post(`/member/listPageJson`, {
      item: { queryType: queryType, ...condition },
      ...rest,
    })
      .then((res) => {
        if (res.status === 200) {
          res.data.list.map((it, i) => {
            it.key = i;
            // 此处特殊处理某些字段，以表头为准，更改list保持一致
            it.department = it.deptName;
            it.postId = it.postName;
            it.postLevelId = it.positionLevelName;
            it.signedCompanyId = it.signedCompanyName;
            it.dutyId = it.dutyName;
            return undefined;
          });
          this.setState({
            list: res.data.list,
            tableLoading: false,
            tableObj: {
              ...this.state.tableObj,
              totalRecord: res.data.totalRecord,
            },
          });
        }
      })
      .catch(() => this.setState({ tableLoading: false }));
  };
  // 请求表格头部数据
  handleGetColumns = () => {
    Request.post(`/member/getSysFieldAndOption`).then((res) => {
      if (res.status === 200) {
        // 保存一下表头会在更改表头时候会用
        const tableTopData = JSON.parse(JSON.stringify(res.data));
        const showHeader = [];
        // 处理columns
        res.data.map((it) => {
          it.title = it.fieldName;
          it.dataIndex = it.fieldCode;
          it.key = it.fieldCode;
          // 通过该函数实现手动设置table-width内容
          it.width = tableWidth(it.fieldCode);
          // 通过该函数实现手动设置render内容
          it.render = (text, record) =>
            switchRender(it.fieldCode, text, this.props.codeTable, record);
          // 只显示isShow为true的表头
          if (it.isShow) showHeader.push(it);

          return undefined;
        });
        if (showHeader.length) {
          showHeader[0].fixed = "left";
          showHeader[0].width = 80;
        }

        const columns = [
          {
            title: (
              <UnorderedListOutlined
                style={{ fontSize: "22px", cursor: "pointer", color: "#666" }}
                onClick={this.handleOpenRadio}
              />
            ),
            fixed: "left",
            width: 35,
          },
          ...showHeader,
        ];

        this.setState({
          columns,
          tableTopData,
          allLength: 150 * columns.length,
        });
      }
    });
  };
  // 唤起修改表头数组
  handleOpenRadio = () => {
    const { tableTopData } = this.state;
    RadioDialog.open({
      data: tableTopData,
      onSuccess: () => {
        // this.handleGetTableList();
        this.handleGetColumns();
      },
    });
  };

  // 导出花名册
  handleExport = () => {
    const { tableTopData, tableObj } = this.state;
    ExportDialog.open({
      data: tableTopData,
      total: tableObj.totalRecord && tableObj.totalRecord,
      onSuccess: () => {},
    });
  };
  // 导入结果
  handleResult = () => {
    ResultDialog.open({
      onSuccess: () => {},
    });
  };
  // 导入员工
  handleImport = () => {
    ImportDialog.open({
      onSuccess: () => {
        // 重新请求列表 默认跳到第一页
        const { tableObj } = this.state;
        this.setState({ ...tableObj, page: 1, totalRecord: "" }, () =>
          this.handleGetTableList()
        );
      },
    });
  };

  render() {
    const { tableObj, list, columns, allLength, tableLoading } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-roster`}>
        <div className={`${classPrefix}-home-personnel-roster-content`}>
          <div className="top">
            <Title>员工花名册</Title>
            <Top onSelect={this.handleSelect} />
            <div className="p-t-20">
              <Search onSummit={(e) => this.handleSummit(e)} />
            </div>
          </div>
          <div className="table">
            <div className="table-top clearfix">
              <div className="r-right p-l-10">
                <Button onClick={this.handleExport}>导出花名册</Button>
              </div>
              <div className="r-right p-l-10">
                <Button onClick={this.handleResult}>导入结果</Button>
              </div>
              <div className="r-right p-l-10">
                <Button onClick={this.handleImport}>导入员工</Button>
              </div>
              <div className="r-right">
                <Button
                  type="primary"
                  onClick={() => {
                    this.props.history.push("/personnel/roster/add");
                  }}
                >
                  添加员工
                </Button>
              </div>
            </div>
            <Spin spinning={tableLoading}>
              <Table
                columns={columns}
                list={list}
                tableObj={tableObj}
                scroll={{ x: allLength }}
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

Roster.propTypes = {
  location: PropTypes.object,
  history: PropTypes.object,
};

const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};

const RosterStore = connect(mapStateToProps)(withRouter(Roster));

export default RosterStore;
