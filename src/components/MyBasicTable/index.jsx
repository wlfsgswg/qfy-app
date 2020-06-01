import React from "react";
import { classPrefix } from "./../../const";
import { Table } from "antd";
import PropTypes from "prop-types";
import "./index.less";

class MyTable extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleCurrent = (e) => {
    this.props.current({ current: e.current, pageSize: e.pageSize });
  };

  render() {
    const { tableObj, list, columns, current, ...rest } = this.props;

    return (
      <div className={`${classPrefix}-component-basic-table`}>
        <div className={`${classPrefix}-component-basic-table-content`}>
          <Table
            {...rest}
            columns={columns}
            dataSource={list}
            pagination={{
              pageSizeOptions: ["10", "20", "50", "100"],
              current: tableObj.page,
              pageSize: tableObj.pageSize,
              total: tableObj.totalRecord,
              showQuickJumper: true,
              showSizeChanger: true,
              showTotal: () => `总共 ${tableObj.totalRecord} 条`,
            }}
            onChange={this.handleCurrent}
          />
        </div>
      </div>
    );
  }
}

MyTable.propTypes = {
  tableObj: PropTypes.object,
  list: PropTypes.array,
  columns: PropTypes.array,
};

export default MyTable;
