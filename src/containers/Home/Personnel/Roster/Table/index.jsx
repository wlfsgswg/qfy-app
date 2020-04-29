import React from "react";
import { classPrefix } from "./../../../../../const";
import { Table } from "antd";
// import PropTypes from "prop-types";
import "./index.less";

const dataSource = [
  {
    key: "1",
    name: "胡彦斌",
    age: 32,
    address: "西湖区湖底公园1号",
  },
  {
    key: "2",
    name: "胡彦祖",
    age: 42,
    address: "西湖区湖底公园1号",
  },
];

const columns = [
  {
    title: "姓名",
    dataIndex: "name",
    key: "name",
  },
  {
    title: "年龄",
    dataIndex: "age",
    key: "age",
  },
  {
    title: "住址",
    dataIndex: "address",
    key: "address",
  },
];

class MyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCurrent = (e) => {
    this.props.current({ current: e.current, pageSize: e.pageSize });
  };

  render() {
    const { tableObj } = this.props;
    return (
      <div className={`${classPrefix}-home-personnel-roster-table`}>
        <div className={`${classPrefix}-home-personnel-roster-search-table`}>
          <Table
            dataSource={dataSource}
            columns={columns}
            pagination={{
              //   hideOnSinglePage: true,
              pageSize: tableObj.limit,
              total: tableObj.total,
              current: tableObj.page,
              showQuickJumper: true,
              showTotal: (total) => `总共 ${tableObj.total} 条`,
            }}
            onChange={this.handleCurrent}
          />
        </div>
      </div>
    );
  }
}

MyTable.propTypes = {
  //   onSelect: PropTypes.func,
};

export default MyTable;
