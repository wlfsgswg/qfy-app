import React from "react";
import PropTypes from "prop-types";
import { classPrefix } from "./../../../../../../const";
import { CheckCircleFilled } from "@ant-design/icons";
import "./index.less";
import { Button } from "antd";

class StepThree extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <div
        className={`${classPrefix}-home-personnel-roster-importdialog-stepthree`}
      >
        <div
          className={`${classPrefix}-home-personnel-roster-importdialog-stepthree-content`}
        >
          <div className="content">
            <CheckCircleFilled style={{ fontSize: "50px", color: "#93d88b" }} />
            <div className="content-text p-t-20">
              提交完成，待导入完成后您可在【导入结果】中查看导入结果
            </div>
          </div>
          <div className="buttom">
            <Button type="primary" onClick={this.props.onSuccess}>
              完成
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

StepThree.propTypes = {
  onSuccess: PropTypes.func,
};

export default StepThree;
