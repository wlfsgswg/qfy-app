import React from "react";
import { classPrefix } from "./../../const";
import { LeftOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import "./index.less";

class Title extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-component-titleback`}>
        <div className={`${classPrefix}-component-titleback-content`}>
          <div className="content">
            <div className="clearfix">
              <div
                className="l-left  content-children2 clearfix"
                onClick={() => this.props.onBack()}
              >
                <div className="l-left">
                  <LeftOutlined
                    style={{ fontSize: "23px", color: "#497eef" }}
                  />
                </div>
                <div className="l-left fh">返回</div>
              </div>
              <div className="l-left content-left"></div>
              <div className="l-left content-children">
                {this.props.children}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

Title.propTypes = {
  children: PropTypes.string,
  onBack: PropTypes.func,
};

export default Title;
