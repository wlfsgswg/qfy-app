import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog } from "./../../../../../components";
import { classPrefix } from "./../../../../../const";
import { codeToTemplate } from "./../../../../../utils";
import {
  Row,
  Col,
  Select,
  DatePicker,
  Form,
  message,
  Radio,
  Input,
} from "antd";
import moment from "moment";
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
class InternshipDialog extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      loading: false,
      // 转正日期
      formalDay: "",
      initialValues: {
        conversionTime: this.props.data.conversionTime
          ? moment(this.props.data.conversionTime)
          : null,
        mobilephone: this.props.data.mobilephone
          ? this.props.data.mobilephone
          : null,
        memberEmail: this.props.data.memberEmail
          ? this.props.data.memberEmail
          : "",
        email: this.props.data.email,
        isSend: 1,
        sendType: 1,
        mailTheme: "转全职",
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
      mailTheme,
      memberEmail,
      mobilephone,
      sendType,
      isSend,
      status,
      targetDate,
      templateCode,
    } = summit;
    // 获取模板字符串
    const template = codeToTemplate(
      summit.templateCode,
      data.Zqz,
      [
        "{员工姓名}",
        "{身份证号}",
        "{入职日期}",
        "{部门名称}",
        "{岗位名称}",
        "{签署公司}",
      ],
      [
        data.name,
        data.identityCard,
        data.joinTime.split(" ")[0],
        data.deptName,
        data.postName,
        data.signedCompanyName,
      ]
    );
    // 进行判断
    if (!status || !targetDate) return;
    if (isSend) {
      if (!templateCode) return;
      if (sendType === 1 && !mobilephone) return;
      if (sendType === 2) {
        if (!email || !memberEmail || !mailTheme) return;
      }
    }

    const objData = {
      targetDate: moment(targetDate).format("YYYY-MM-DD"),
      memberId: data.id,
      isSend,
      status,
    };
    if (isSend) {
      objData.content = template;
      objData.sendType = sendType;
    }
    if (sendType === 1) objData.mobilephone = mobilephone;
    if (sendType === 2) {
      objData.mailTheme = mailTheme;
      objData.memberEmail = memberEmail;
    }
    // 调用接口
    this.setState({ loading: true });
    Request.post(`/memberOperate/changePosition`, objData)
      .then((res) => {
        if (res.status === 200) {
          message.success("完成转正");
          this.setState({ loading: false });
          this.props.afterClose();
          this.props.onSuccess();
        }
      })
      .catch(() => this.setState({ loading: false }));
  };

  // 控制实际日期
  onDataChange = (e) => {
    const day = moment(e).format("YYYY-MM-DD");
    this.setState({ formalDay: day });
  };
  render() {
    const { initialValues, loading } = this.state;
    const { afterClose, getContainer, data } = this.props;
    return (
      <Dialog
        title={"办理转正"}
        closable={true}
        afterClose={afterClose}
        getContainer={getContainer}
        width={800}
        onOk={this.handleSummit}
        okButtonProps={{ loading }}
      >
        <div
          className={`${classPrefix}-home-personnel-internship-internshipdialog`}
        >
          <div
            className={`${classPrefix}-home-personnel-internship-internshipdialog-content`}
          >
            <Row>
              <Col span={colSpan}>
                <Row>
                  <Col span={layout.labelCol.span}>
                    <div className="formal-content-top">姓名：</div>
                  </Col>
                  <Col span={layout.wrapperCol.span}>
                    <div className="formal-content-bottom">
                      {data.name && data.name}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Row>
              <Col span={colSpan}>
                <Row>
                  <Col span={layout.labelCol.span}>
                    <div className="formal-content-top">入职日期：</div>
                  </Col>
                  <Col span={layout.wrapperCol.span}>
                    <div className="formal-content-bottom">
                      {data.joinTime && data.joinTime.split(" ")[0]}
                    </div>
                  </Col>
                </Row>
              </Col>
            </Row>
            <Form
              {...layout}
              name="form-messages"
              ref={this.formRef}
              initialValues={initialValues}
            >
              <Row>
                <Col span={colSpan}>
                  <Form.Item
                    name="status"
                    label="员工状态"
                    rules={[
                      {
                        required: true,
                        message: "请选择员工状态",
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
                    >
                      {data.status.length &&
                        data.status.map((it) => {
                          if (it.keyName === "正式" || it.keyName === "试用") {
                            return (
                              <Option value={it.keyValue} key={it.keyValue}>
                                {it.keyName}
                              </Option>
                            );
                          }
                          return undefined;
                        })}
                    </Select>
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={colSpan}>
                  <Form.Item
                    name="targetDate"
                    label="转正日期"
                    rules={[
                      {
                        required: true,
                        message: "请选择转正日期",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={this.onDataChange}
                      disabledDate={(current) =>
                        current && current < moment().subtract(1, "days")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={colSpan}>
                  <Form.Item
                    name="isSend"
                    label="转正通知"
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
                                {data.Zqz.length &&
                                  data.Zqz.map((it) => (
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
                                  data.Zqz,
                                  [
                                    "{员工姓名}",
                                    "{身份证号}",
                                    "{入职日期}",
                                    "{部门名称}",
                                    "{岗位名称}",
                                    "{签署公司}",
                                  ],
                                  [
                                    data.name,
                                    data.identityCard,
                                    data.joinTime.split(" ")[0],
                                    data.deptName,
                                    data.postName,
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
InternshipDialog.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  data: PropTypes.object,
  onSuccess: PropTypes.func,
};

const open = (props) => {
  Dialog.OpenDialog({}, <InternshipDialog {...props} />);
};

export { open };