import React from "react";
import { classPrefix } from "./../../../../const";
import { withRouter } from "react-router-dom";
import { Title } from "./../../../../components";
import Top from "./Top";
import PropTypes from "prop-types";
import "./index.less";
import { Button } from "antd";
class Roster extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      focus: 9999,
      focusMenu: 9999,
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
    const { focus, focusMenu } = this.state;
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
            <Button onClick={this.handleClick}>点击</Button>
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
