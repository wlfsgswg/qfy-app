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
  Upload,
  Button,
  message,
  Radio,
  Input,
} from "antd";
import moment from "moment";
import { UploadOutlined } from "@ant-design/icons";
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
class FormalDialog extends Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      loading: false,
      fileList: [],
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
    const { formalDay } = this.state;
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
      photoUrl,
      sendType,
      templateCode,
      conversionTime,
      mobilephone,
    } = summit;
    // 进行判断
    if (isSend) {
      if (!templateCode || !conversionTime) return;
      if (sendType === 1 && !mobilephone) return;
      if (sendType === 2) {
        if (!email || !memberEmail || !mailTheme) return;
      }
    } else {
      if (!conversionTime) return;
    }
    // 获取模板字符串
    const template = codeToTemplate(
      summit.templateCode,
      data.Zt,
      ["{员工姓名}", "{岗位名称}", "{转正日期}", "{签署公司}"],
      [
        data.name,
        data.postName,
        formalDay ? formalDay : data.conversionTime.split(" ")[0],
        data.signedCompanyName,
      ]
    );
    const objData = {
      operateType: 1,
      targetDate: moment(conversionTime).format("YYYY-MM-DD"),
      memberId: data.id,
      isSend,
    };
    if (isSend) {
      objData.content = template;
      objData.sendType = sendType;
    }
    if (photoUrl && photoUrl.length)
      objData.photoUrl = photoUrl[0].response.fileUrl;
    if (sendType === 1) objData.mobilephone = mobilephone;
    if (sendType === 2) {
      objData.mailTheme = mailTheme;
      objData.memberEmail = memberEmail;
    }
    // 调用接口
    this.setState({ loading: true });
    Request.post(`/memberOperate/extendedProbation`, objData)
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

  // 上传开始前做一些限制
  beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error("单个文件限制小于20M!");
    }
    return isLt2M;
  };
  // 正在上传
  normFile = (e) => {
    const { file } = e;
    if (file.status === "uploading") this.setState({ loading: true });
    if (file.status === "done" || file.status === "error")
      this.setState({ loading: false });
    if (Array.isArray(e)) return e;
    this.setState({ fileList: e.fileList });
    return e && e.fileList;
  };

  // 控制实际日期
  onDataChange = (e) => {
    const day = moment(e).format("YYYY-MM-DD");
    this.setState({ formalDay: day });
  };
  render() {
    const { initialValues, loading, fileList } = this.state;
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
        <div className={`${classPrefix}-home-personnel-formal-formaldialog`}>
          <div
            className={`${classPrefix}-home-personnel-formal-formaldialog-content`}
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
            <Row>
              <Col span={colSpan}>
                <Row>
                  <Col span={layout.labelCol.span}>
                    <div className="formal-content-top">计划转正日期：</div>
                  </Col>
                  <Col span={layout.wrapperCol.span}>
                    <div className="formal-content-bottom">
                      {data.conversionTime && data.conversionTime.split(" ")[0]}
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
                    name="conversionTime"
                    label="实际转正日期"
                    rules={[
                      {
                        required: true,
                        message: "请选择实际转正日期",
                      },
                    ]}
                  >
                    <DatePicker
                      style={{ width: "100%" }}
                      onChange={this.onDataChange}
                      disabledDate={(current) =>
                        current &&
                        current >
                          moment(data.conversionTime && data.conversionTime)
                            .add(-1)
                            .endOf("day")
                      }
                    />
                  </Form.Item>
                </Col>
              </Row>
              <Row>
                <Col span={colSpan}>
                  <Form.Item
                    name="photoUrl"
                    label="转正申请表"
                    valuePropName="fileList"
                    getValueFromEvent={this.normFile}
                  >
                    <Upload
                      accept=".jpj,.jpeg,.png,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip"
                      action="/fileUpload/file/upload"
                      data={{ type: 2 }}
                      beforeUpload={this.beforeUpload}
                      listType="picture"
                    >
                      {fileList.length === 0 && (
                        <Button title="支持.jpj,.jpeg,.png,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip类型文件，20M以内">
                          <UploadOutlined /> 点击上传
                        </Button>
                      )}
                    </Upload>
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
                                {data.Zt.length &&
                                  data.Zt.map((it) => (
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
                                const { formalDay } = this.state;
                                let template = codeToTemplate(
                                  getFieldValue("templateCode"),
                                  data.Zt,
                                  [
                                    "{员工姓名}",
                                    "{岗位名称}",
                                    "{转正日期}",
                                    "{签署公司}",
                                  ],
                                  [
                                    data.name,
                                    data.postName,
                                    formalDay
                                      ? formalDay
                                      : data.conversionTime.split(" ")[0],
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
FormalDialog.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  data: PropTypes.object,
  onSuccess: PropTypes.func,
};

const open = (props) => {
  Dialog.OpenDialog({}, <FormalDialog {...props} />);
};

export { open };
