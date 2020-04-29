import React from "react";
import { classPrefix } from "./../../const";
import PropTypes from "prop-types";
import "./index.less";

class Title extends React.Component {
  render() {
    return (
      <div className={`${classPrefix}-component-title`}>
        <div className={`${classPrefix}-component-title-content`}>
          <div className="content">
            <div className="clearfix">
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
};

export default Title;
