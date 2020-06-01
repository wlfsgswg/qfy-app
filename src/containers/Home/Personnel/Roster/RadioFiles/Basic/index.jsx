import React from "react";
import { classPrefix } from "./../../../../../../const";
import moment from "moment";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import "./index.less";

import {
  Spin,
  Form,
  Button,
  Row,
  Col,
  DatePicker,
  Input,
  Select,
  TreeSelect,
  message,
} from "antd";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const colSpan = 12;
const { TreeNode } = TreeSelect;

// 组件
const FormItem = (props) => {
  const { obj, children, ...rest } = props;
  return JSON.stringify(obj) === "{}" ? (
    <Form.Item {...rest}>{children}</Form.Item>
  ) : (
    <Form.Item {...rest} rules={[obj]}>
      {children}
    </Form.Item>
  );
};
class Basic extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      data: [],
      loading: false,
      post: [],
      depart: [],
      level: [],
      job: [],
      dataType1: [],
      dataType2: [],
      btnLoading: false,
      // 员工信息
      initialValues: {},
      // 员工id
      id: "",
      saveBool: false,
    };
  }
  componentDidMount() {
    const { match } = this.props;
    const id = match && match.params && match.params.id && match.params.id;
    this.setState({ id });
    this.handleGetDetail(id);
    this.handleGetPost();
    this.handleGetDepart();
    this.handleGetLevel();
    this.handleGetJob();
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  // 获取员工信息详情
  handleGetDetail(id) {
    const data = { id };
    if (this.props.location.search) data.infoType = "2";
    Request.post(`/member/infoJson`, { ...data }).then((res) => {
      if (res.status === 200) {
        // 梳理默认值 只有先加载默认值再加载form才能触发form有值
        // 需要整理时间戳 添加员工select选择值是字符串，获取详情会得到number
        for (let key in res.data) {
          let it = res.data[key];
          if (typeof it === "number" && JSON.stringify(it).length > 10) {
            res.data[key] = moment(it);
          }
          if (it === "") res.data[key] = undefined;
        }
        this.setState({ initialValues: { ...res.data } }, () => {
          this.handleGetBasicData();
        });
      }
    });
  }
  // 获取岗位数组
  handleGetPost = () => {
    Request.post(`/postManage/listJson`).then((res) => {
      if (res.status === 200) this.setState({ post: res.data.list });
    });
  };
  // 获取部门树状结构
  handleGetDepart = () => {
    Request.post(`/memberDepart/getDepartTree`).then((res) => {
      if (res.status === 200) {
        this.setState({ depart: res.data });
      }
    });
  };
  // 轮询
  handlePoll = (e) => {
    return (
      <React.Fragment>
        {e.length &&
          e.map((item, i) => {
            return (
              <TreeNode
                value={item.id ? item.id : i}
                key={item.id ? item.id : i}
                title={item.text}
                disabled={!item.id}
              >
                {item.children &&
                  item.children.length &&
                  this.handlePoll(item.children)}
              </TreeNode>
            );
          })}
      </React.Fragment>
    );
  };

  // 获取岗位职级数组
  handleGetLevel = () => {
    Request.post(`/sysPositionLevel/listJson`, {}).then((res) => {
      if (res.status === 200) {
        this.setState({ level: res.data.list });
      }
    });
  };
  // 列表数据
  handleGetBasicData = () => {
    // type  字段模块类型：1：基本信息  2：岗位信息 3.自定义
    // dataType 确定组件类型：1：文本类型，2:日期类型，3:单选类型，4:多选类型.
    this.setState({ loading: true });
    Request.post(`/member/getSysSetFieldByModule`, {})
      .then((res) => {
        if (res.status === 200) {
          // 处理数据 根据type把模块分为三个
          const [basic, post, self] = [[], [], []];
          res.data.length &&
            res.data.map((it) => {
              switch (it.type) {
                case 1:
                  basic.push(it);
                  break;
                case 2:
                  post.push(it);
                  break;
                case 3:
                  self.push(it);
                  break;
                default:
                  break;
              }
              it.disabled = true;
              return undefined;
            });
          const data = [basic, post, self];
          // 处理数据 根据dataType 确定文本类型，日期类型，以便提交时进行数据处理
          const [dataType1, dataType2] = [[], []];
          res.data.length &&
            res.data.map((item) => {
              if (item.dataType === 1)
                dataType1.push({
                  fieldCode: item.fieldCode,
                  fieldFormat: item.fieldFormat,
                });
              if (item.dataType === 2)
                dataType2.push({
                  fieldCode: item.fieldCode,
                  fieldFormat: item.fieldFormat,
                });
              return undefined;
            });
          this.setState({ data, loading: false, dataType1, dataType2 });
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  // 获取职务数组
  handleGetJob = () => {
    Request.post(`/sysDuty/listJson`, {}).then((res) => {
      if (res.status === 200) {
        this.setState({ job: res.data.list });
      }
    });
  };

  onFinish = (values) => {
    const { dataType1, dataType2 } = this.state;
    // 处理输入框去掉前后空格 可以根据接口返回的dataType=1确定其为文本组件
    dataType1.map((item) => {
      if (
        values[item.fieldCode] !== undefined &&
        values[item.fieldCode] !== null &&
        values[item.fieldCode] !== "" &&
        typeof values[item.fieldCode] === "string"
      )
        values[item.fieldCode] = values[item.fieldCode].trim();
      return undefined;
    });
    // 处理时间格式化时间 需要处理的日期字段 可以根据接口返回的dataType=2确定其为时间组件
    dataType2.map((item) => {
      if (values[item.fieldCode] !== undefined && values[item.fieldCode] !== "")
        values[item.fieldCode] =
          item.fieldFormat === 3
            ? moment(values[item.fieldCode]).format("YYYY")
            : item.fieldFormat === 2
            ? moment(values[item.fieldCode]).format("YYYY-MM")
            : moment(values[item.fieldCode]).format("YYYY-MM-DD");
      return undefined;
    });
    const obj = {};
    for (let item in values) {
      if (values[item] !== undefined && values[item] !== "")
        obj[item] = values[item];
    }
    // 继续判断不符合不进行接口请求
    if (obj.status && obj.status === "2" && obj.conversionTime) {
      if (Date.parse(new Date()) < Date.parse(obj.conversionTime))
        return message.error("转正日期不能晚于今日");
    }
    if (obj.conversionTime && obj.joinTime) {
      if (Date.parse(obj.conversionTime) < Date.parse(obj.joinTime))
        return message.error("转正日期不能在入职日期之前");
    }
    // 提交
    this.onSummit(obj);
  };
  // 提交数据
  onSummit = (obj) => {
    const { id, saveBool } = this.state;
    if (!saveBool) return;
    const { preAxiosUrl, preUrl } = this.props;
    this.setState({ btnLoading: true });
    Request.post(`${preAxiosUrl ? preAxiosUrl : "/member/updateJson"}`, {
      ...obj,
      id,
    })
      .then((res) => {
        if (res.status === 200) {
          message.success("修改成功");
          this.setState({ btnLoading: false });
          if (preUrl) this.props.history.push(preUrl);
        }
      })
      .catch(() => this.setState({ btnLoading: false }));
  };
  //控制值
  onGenderChange = (value) => {
    if (value === 2 || value === 3 || value === 5) {
      this.formRef.current.setFieldsValue({
        status: undefined,
      });
    }
  };
  render() {
    const {
      data,
      loading,
      post,
      depart,
      level,
      btnLoading,
      initialValues,
      job,
    } = this.state;

    return (
      <div className={`${classPrefix}-home-personnel-roster-add`}>
        <div className={`${classPrefix}-home-personnel-roster-add-content`}>
          <div className="t-a-r">
            <Button
              type="primary"
              onClick={() => {
                const { data } = this.state;
                data.map((item) => {
                  item.length !== 0 &&
                    item.map((it) => {
                      it.disabled = false;
                      return undefined;
                    });
                  return undefined;
                });
                this.setState({ data, saveBool: true });
              }}
            >
              修改
            </Button>
          </div>
          <Spin spinning={loading}>
            {data.length !== 0 ? (
              <Form
                {...layout}
                name="roster-add"
                initialValues={initialValues}
                onFinish={this.onFinish}
                ref={this.formRef}
              >
                <div style={{ backgroundColor: "#fff" }}>
                  {data.length ? (
                    <div>
                      {data.map((it, i) => {
                        return (
                          it.length !== 0 && (
                            <div className="card" key={i}>
                              <div className="card-top">
                                {`${
                                  it[0].type === 1
                                    ? "基本信息"
                                    : it[0].type === 2
                                    ? "岗位信息"
                                    : "自定义"
                                }`}
                              </div>
                              <div className="card-content">
                                <Row>
                                  {it.map((item, i) => {
                                    // 整理校验规则
                                    const checkRuleObj = item.checkRule
                                      ? JSON.parse(item.checkRule)
                                      : "";

                                    const obj = {};
                                    if (item.isRequired)
                                      obj.required = item.isRequired;
                                    if (item.checkDesc)
                                      obj.message = item.checkDesc;
                                    if (checkRuleObj && checkRuleObj.rule)
                                      obj.pattern = new RegExp(
                                        checkRuleObj.rule
                                      );

                                    return (
                                      <Col span={colSpan} key={i}>
                                        {item.fieldCode === "memberType" ? (
                                          <FormItem
                                            name={[item.fieldCode]}
                                            label={item.fieldName}
                                            obj={obj}
                                          >
                                            <Select
                                              placeholder="请选择员工类型"
                                              filterOption={(input, option) =>
                                                option.children
                                                  .toLowerCase()
                                                  .indexOf(
                                                    input.toLowerCase()
                                                  ) >= 0
                                              }
                                              showSearch
                                              allowClear
                                              onChange={this.onGenderChange}
                                              disabled={item.disabled}
                                            >
                                              {item.options.length &&
                                                item.options.map((op) => (
                                                  <Option
                                                    value={op.optionValue - 0}
                                                    key={op.optionValue - 0}
                                                  >
                                                    {op.optionName}
                                                  </Option>
                                                ))}
                                            </Select>
                                          </FormItem>
                                        ) : item.fieldCode === "status" ? (
                                          <FormItem
                                            noStyle
                                            shouldUpdate={(
                                              prevValues,
                                              currentValues
                                            ) =>
                                              prevValues.memberType !==
                                              currentValues.memberType
                                            }
                                          >
                                            {({ getFieldValue }) => {
                                              return (
                                                <div>
                                                  {getFieldValue(
                                                    "memberType"
                                                  ) === 2 ||
                                                  getFieldValue(
                                                    "memberType"
                                                  ) === 3 ||
                                                  getFieldValue(
                                                    "memberType"
                                                  ) === 5 ? (
                                                    <Form.Item
                                                      name={["status"]}
                                                      label="员工状态"
                                                    >
                                                      <Select
                                                        placeholder="员工状态不可选"
                                                        disabled={true}
                                                      ></Select>
                                                    </Form.Item>
                                                  ) : (
                                                    <Form.Item
                                                      name={["status"]}
                                                      label="员工状态"
                                                      rules={[{ ...obj }]}
                                                    >
                                                      <Select
                                                        placeholder="请选择员工状态"
                                                        filterOption={(
                                                          input,
                                                          option
                                                        ) =>
                                                          option.children
                                                            .toLowerCase()
                                                            .indexOf(
                                                              input.toLowerCase()
                                                            ) >= 0
                                                        }
                                                        showSearch
                                                        allowClear
                                                        disabled={item.disabled}
                                                      >
                                                        {item.options.length &&
                                                          item.options.map(
                                                            (op) => (
                                                              <Option
                                                                value={
                                                                  op.optionValue -
                                                                  0
                                                                }
                                                                key={
                                                                  op.optionValue -
                                                                  0
                                                                }
                                                              >
                                                                {op.optionName}
                                                              </Option>
                                                            )
                                                          )}
                                                      </Select>
                                                    </Form.Item>
                                                  )}
                                                </div>
                                              );
                                            }}
                                          </FormItem>
                                        ) : (
                                          <FormItem
                                            name={[item.fieldCode]}
                                            label={item.fieldName}
                                            obj={obj}
                                          >
                                            {/*  dataType 确定组件类型：1：文本类型，2:日期类型，3:单选类型，4:多选类型. */}
                                            {/* fieldFormat; // dataType为2时  1：年月日 2：年月 3：年  dataType为3时 1：接口  2：码表 */}

                                            {item.dataType === 1 ? (
                                              <Input
                                                placeholder={`请输入${item.fieldName}`}
                                                type={
                                                  checkRuleObj &&
                                                  checkRuleObj.max
                                                    ? "number"
                                                    : ""
                                                }
                                                maxLength={
                                                  checkRuleObj &&
                                                  checkRuleObj.length &&
                                                  checkRuleObj.length
                                                }
                                                disabled={item.disabled}
                                              />
                                            ) : item.dataType === 2 ? (
                                              <DatePicker
                                                style={{ width: "100%" }}
                                                picker={
                                                  item.fieldFormat === 3
                                                    ? "year"
                                                    : item.fieldFormat === 2
                                                    ? "month"
                                                    : "date"
                                                }
                                                disabled={item.disabled}
                                              />
                                            ) : item.dataType === 3 ? (
                                              item.fieldCode ===
                                              "department" ? (
                                                <TreeSelect
                                                  treeDefaultExpandAll
                                                  showSearch
                                                  placeholder="请选择"
                                                  allowClear
                                                  disabled={item.disabled}
                                                >
                                                  {depart.length &&
                                                    this.handlePoll(depart)}
                                                </TreeSelect>
                                              ) : (
                                                <Select
                                                  placeholder="请选择"
                                                  filterOption={(
                                                    input,
                                                    option
                                                  ) =>
                                                    option.children
                                                      .toLowerCase()
                                                      .indexOf(
                                                        input.toLowerCase()
                                                      ) >= 0
                                                  }
                                                  showSearch
                                                  allowClear
                                                  disabled={item.disabled}
                                                >
                                                  {item.fieldCode ===
                                                    "postId" &&
                                                    post.length &&
                                                    post.map((op) => (
                                                      <Option
                                                        value={op.id}
                                                        key={op.id}
                                                      >
                                                        {op.postName}
                                                      </Option>
                                                    ))}

                                                  {item.fieldCode ===
                                                    "dutyId" &&
                                                    job.length &&
                                                    job.map((op) => (
                                                      <Option
                                                        value={op.dutyId}
                                                        key={op.dutyId}
                                                      >
                                                        {op.dutyName}
                                                      </Option>
                                                    ))}
                                                  {item.fieldCode ===
                                                    "postLevelId" &&
                                                    level.length &&
                                                    level.map((op) => (
                                                      <Option
                                                        value={op.id}
                                                        key={op.id}
                                                      >
                                                        {op.positionName}
                                                      </Option>
                                                    ))}

                                                  {item.fieldCode !==
                                                    "postId" &&
                                                    item.fieldCode !==
                                                      "postLevelId" &&
                                                    item.fieldCode !==
                                                      "dutyId" &&
                                                    item.options.length &&
                                                    item.options.map((op) => (
                                                      <Option
                                                        value={
                                                          item.fieldCode ===
                                                          "weedingStatus"
                                                            ? op.optionValue
                                                            : op.optionValue - 0
                                                        }
                                                        key={
                                                          item.fieldCode ===
                                                          "weedingStatus"
                                                            ? op.optionValue
                                                            : op.optionValue - 0
                                                        }
                                                      >
                                                        {op.optionName}
                                                      </Option>
                                                    ))}
                                                </Select>
                                              )
                                            ) : (
                                              <Select
                                                mode="multiple"
                                                placeholder="请选择"
                                                filterOption={(input, option) =>
                                                  option.children
                                                    .toLowerCase()
                                                    .indexOf(
                                                      input.toLowerCase()
                                                    ) >= 0
                                                }
                                                showSearch
                                                allowClear
                                                disabled={item.disabled}
                                              >
                                                {item.options.length &&
                                                  item.options.map((op) => (
                                                    <Option
                                                      value={op.optionValue}
                                                      key={op.optionValue}
                                                    >
                                                      {op.optionName}
                                                    </Option>
                                                  ))}
                                              </Select>
                                            )}
                                          </FormItem>
                                        )}
                                      </Col>
                                    );
                                  })}
                                </Row>
                              </div>
                            </div>
                          )
                        );
                      })}
                    </div>
                  ) : (
                    <div style={{ minHeight: "400px" }}></div>
                  )}
                </div>
                <div className="clearfix form-bottom">
                  <div className="r-right" style={{ paddingRight: "20px" }}>
                    <Button
                      type="primary"
                      htmlType="submit"
                      loading={btnLoading}
                    >
                      保存
                    </Button>
                  </div>
                </div>
              </Form>
            ) : (
              <div style={{ minHeight: "500px" }}></div>
            )}
          </Spin>
        </div>
      </div>
    );
  }
}

Basic.propTypes = {
  match: PropTypes.object,
};

export default withRouter(Basic);
