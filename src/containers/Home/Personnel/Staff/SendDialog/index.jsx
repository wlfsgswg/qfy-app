import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog } from "./../../../../../components";
import { classPrefix } from "./../../../../../const";
import { Row, Col, Select, Form, message, Radio, Input } from "antd";
import "./index.less";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 8,
  },
  wrapperCol: {
    span: 16,
  },
};
const colSpan = 12;
const colSpan2 = 24;
class SendDialog extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      template: "<div></div>",
      loading: false,
      initialValues: {
        sendType: 1,
        type: 3,
        b: true,
        email: this.props.data.email,
        emailTheme: this.props.data.activeKey === "2" ? "生日祝福" : "周年祝福",
      },
    };
  }

  componentDidMount() {
    this.onChangeSelect(this.state.initialValues.type);
  }
  // 提交
  handleSummit = () => {
    const { template } = this.state;
    const { data } = this.props;
    const { activeKey } = data;
    const { item } = data;
    let memberIds = [];
    if (!item.length) {
      memberIds.push(item.id);
    } else {
      item.map((it) => {
        memberIds.push(it.id);
        return undefined;
      });
    }
    // 先调用报错
    this.formRef.current.submit();
    // 处理数据
    const summit = this.formRef.current.getFieldsValue();

    const { sendType, type, emailTheme, email } = summit;
    const objData = {
      sendType,
      type,
      memberIds,
      moduleType: activeKey - 0,
    };
    if (type === 1) {
      objData.messageContent = template;
    }
    if (type === 2) {
      if (!emailTheme || !email) return;
      objData.emailContent = template;
    }
    if (type === 3) {
      objData.qfyContent = template;
    }
    // 调用接口
    this.setState({ loading: true });
    Request.post(`/memberBatchSend/birthAndAnniversaryNotice`, objData)
      .then((res) => {
        if (res.status === 200) {
          message.success("已发送祝福");
          this.setState({ loading: false });
          this.props.afterClose();
          this.props.onSuccess();
        }
      })
      .catch(() => this.setState({ loading: false }));
  };

  //   更改发动方式
  onChangeSelect = (e) => {
    const { item, activeKey } = this.props.data;
    Request.post(`/template/listJson`, {
      type: e,
      templateUse: activeKey === "2" ? 3 : 4,
    }).then((res) => {
      if (res.status === 200) {
        let content = res.data.template && res.data.template.content;
        if (content && !item.length) {
          content = content.replace(
            /{员工姓名}/g,
            item.name ? item.name : "--"
          );
          content = content.replace(
            /{签署公司}/g,
            item.signedCompanyName ? item.signedCompanyName : "--"
          );
          content = content.replace(
            /{工龄}/g,
            item.workyears ? item.workyears : "--"
          );
        }
        if (!content) content = "<div></div>";
        this.setState({ template: content });
      }
    });
  };

  render() {
    const { initialValues, loading } = this.state;
    const { afterClose, getContainer, data } = this.props;
    const { activeKey, item } = data;
    return (
      <Dialog
        title={"发送祝福"}
        closable={true}
        afterClose={afterClose}
        getContainer={getContainer}
        width={700}
        onOk={this.handleSummit}
        okButtonProps={{ loading }}
      >
        <div className={`${classPrefix}-home-personnel-staff-senddialog`}>
          <div
            className={`${classPrefix}-home-personnel-staff-senddialog-content`}
          >
            <Form
              {...layout}
              name="form-send"
              ref={this.formRef}
              initialValues={initialValues}
            >
              <Row>
                <Col span={colSpan}>
                  <Form.Item
                    name="type"
                    label="发送方式"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Select
                      placeholder="请选择"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                      allowClear
                      onChange={this.onChangeSelect}
                    >
                      <Option value={3} key={3}>
                        企蜂云应用内
                      </Option>
                      <Option value={1} key={1}>
                        短信
                      </Option>
                      <Option value={2} key={2}>
                        邮箱
                      </Option>
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={colSpan2}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.type !== currentValues.type
                    }
                  >
                    {({ getFieldValue }) => {
                      return (
                        <div>
                          {getFieldValue("type") === 1 && (
                            <Form.Item
                              name={"phone"}
                              label="电话号码"
                              labelCol={{ span: 4 }}
                              wrapperCol={{ span: 20 }}
                            >
                              <div className="his-temp">
                                {!item.length && (
                                  <span>
                                    <span>{item.name}：</span>
                                    <span>
                                      <span>
                                        {item.mobilephone && item.mobilephone}
                                      </span>
                                      <span className="red">
                                        {!item.mobilephone && "未绑定"}
                                      </span>
                                    </span>
                                  </span>
                                )}
                                {item.length &&
                                  item.map((it, i) => (
                                    <span key={i} className="m-r-5">
                                      <span>{it.name}：</span>
                                      <span>
                                        <span>
                                          {it.mobilephone && it.mobilephone}
                                        </span>
                                        <span className="red">
                                          {!it.mobilephone && "未绑定"}
                                        </span>
                                      </span>
                                    </span>
                                  ))}
                              </div>
                            </Form.Item>
                          )}
                          {getFieldValue("type") === 2 && (
                            <React.Fragment>
                              <Form.Item
                                name={"mail"}
                                label="邮箱地址"
                                labelCol={{ span: 4 }}
                                wrapperCol={{ span: 20 }}
                              >
                                <div className="his-temp">
                                  {!item.length && (
                                    <span>
                                      <span>{item.name}：</span>
                                      <span>
                                        <span>
                                          {item.memberEmail && item.memberEmail}
                                        </span>
                                        <span className="red">
                                          {!item.memberEmail && "未绑定"}
                                        </span>
                                      </span>
                                    </span>
                                  )}
                                  {item.length &&
                                    item.map((it, i) => (
                                      <span key={i} className="m-r-5">
                                        <span>{it.name}：</span>
                                        <span>
                                          <span>
                                            {it.memberEmail && it.memberEmail}
                                          </span>
                                          <span className="red">
                                            {!it.memberEmail && "未绑定"}
                                          </span>
                                        </span>
                                      </span>
                                    ))}
                                </div>
                              </Form.Item>
                              <Col span={colSpan2}>
                                <Form.Item
                                  labelCol={{ span: 4 }}
                                  wrapperCol={{ span: 15 }}
                                  name={"email"}
                                  label="发件人邮箱"
                                  rules={[
                                    {
                                      required: true,
                                      message:
                                        "未绑定邮箱，请先到个人中心绑定邮箱后再选择邮箱发送",
                                    },
                                  ]}
                                >
                                  <Input
                                    placeholder="未绑定邮箱，请先到个人中心绑定邮箱后再选择邮箱发送"
                                    disabled={true}
                                  />
                                </Form.Item>
                              </Col>
                            </React.Fragment>
                          )}
                        </div>
                      );
                    }}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={colSpan}>
                  <Form.Item
                    // name="b"
                    label="祝福模板"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    {activeKey === "2" ? "生日祝福模板" : "周年祝福模板"}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={colSpan2}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.type !== currentValues.type
                    }
                  >
                    {({ getFieldValue }) => {
                      return (
                        <div>
                          {getFieldValue("type") === 2 && (
                            <React.Fragment>
                              <Col span={colSpan2}>
                                <Form.Item
                                  name={"emailTheme"}
                                  label="祝福主题"
                                  labelCol={{ span: 4 }}
                                  wrapperCol={{ span: 12 }}
                                  rules={[
                                    {
                                      required: true,
                                      message: "请输入祝福主题",
                                    },
                                  ]}
                                >
                                  <Input placeholder="请输入祝福主题" />
                                </Form.Item>
                              </Col>
                            </React.Fragment>
                          )}
                        </div>
                      );
                    }}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={colSpan2}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.type !== currentValues.type
                    }
                  >
                    {() => {
                      const { template } = this.state;
                      return (
                        <div>
                          <Form.Item
                            name="b"
                            label="祝福内容"
                            labelCol={{ span: 4 }}
                            wrapperCol={{ span: 20 }}
                            rules={[
                              {
                                required: true,
                                message: "祝福内容不能为空",
                              },
                            ]}
                          >
                            <div
                              className="my-templateCode"
                              dangerouslySetInnerHTML={{
                                __html: template,
                              }}
                            ></div>
                          </Form.Item>
                        </div>
                      );
                    }}
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={colSpan2}>
                  <Form.Item
                    name="sendType"
                    label="发送时间"
                    labelCol={{ span: 4 }}
                    wrapperCol={{ span: 20 }}
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={1}>立即发送</Radio>
                      <Radio value={2}>生日当天发送</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </div>
        </div>
      </Dialog>
    );
  }
}
SendDialog.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  data: PropTypes.object,
  onSuccess: PropTypes.func,
};

const open = (props) => {
  Dialog.OpenDialog({}, <SendDialog {...props} />);
};

export { open };
