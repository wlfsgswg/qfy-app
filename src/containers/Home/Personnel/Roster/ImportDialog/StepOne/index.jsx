import React from "react";
import PropTypes from "prop-types";
import { classPrefix } from "./../../../../../../const";
import { MyIcon } from "./../../../../../../components";
import { ExclamationCircleFilled, UploadOutlined } from "@ant-design/icons";
import { dataStreamToXls } from "./../../../../../../utils";
import { Upload, Button, message } from "antd";

import "./index.less";

class StepOne extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      obj: "",
      loading: false,
    };
  }

  // 提交
  handleSuccess = () => {
    const { fileList, onSuccess } = this.props;
    const { obj } = this.state;
    if (!fileList.length) return message.error("请先导入表格，再进行下一步！");
    if (obj && obj.status === "error") return message.error(obj.message);
    onSuccess();
  };

  // 下载文件
  handleDownload = () => {
    dataStreamToXls(`/fileUpload/expTempExcel`);
  };
  // 控制上传数量
  handleChange = (info) => {
    this.setState({ loading: true });
    const { onChangeFileList, onData } = this.props;
    let fileList = [...info.fileList];
    fileList = fileList.slice(-1);
    onChangeFileList(fileList);
    // 后台直接抛出错误
    if (info.file.status === "done") {
      const data = info.file.response;
      this.setState({ obj: data, loading: false });
      if (data.status === "error") return message.error(data.message);
      onData(data);
    }
    if (info.file.status === "error") this.setState({ loading: false });
  };

  render() {
    const { fileList } = this.props;
    const { loading } = this.state;
    const props = {
      accept: ".xls",
      action: "/fileUpload/member/match",
      onChange: this.handleChange,
    };
    return (
      <div
        className={`${classPrefix}-home-personnel-roster-importdialog-stepone`}
      >
        <div
          className={`${classPrefix}-home-personnel-roster-importdialog-stepone-content`}
        >
          <div className="content">
            <div className="title p-b-20">
              一、下载员工导入模板，批量填写员工信息
            </div>
            <div className="p-l-30 p-b-20 upload">
              <span onClick={this.handleDownload} style={{ cursor: "pointer" }}>
                点击下载模板 <MyIcon type="iconxiazai" className="icon" />
              </span>
            </div>
            <div className="blue">
              <div className="blue-top">
                <ExclamationCircleFilled className="icon" />
                注意事项
              </div>
              <div className="blue-bottom">
                <div className="blue-bottom-text">
                  1、模板中的表头名称不可更改，表头行不能删除
                </div>
                <div className="blue-bottom-text">2、其中必填项必须保留</div>
                <div className="blue-bottom-text">3、导入文件请勿超过1MB</div>
              </div>
            </div>
            <div className="title p-b-20 p-t-20">二、上传需要导入的文件</div>
            <div className="p-l-30">
              <Upload {...props} fileList={fileList}>
                <Button>
                  <UploadOutlined /> 点击上传
                </Button>
              </Upload>
            </div>
          </div>
          <div style={{ textAlign: "right" }}>
            <Button
              type="primary"
              onClick={this.handleSuccess}
              loading={loading}
            >
              下一步
            </Button>
          </div>
        </div>
      </div>
    );
  }
}

StepOne.propTypes = {
  onSuccess: PropTypes.func,
  onChangeFileList: PropTypes.func,
  onData: PropTypes.func,
};

export default StepOne;
