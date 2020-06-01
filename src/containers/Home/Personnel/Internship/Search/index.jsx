import React, { useState, useEffect } from "react";
import { classPrefix } from "./../../../../../const";
import PropTypes from "prop-types";
import "./index.less";
import {
  Form,
  Input,
  Button,
  Row,
  Col,
  Select,
  DatePicker,
  TreeSelect,
} from "antd";
import moment from "moment";
import { connect } from "react-redux";

const { TreeNode } = TreeSelect;
const { Option } = Select;
const { RangePicker } = DatePicker;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const colSpan = 8;

const Search = (props) => {
  const [currentValue, setCurrentValue] = useState("name");
  // 岗位
  const [post, setPost] = useState([]);
  // 部门
  const [depart, setDepart] = useState([]);
  const [sex, setSex] = useState([]);
  const [memberType, setMemberType] = useState([]);
  const [form] = Form.useForm();

  // 初始渲染
  useEffect(() => {
    setPost(props.post);
  }, [props.post]);

  useEffect(() => {
    setDepart(props.depart);
  }, [props.depart]);
  // 处理memberType和sex
  useEffect(() => {
    setSex(props.codeTable.sex ? props.codeTable.sex : []);
    setMemberType(props.codeTable.memberType ? props.codeTable.memberType : []);
  }, [props.codeTable]);
  // 提交
  const onFinish = (values) => {
    const obj = {};
    for (let item in values) {
      if (values[item]) obj[item] = values[item];
    }
    // 处理choose
    if (obj.choose) {
      obj[currentValue] = obj.choose;
      delete obj.choose;
    }
    // 处理时间 需要处理的日期字段
    // joinTimeArr dimissionTimeArr joinWorkTimeArr conversionTimeArr contractExpireTimeArr contracteffectiveTimeArr retireTimeArr
    const dateArr = ["joinTimeArr"];
    for (let i = 0; i < dateArr.length; i++) {
      const key = dateArr[i];
      if (obj[key])
        obj[key] = [
          moment(obj[key][0]).format("YYYY-MM-DD"),
          moment(obj[key][1]).format("YYYY-MM-DD"),
        ];
    }
    // 处理输入框
    if (obj.identityCard) obj.identityCard = obj.identityCard.trim();
    // 回调返回给父组件
    props.onSummit(obj);
  };

  //   重置
  const handleReset = () => {
    form.resetFields();
    props.onSummit({});
  };

  // 轮询部门
  const handlePoll = (e) => {
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
                  handlePoll(item.children)}
              </TreeNode>
            );
          })}
      </React.Fragment>
    );
  };
  return (
    <div className={`${classPrefix}-home-personnel-internship-search`}>
      <div
        className={`${classPrefix}-home-personnel-internship-search-content`}
      >
        <Form {...layout} name="nest-messages" onFinish={onFinish} form={form}>
          <Row>
            <Col span={colSpan}>
              <Form.Item
                name={["choose"]}
                rules={[
                  currentValue !== "name"
                    ? {
                        pattern: /^1[3456789]\d{9}$/,
                        message: "请输入正确手机号码！",
                      }
                    : {
                        pattern: /^[\u4e00-\u9fa5]+$/gi,
                        message: "请输入正确格式！",
                      },
                ]}
                label={
                  <Select
                    value={currentValue}
                    onSelect={(value) => {
                      setCurrentValue(value);
                    }}
                    style={{ width: "84px" }}
                  >
                    <Select.Option key="name">姓名</Select.Option>
                    <Select.Option key="mobilephone">手机号</Select.Option>
                  </Select>
                }
              >
                {currentValue === "name" ? (
                  <Input placeholder="请输入员工姓名" />
                ) : (
                  <Input placeholder="请输入员工手机号码" type="number" />
                )}
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item name={["department"]} label="部门" rules={[{}]}>
                <TreeSelect
                  treeDefaultExpandAll
                  showSearch
                  placeholder="请选择"
                  allowClear
                >
                  {depart.length && handlePoll(depart)}
                </TreeSelect>
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item name={["postId"]} label="岗位" rules={[{}]}>
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
                  {post.length &&
                    post.map((it) => (
                      <Option value={it.id} key={it.id}>
                        {it.postName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item name={["sex"]} label="性别" rules={[{}]}>
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
                  {sex.length &&
                    sex.map((it) => (
                      <Option value={it.keyValue} key={it.keyValue}>
                        {it.keyName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item name={["memberType"]} label="员工类型" rules={[{}]}>
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
                  {memberType.length &&
                    memberType.map((it) => {
                      if (it.keyName === "实习" || it.keyName === "兼职") {
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
            <Col span={colSpan}>
              <Form.Item name={["joinTimeArr"]} label="入职日期">
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <div className="clearfix">
            <div className="l-left p-r-10">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </div>
            <div className="l-left p-r-10">
              <Button onClick={handleReset}>重置</Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};
const mapStateToProps = (state) => {
  return {
    codeTable: state.code,
  };
};

Search.propTypes = {
  onSummit: PropTypes.func,
  codeTable: PropTypes.object,
  post: PropTypes.array,
  depart: PropTypes.array,
};

const SearchStore = connect(mapStateToProps)(Search);

export default SearchStore;
