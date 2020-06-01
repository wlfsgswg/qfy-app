import React from "react";
import { classPrefix } from "./../../../../../../const";
import { MyIcon } from "./../../../../../../components";
import "./index.less";
import { withRouter } from "react-router-dom";
import PropTypes from "prop-types";
import { fromTypeToTitle } from "./type";
import { Button, Spin, Row, Col, message, Modal } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import * as EditDialog from "./EditDialog";
class Contract extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      memberId: "",
      list: [],
      loading: false,
      companys: [],
      deleteLoading: false,
    };
  }

  componentDidMount() {
    const { match } = this.props;
    const memberId =
      match && match.params && match.params.id && match.params.id;
    this.setState({ memberId }, () => this.handleGetList());
    this.handleGetCompanys();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  handleGetList = () => {
    const { memberId } = this.state;
    this.setState({ loading: true });
    Request.post(`memberContractInfo/listJson`, { memberId })
      .then((res) => {
        if (res.status === 200)
          this.setState({ list: res.data.data, loading: false });
      })
      .catch(() => this.setState({ loading: false }));
  };
  //   续约即新增
  handleAdd = () => {
    const { memberId, companys } = this.state;
    EditDialog.open({
      data: {
        memberId,
        type: "add",
        companys,
      },
      onSuccess: () => {
        this.handleGetList();
      },
    });
  };
  // 编辑即修改
  handleEdit = (e) => {
    const { memberId, companys } = this.state;
    EditDialog.open({
      data: {
        memberId,
        ...e,
        type: "edit",
        companys,
      },
      onSuccess: () => {
        this.handleGetList();
      },
    });
  };
  // 得到公司下拉选项框
  handleGetCompanys = () => {
    Request.post(`/company/listSelectJson`).then((res) => {
      if (res.status === 200) this.setState({ companys: res.data });
    });
  };

  render() {
    const { list, loading, deleteLoading } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-roster-files-contract`}>
        <div
          className={`${classPrefix}-home-personnel-roster-files-contract-content`}
        >
          <div style={{ textAlign: "right" }}>
            <Button type="primary" onClick={this.handleAdd}>
              添加合同
            </Button>
          </div>
          <Spin spinning={loading}>
            <div className="content">
              {list.length !== 0 &&
                list.map((it, i) => {
                  return (
                    <div
                      className={`content-item ${
                        i === list.length - 1 ? "" : "m-b-30"
                      }`}
                      key={it.id}
                    >
                      <div className="pos">
                        <MyIcon
                          type="iconsanjiaoxing-copy-copy"
                          className={`${
                            it.contractStatus === 2
                              ? "icon1 pos-icon"
                              : "icon2 pos-icon"
                          }`}
                        />
                        <div className="pos-text">
                          {it.contractStatus === 1
                            ? "未执行"
                            : it.contractStatus === 2
                            ? "执行中"
                            : "已到期"}
                        </div>
                      </div>
                      <div className="content-item-title clearfix">
                        <div className="r-right m-l-15">
                          <MyIcon
                            type="iconshanchu"
                            className="sc"
                            onClick={() => {
                              Modal.confirm({
                                title: "删除合同",
                                icon: <ExclamationCircleOutlined />,
                                content: "确认要删除该合同吗？",
                                okText: "确认",
                                cancelText: "取消",
                                okButtonProps: {
                                  loading: deleteLoading,
                                },
                                onOk: () => {
                                  this.setState({ deleteLoading: true });
                                  Request.post(
                                    `/memberContractInfo/deleteJson`,
                                    {
                                      id: it.id,
                                    }
                                  )
                                    .then((res) => {
                                      if (res.status === 200) {
                                        message.success("删除成功");
                                        this.handleGetList();
                                        this.setState({
                                          deleteLoading: false,
                                        });
                                      }
                                    })
                                    .catch(() =>
                                      this.setState({ deleteLoading: false })
                                    );
                                },
                              });
                            }}
                          />
                        </div>
                        <div className="r-right">
                          <MyIcon
                            type="iconbianji"
                            className="bj"
                            onClick={() => this.handleEdit(it)}
                          />
                        </div>
                      </div>
                      <div className="content-item-content">
                        <Row>
                          <Col span={12}>
                            <div className="ul">
                              <div className="li clearfix">
                                <div className="l-left p-r-30">签署公司：</div>
                                <div className="l-left li-text">
                                  {it.signedCompany}
                                </div>
                              </div>
                              <div className="li clearfix">
                                <div className="l-left p-r-30">合同编号：</div>
                                <div className="l-left li-text">
                                  {it.contractNo}
                                </div>
                              </div>
                              <div className="li clearfix">
                                <div className="l-left p-r-30">生效日期：</div>
                                <div className="l-left li-text">
                                  {it.effectiveDate.split(" ")[0]}
                                </div>
                              </div>
                            </div>
                          </Col>

                          <Col span={12}>
                            <div className="ul">
                              <div className="li clearfix">
                                <div className="l-left p-r-30">合同类型：</div>
                                <div
                                  className="l-left li-text"
                                  title={fromTypeToTitle(it.contractType)}
                                >
                                  {fromTypeToTitle(it.contractType)}
                                </div>
                              </div>
                              <div className="li clearfix">
                                <div className="l-left p-r-30">签署日期：</div>
                                <div className="l-left li-text">
                                  {it.signedDate.split(" ")[0]}
                                </div>
                              </div>
                              <div className="li clearfix">
                                <div className="l-left p-r-30">到期日期：</div>
                                <div className="l-left li-text">
                                  {it.expireDate.split(" ")[0]}
                                </div>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      </div>
                    </div>
                  );
                })}

              {list.length === 0 && <div style={{ minHeight: "500px" }}></div>}
            </div>
          </Spin>
        </div>
      </div>
    );
  }
}

Contract.propTypes = {
  match: PropTypes.object,
};
export default withRouter(Contract);
