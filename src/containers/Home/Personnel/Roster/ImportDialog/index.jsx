import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog } from "./../../../../../components";
import { classPrefix } from "./../../../../../const";
import { Steps } from "antd";
import StepOne from "./StepOne";
import StepTwo from "./StepTwo";
import StepThree from "./StepThree";
import "./index.less";
const { Step } = Steps;

class ResultDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      step: 0,
      fileList: [],
      // 接口返回的数据
      data: "",
    };
  }

  render() {
    const { afterClose, getContainer } = this.props;
    const { step, fileList, data } = this.state;
    return (
      <Dialog
        title={"导入员工"}
        closable={true}
        afterClose={afterClose}
        getContainer={getContainer}
        width={700}
        footer={null}
      >
        <div className={`${classPrefix}-home-personnel-roster-importdialog`}>
          <div
            className={`${classPrefix}-home-personnel-roster-importdialog-content`}
          >
            <div className="p-b-20">
              <Steps current={step} size="small">
                <Step title="上传文档" />
                <Step title="匹配字段" />
                <Step title="完成" />
              </Steps>
            </div>
            {step === 0 ? (
              <StepOne
                fileList={fileList}
                onChangeFileList={(e) => this.setState({ fileList: e })}
                onSuccess={() => this.setState({ step: 1 })}
                onData={(e) => this.setState({ data: e })}
              />
            ) : step === 1 ? (
              <StepTwo
                data={data}
                onBack={() => this.setState({ step: 0 })}
                onSuccess={() => this.setState({ step: 2 })}
              />
            ) : (
              <StepThree
                onSuccess={() => {
                  const { afterClose, onSuccess } = this.props;
                  afterClose();
                  onSuccess();
                }}
              />
            )}
          </div>
        </div>
      </Dialog>
    );
  }
}
ResultDialog.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  onSuccess: PropTypes.func,
};

const open = (props) => {
  Dialog.OpenDialog({}, <ResultDialog {...props} />);
};

export { open };
