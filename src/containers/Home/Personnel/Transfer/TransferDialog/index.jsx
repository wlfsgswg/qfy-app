import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog } from "./../../../../../components";
import { classPrefix } from "./../../../../../const";
import { codeToTemplate } from "./../../../../../utils";
import { Row, Col, Select, Form, message, Radio, Input } from "antd";
import { ExclamationCircleOutlined } from "@ant-design/icons";
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
class TransferDialog extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      loading: false,
      // 转正日期
      initialValues: {
        isSend: 1,
        sendType: 1,
        mailTheme: this.props.data.mailTheme,
        mobilephone: this.props.data.mobilephone
          ? this.props.data.mobilephone
          : null,
        memberEmail: this.props.data.memberEmail
          ? this.props.data.memberEmail
          : "",
        email: this.props.data.email,
      },
    };
  }
  // 提交
  handleSummit = () => {
    const { data } = this.props;
    // 先调用报错
    this.formRef.current.submit();
    // 处理数据
    const summit = this.formRef.current.getFieldsValue();
    const {
      email,
      isSend,
      mailTheme,
      memberEmail,
      sendType,
      templateCode,
      mobilephone,
    } = summit;
    // 进行判断
    if (isSend) {
      if (!templateCode) return;
      if (sendType === 1 && !mobilephone) return;
      if (sendType === 2) {
        if (!email || !memberEmail) return;
      }
    }
    // 获取模板字符串
    const template = codeToTemplate(
      templateCode,
      data.Mb,
      data.operateType === 2
        ? ["{员工姓名}", "{晋升岗位}", "{晋升日期}", "{签署公司}"]
        : data.operateType === 3
        ? ["{员工姓名}", "{调岗岗位}", "{调岗日期}", "{签署公司}"]
        : data.operateType === 4
        ? ["{员工姓名}", "{降职岗位}", "{降职日期}", "{签署公司}"]
        : [],
      [
        data.name,
        data.postName,
        data.conversionTime.split(" ")[0],
        data.signedCompanyName,
      ]
    );
    const objData = {
      id: data.operateId,
      operateType: data.operateType,
      isSend,
    };
    if (isSend) {
      if (sendType) objData.sendType = sendType;
      if (sendType === 1) objData.mobilephone = mobilephone;
      if (sendType === 2) {
        objData.memberEmail = memberEmail;
        objData.mailTheme = mailTheme;
      }
      objData.content = template;
    }
    // 调用接口
    this.setState({ loading: true });
    Request.post(`/memberOperate/confirm`, objData)
      .then((res) => {
        if (res.status === 200) {
          message.success("完成调动");
          this.setState({ loading: false });
          this.props.afterClose();
          this.props.onSuccess();
        }
      })
      .catch(() => this.setState({ loading: false }));
  };

  render() {
    const { initialValues, loading } = this.state;
    const { afterClose, getContainer, data } = this.props;
    return (
      <Dialog
        title={"确认调动"}
        closable={true}
        afterClose={afterClose}
        getContainer={getContainer}
        width={800}
        onOk={this.handleSummit}
        okButtonProps={{ loading }}
      >
        <div
          className={`${classPrefix}-home-personnel-transfer-transferdialog`}
        >
          <div
            className={`${classPrefix}-home-personnel-transfer-transferdialog-content`}
          >
            <div className="p-b-20 p-l-30">
              <span className="p-r-20 p-l-20">
                <ExclamationCircleOutlined
                  style={{ fontSize: "22px", color: "#faad14" }}
                />
              </span>
              <span style={{ lineHeight: "22px " }}>
                是否确认操作调动，调动后该员工将变更为对应岗位
              </span>
            </div>
            <Form
              {...layout}
              name="form-messages"
              ref={this.formRef}
              initialValues={initialValues}
            >
              <Row>
                <Col span={colSpan}>
                  <Form.Item
                    name="isSend"
                    label="调动通知"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Radio.Group>
                      <Radio value={1}>发送</Radio>
                      <Radio value={0}>不发送</Radio>
                    </Radio.Group>
                  </Form.Item>
                </Col>
              </Row>
              <Form.Item
                noStyle
                shouldUpdate={(prevValues, currentValues) =>
                  prevValues.isSend !== currentValues.isSend
                }
              >
                {({ getFieldValue }) => {
                  return (
                    getFieldValue("isSend") === 1 && (
                      <div>
                        <Row>
                          <Col span={colSpan}>
                            <Form.Item
                              name="sendType"
                              label="发送方式"
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <Radio.Group>
                                <Radio value={1}>短信</Radio>
                                <Radio value={2}>邮件</Radio>
                              </Radio.Group>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={colSpan2}>
                            <Form.Item
                              noStyle
                              shouldUpdate={(prevValues, currentValues) =>
                                prevValues.sendType !== currentValues.sendType
                              }
                            >
                              {({ getFieldValue }) => {
                                return (
                                  <div>
                                    {getFieldValue("sendType") === 1 ? (
                                      <Form.Item
                                        name={"mobilephone"}
                                        label="接收手机号"
                                        labelCol={{ span: 4 }}
                                        wrapperCol={{ span: 12 }}
                                        rules={[
                                          {
                                            required: true,
                                            message: "手机号格式不正确",
                                            pattern: /^1[3456789]\d{9}$/,
                                          },
                                        ]}
                                      >
                                        <Input placeholder="请输入手机号" />
                                      </Form.Item>
                                    ) : (
                                      <React.Fragment>
                                        <Col span={colSpan2}>
                                          <Form.Item
                                            labelCol={{ span: 4 }}
                                            wrapperCol={{ span: 12 }}
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
                                        <Form.Item
                                          name={"memberEmail"}
                                          label="接收邮箱"
                                          labelCol={{ span: 4 }}
                                          wrapperCol={{ span: 12 }}
                                          rules={[
                                            {
                                              required: true,
                                              message: "邮箱格式不正确",
                                              pattern: /^[a-zA-Z0-9_-]+@[a-zA-Z0-9_-]+(\.[a-zA-Z0-9_-]+)+$/,
                                            },
                                          ]}
                                        >
                                          <Input placeholder="请输入接收邮箱" />
                                        </Form.Item>
                                        <Form.Item
                                          name={"mailTheme"}
                                          label="邮件主题"
                                          labelCol={{ span: 4 }}
                                          wrapperCol={{ span: 12 }}
                                          rules={[
                                            {
                                              required: true,
                                              message: "请输入邮件主题",
                                            },
                                          ]}
                                        >
                                          <Input placeholder="请输入邮件主题" />
                                        </Form.Item>
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
                              name="templateCode"
                              label="通知模板"
                              labelCol={{ span: 4 }}
                              wrapperCol={{ span: 12 }}
                              rules={[
                                {
                                  required: true,
                                },
                              ]}
                            >
                              <Select
                                placeholder="请选择模板"
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch
                                allowClear
                              >
                                {data.Mb.length &&
                                  data.Mb.map((it) => (
                                    <Option value={it.id} key={it.id}>
                                      {it.templateName}
                                    </Option>
                                  ))}
                              </Select>
                            </Form.Item>
                          </Col>
                        </Row>
                        <Row>
                          <Col span={colSpan2}>
                            <Form.Item
                              labelCol={{ span: 4 }}
                              wrapperCol={{ span: 20 }}
                              noStyle
                              shouldUpdate={(prevValues, currentValues) =>
                                prevValues.templateCode ||
                                prevValues.conversionTime !==
                                  currentValues.templateCode ||
                                currentValues.conversionTime
                              }
                            >
                              {({ getFieldValue }) => {
                                let template = codeToTemplate(
                                  getFieldValue("templateCode"),
                                  data.Mb,
                                  data.operateType === 2
                                    ? [
                                        "{员工姓名}",
                                        "{晋升岗位}",
                                        "{晋升日期}",
                                        "{签署公司}",
                                      ]
                                    : data.operateType === 3
                                    ? [
                                        "{员工姓名}",
                                        "{调岗岗位}",
                                        "{调岗日期}",
                                        "{签署公司}",
                                      ]
                                    : data.operateType === 4
                                    ? [
                                        "{员工姓名}",
                                        "{降职岗位}",
                                        "{降职日期}",
                                        "{签署公司}",
                                      ]
                                    : [],

                                  [
                                    data.name,
                                    data.postName,
                                    data.conversionTime.split(" ")[0],
                                    data.signedCompanyName,
                                  ]
                                );
                                return (
                                  <div>
                                    <Form.Item
                                      name="templateCode"
                                      label="通知内容"
                                      labelCol={{ span: 4 }}
                                      wrapperCol={{ span: 20 }}
                                      rules={[
                                        {
                                          required: true,
                                          message: "通知内容不能为空",
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
                      </div>
                    )
                  );
                }}
              </Form.Item>
            </Form>
          </div>
        </div>
      </Dialog>
    );
  }
}
TransferDialog.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  data: PropTypes.object,
  onSuccess: PropTypes.func,
};

const open = (props) => {
  Dialog.OpenDialog({}, <TransferDialog {...props} />);
};

export { open };
