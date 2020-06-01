import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog, MyIcon } from "./../../../../../components";
import { classPrefix } from "./../../../../../const";
import { Pagination, Spin } from "antd";
import { dataStreamToXls } from "./../../../../../utils";
import "./index.less";

class ResultDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      list: [],
      obj: {
        page: 1,
        pageSize: 5,
        totalRecord: "",
      },
    };
  }

  componentDidMount() {
    this.handleGetList();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  handleGetList = () => {
    const { obj } = this.state;
    const { page, pageSize, totalRecord } = obj;
    const data = { page, pageSize };
    if (totalRecord) data.totalRecord = totalRecord;
    this.setState({ loading: true });
    Request.post(`/memberImportResult/listPageJson`, {
      item: { type: 1 },
      ...data,
    })
      .then((res) => {
        if (res.status === 200) {
          this.setState({
            list: res.data.list,
            obj: { ...obj, totalRecord: res.data.totalRecord },
            loading: false,
          });
        }
      })
      .catch(() => this.setState({ loading: false }));
  };
  // 修改分页
  handleChangePage = (e) => {
    const { obj } = this.state;
    this.setState({ obj: { ...obj, page: e } }, () => this.handleGetList());
  };

  // 导入结果下载
  handleLoad = (e) => {
    console.log(e);
    dataStreamToXls(
      `/memberImportResult/expErrorExcel`,
      { fileId: e },
      "post",
      "导入失败数据.xls"
    );
  };

  render() {
    const { list, obj, loading } = this.state;
    const { afterClose, getContainer } = this.props;
    return (
      <Dialog
        title={"导入结果"}
        closable={true}
        afterClose={afterClose}
        getContainer={getContainer}
        width={700}
        footer={null}
      >
        <div className={`${classPrefix}-home-personnel-roster-resultdialog`}>
          <div
            className={`${classPrefix}-home-personnel-roster-resultdialog-content`}
          >
            <Spin spinning={loading}>
              <div className="content">
                {list.length !== 0 ? (
                  list.map((it, i) => {
                    return (
                      <div
                        className={`${
                          i === list.length - 1 ? "none-bottom" : ""
                        }  clearfix content-item`}
                        key={i}
                      >
                        <div className="l-left">
                          <div className="c999 top">
                            <span className="p-r-10">{it.inputtime}</span>
                            <span>操作人：{it.inputName}</span>
                          </div>
                          {it.status === 0 ? (
                            <div className="text">正在导入...</div>
                          ) : (
                            <div className="text">
                              共解析数据<span>{it.totalNum}</span>条，成功导入
                              <span className="suc">{it.successNum}</span>
                              条，导入失败
                              <span className="red">{it.failNum}</span>条
                            </div>
                          )}
                        </div>
                        {it.status !== 0 && (
                          <div
                            className="r-right content-item-right"
                            onClick={() => this.handleLoad(it.fileId)}
                          >
                            下载导入失败的数据
                            <MyIcon type="iconxiazai" className="icon" />
                          </div>
                        )}
                      </div>
                    );
                  })
                ) : (
                  <div>暂无结果</div>
                )}
              </div>
            </Spin>
            {obj.totalRecord !== 0 && (
              <div style={{ textAlign: "right" }}>
                <Pagination
                  showQuickJumper
                  showTotal={() => `总共 ${obj.totalRecord} 条`}
                  total={obj.totalRecord}
                  current={obj.page}
                  pageSize={obj.pageSize}
                  onChange={(e) => this.handleChangePage(e)}
                />
              </div>
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
};

const open = (props) => {
  Dialog.OpenDialog({}, <ResultDialog {...props} />);
};

export { open };
