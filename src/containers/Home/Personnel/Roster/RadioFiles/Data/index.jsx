import React from "react";
import { classPrefix } from "./../../../../../../const";
import "./index.less";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { Upload, Button, Spin, message, Row, Col } from "antd";
import { PlusOutlined } from "@ant-design/icons";

class Data extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      // memberId
      id: "",
      // 修改必传id
      editId: "",
      data: [],
      loading: false,
      saveLoading: false,
      imgList: "",
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const id = match && match.params && match.params.id && match.params.id;
    this.setState({ id }, () => {
      this.handleGetShow();
    });
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  // 获取展示信息
  handleGetShow = () => {
    const { id } = this.state;
    Request.post(`/memberDataUpdate/infoJson`, { memberId: id }).then((res) => {
      if (res.status === 200) {
        this.setState({ imgList: res.data }, () => this.handleGetList());
      }
    });
  };
  // 获取列表
  handleGetList = () => {
    const { id, imgList } = this.state;
    this.setState({ loading: true });
    Request.post(`/sysSetDataField/listJsonByAllEnable`, { memberId: id })
      .then((res) => {
        if (res.status === 200 && res.data.status) {
          // 模块类型moduleType 1：基本信息 2：合同信息 3:员工关系
          const [basic, contract, staff] = [[], [], []];
          res.data.list.map((it) => {
            it.fileList = [];
            it.url = [];
            // 对应的值
            const keyValue = imgList[it.fieldCode];
            if (typeof keyValue === "object" && keyValue.length) {
              keyValue.map((url, i) => {
                it.fileList.push({
                  uid: i,
                  status: "done",
                  url: url,
                });
                it.url.push(url);
                return undefined;
              });
            }
            if (typeof keyValue === "string") {
              if (keyValue !== "") {
                it.fileList = [
                  {
                    uid: -1,
                    status: "done",
                    url: keyValue,
                  },
                ];
              }
              it.url = keyValue;
            }
            if (it.moduleType === 1) basic.push(it);
            if (it.moduleType === 2) contract.push(it);
            if (it.moduleType === 3) staff.push(it);
            return undefined;
          });
          this.setState({ data: [basic, contract, staff], loading: false });
        }
      })
      .catch(() => this.setState({ loading: false }));
  };

  // 保存
  handleSave = () => {
    const { data, id, imgList } = this.state;
    const myArray = [];
    data.map((it) => {
      it.length !== 0 &&
        it.map((item) => {
          myArray.push({
            fieldCode: item.fieldCode,
            url: item.url,
          });
          return undefined;
        });
      return undefined;
    });

    const obj = { memberId: id };
    if (imgList.id) obj.id = imgList.id;
    // 值为空的不处理
    myArray.map((it) => {
      if (typeof it.url === "object") {
        obj[it.fieldCode] = it.url;
      }
      if (typeof it.url === "string" && it.url !== "") {
        obj[it.fieldCode] = it.url;
      }
      return undefined;
    });
    // 开始请求数据
    this.setState({ saveLoading: true });
    Request.post(`/memberDataUpdate/saveJson`, obj)
      .then((res) => {
        if (res.status === 200) {
          message.success("保存成功");
          this.setState({ saveLoading: false });
        }
      })
      .catch(() => this.setState({ saveLoading: false }));
  };
  // 上传开始前做一些限制
  beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error("单个文件限制小于20M!");
    }
    return isLt2M;
  };
  render() {
    const { data, loading, saveLoading } = this.state;
    const uploadButton = (
      <div>
        <PlusOutlined />
        <div className="ant-upload-text">点击上传</div>
      </div>
    );
    return (
      <div className={`${classPrefix}-home-personnel-roster-files-data`}>
        <div
          className={`${classPrefix}-home-personnel-roster-files-data-content`}
        >
          <Spin spinning={loading}>
            {data.length ? (
              <div>
                {data.map((it, i) => {
                  return (
                    it.length !== 0 && (
                      <div className="card" key={i}>
                        <div className="card-top">
                          {`${
                            it[0].moduleType === 1
                              ? "基本信息"
                              : it[0].moduleType === 2
                              ? "合同信息"
                              : "员工关系"
                          }`}
                        </div>
                        <Row className="card-content">
                          {it.map((item) => {
                            return (
                              <Col
                                className="clearfix card-content-item l-left"
                                key={item.id}
                                span={12}
                              >
                                <div className="l-left col-text">
                                  {item.fieldName}：
                                </div>
                                <div className="l-left col-upload">
                                  <Upload
                                    accept=".jpj,.jpeg,.png,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip"
                                    action="/fileUpload/file/upload"
                                    data={{ type: 2 }}
                                    listType="picture-card"
                                    beforeUpload={this.beforeUpload}
                                    // listType="picture"
                                    showUploadList={{
                                      showPreviewIcon: false,
                                      showDownloadIcon: true,
                                    }}
                                    onDownload={(e) => {
                                      const url = e.url
                                        ? e.url
                                        : e.response.fileUrl;
                                      window.open(url);
                                    }}
                                    fileList={item.fileList}
                                    onChange={(info) => {
                                      let fileList = [...info.fileList];
                                      item.fileList = fileList;
                                      if (it[0].moduleType === 2) {
                                        item.url = [];
                                        fileList.length !== 0 &&
                                          fileList.map((l) => {
                                            // 两种情况区别对待，一是默认返回的，二是自己手动上传的
                                            // 1
                                            if (l.url) {
                                              item.url.push(l.url);
                                            }
                                            // 2
                                            if (
                                              l.response &&
                                              l.response.fileUrl
                                            ) {
                                              item.url.push(
                                                l.response && l.response.fileUrl
                                              );
                                            }
                                            return undefined;
                                          });
                                      } else {
                                        item.url =
                                          fileList.length !== 0 &&
                                          fileList[0].response &&
                                          fileList[0].response.fileUrl;
                                      }
                                      this.setState({ data });
                                    }}
                                  >
                                    {it[0].moduleType === 2
                                      ? item.fileList.length >= 3
                                        ? null
                                        : uploadButton
                                      : item.fileList.length >= 1
                                      ? null
                                      : uploadButton}
                                  </Upload>
                                </div>
                              </Col>
                            );
                          })}
                        </Row>
                      </div>
                    )
                  );
                })}
                <div style={{ textAlign: "right" }} className="p-r-30 p-b-20">
                  <Button
                    type="primary"
                    onClick={this.handleSave}
                    loading={saveLoading}
                  >
                    保存
                  </Button>
                </div>
              </div>
            ) : (
              <div style={{ minHeight: "500px" }}></div>
            )}
          </Spin>
        </div>
      </div>
    );
  }
}

Data.propTypes = {
  match: PropTypes.object,
};

export default withRouter(Data);
