import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import { Title } from "./../../../../components";
import Top from "./Top";
import Search from "./Search";
import Table from "./Table";
import PropTypes from "prop-types";
import "./index.less";
import { Button } from "antd";
class Roster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: 9999,
      focusMenu: 9999,
      tableObj: {
        limit: 10,
        total: 100,
        page: 1,
      },
    };
  }
  // 选中
  handleSelect = (e) => {
    const { focus, focusMenu } = e;
    this.setState({ focus, focusMenu });
  };
  // 取消选中
  handleClick = () => {
    this.setState({ focus: 9999, focusMenu: 9999 });
  };
  render() {
    const { focus, focusMenu, tableObj } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-roster`}>
        <div className={`${classPrefix}-home-personnel-roster-content`}>
          <div className="top">
            <Title>员工花名册</Title>
            <Top
              focus={focus}
              focusMenu={focusMenu}
              onSelect={this.handleSelect}
            />
            <div className="p-t-20">
              <Search />
            </div>
          </div>
          <div className="table">
            <div className="table-top clearfix">
              <div className="r-right p-l-10">
                <Button>导出花名册</Button>
              </div>
              <div className="r-right p-l-10">
                <Button>导入结果</Button>
              </div>
              <div className="r-right p-l-10">
                <Button>导入花名册</Button>
              </div>
              <div className="r-right">
                <Button type="primary">添加员工</Button>
              </div>
            </div>
            <Table
              current={(e) => {
                this.setState({
                  tableObj: { ...tableObj, page: e.current, limit: e.pageSize },
                });
              }}
              tableObj={tableObj}
            />
          </div>
        </div>
      </div>
    );
  }
}

Roster.propTypes = {
  location: PropTypes.object,
};

export default withRouter(Roster);
