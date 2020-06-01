import React, { useState, useEffect } from "react";
import { classPrefix } from "./../../../../../../../const";
import {
  Form,
  Row,
  Col,
  Input,
  Button,
  Select,
  DatePicker,
  message,
  Modal,
} from "antd";
import PropTypes from "prop-types";
import { contractType } from "./../type";
import { Dialog } from "./../../../../../../../components";
import { ExclamationCircleOutlined } from "@ant-design/icons";
import "./index.less";
import moment from "moment";
const { Option } = Select;
const colSpan = 24;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};

const Edit = (props) => {
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState({});
  const [form] = Form.useForm();

  useEffect(() => {
    const { type, memberId, companys, ...rest } = props.data;
    // 处理rest字段
    if (JSON.stringify(rest) !== "{}") {
      const { effectiveDate, signedDate, expireDate } = rest;
      rest.effectiveDate = moment(effectiveDate);
      rest.signedDate = moment(signedDate);
      rest.expireDate = moment(expireDate);
    }
    setInitialValues({ ...rest });
  }, [props.data]);

  const onFinish = (values) => {
    // 处理数据
    const {
      contractNo,
      contractType,
      effectiveDate,
      expireDate,
      signedDate,
      signedCompanyId,
    } = values;
    const { memberId } = props.data;
    const data = { signedCompanyId, contractType, memberId };
    data.contractNo = contractNo.trim();
    data.effectiveDate = moment(effectiveDate).format("YYYY-MM-DD");
    data.expireDate = moment(expireDate).format("YYYY-MM-DD");
    data.signedDate = moment(signedDate).format("YYYY-MM-DD");
    // 判断时间=
    if (Date.parse(data.expireDate) < Date.parse(data.effectiveDate))
      return message.error("合同到期日期不能小于生效日期");
    // 确认修改或是保存
    if (props.data.type === "edit") data.id = props.data.id;
    setLoading(true);
    // 请求保存或修改接口
    Request.post(`/memberContractInfo/saveJson`, data)
      .then((res) => {
        if (res.status === 200) {
          setLoading(false);
          message.success(props.data.type === "edit" ? "修改成功" : "添加成功");
          // 此处关闭dialog回调
          props.afterClose();
          props.onSuccess();
        }
      })
      .catch(() => setLoading(false));
  };

  const handleCancle = () => {
    if (props.data.type === "add") {
      Modal.confirm({
        title: "提示",
        icon: <ExclamationCircleOutlined />,
        content: "合同信息还未保存，是否取消？",
        onOk: () => {
          props.afterClose();
        },
      });
    } else {
      props.afterClose();
    }
  };
  const { afterClose, getContainer } = props;
  return (
    <Dialog
      title={props.data.type === "edit" ? "修改合同" : "添加合同"}
      closable={true}
      afterClose={afterClose}
      getContainer={getContainer}
      width={430}
      footer={null}
    >
      <div
        className={`${classPrefix}-home-personnel-roster-files-contract-edit`}
      >
        <div
          className={`${classPrefix}-home-personnel-roster-files-contract-edit-content`}
        >
          <Form
            {...layout}
            form={form}
            name="roster-add"
            onFinish={onFinish}
            initialValues={initialValues}
          >
            <div className="card-content">
              <Row>
                <Col span={colSpan}>
                  <Form.Item
                    name="signedCompanyId"
                    label="签署公司"
                    rules={[
                      {
                        required: true,
                        message: "请选择签署公司",
                      },
                    ]}
                  >
                    <Select
                      placeholder="请选择签署公司"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                      allowClear
                    >
                      {props.data.companys.length &&
                        props.data.companys.map((op) => (
                          <Option value={op.id} key={op.id}>
                            {op.company}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    name="contractType"
                    label="合同类型"
                    rules={[
                      {
                        required: true,
                        message: "请选择合同类型",
                      },
                    ]}
                  >
                    <Select
                      placeholder="请选择合同类型"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                      allowClear
                    >
                      {contractType.length !== 0 &&
                        contractType.map((it) => {
                          return (
                            <Option value={it.value} key={it.value}>
                              {it.title}
                            </Option>
                          );
                        })}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    name="contractNo"
                    label="合同编号"
                    rules={[
                      {
                        required: true,
                      },
                    ]}
                  >
                    <Input placeholder={`请输入合同编号`} />
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    name="signedDate"
                    label="签署日期"
                    rules={[
                      {
                        required: true,
                        message: "请选择签署日期",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    name="effectiveDate"
                    label="生效日期"
                    rules={[
                      {
                        required: true,
                        message: "请选择生效日期",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    name="expireDate"
                    label="到期日期"
                    rules={[
                      {
                        required: true,
                        message: "请选择到期日期",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
              </Row>
            </div>

            <div style={{ textAlign: "right" }}>
              <span className="m-r-10">
                <Button onClick={handleCancle}>取消</Button>
              </span>
              <span>
                <Button type="primary" htmlType="submit" loading={loading}>
                  保存
                </Button>
              </span>
            </div>
          </Form>
        </div>
      </div>
    </Dialog>
  );
};
Edit.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  onSuccess: PropTypes.func,
  data: PropTypes.object,
};

const open = (props) => {
  Dialog.OpenDialog({}, <Edit {...props} />);
};

export { open };
