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
  const [highSearch, setHighSearch] = useState(false);
  const [currentValue, setCurrentValue] = useState("name");
  // 岗位
  const [post, setPost] = useState([]);
  // 部门
  const [depart, setDepart] = useState([]);
  // 级别
  const [level, setLevel] = useState([]);
  // 签署公司
  const [companys, setCompanys] = useState([]);
  // 婚姻状况
  const [maritalstatus, setMaritalstatus] = useState([]);
  // 学历
  const [education, setEducation] = useState([]);
  const [form] = Form.useForm();

  // 初始渲染
  useEffect(() => {
    let unmounted = false;
    handleGetPost(unmounted);
    handleGetDepart(unmounted);
    handleGetLevel(unmounted);
    handleGetCompanys(unmounted);
    return () => {
      unmounted = true;
    };
  }, []);
  // 获取码表
  useEffect(() => {
    let unmounted = false;
    const { maritalstatus, education } = props.codeTable;
    if (!unmounted) {
      setMaritalstatus(maritalstatus);
      setEducation(education);
    }
    return () => {
      unmounted = true;
    };
  }, [props.codeTable]);

  // 获取岗位数组
  const handleGetPost = (bol) => {
    Request.post(`/postManage/listJson`).then((res) => {
      if (!bol && res.status === 200) {
        setPost(res.data && res.data.list && res.data.list);
      }
    });
  };

  // 获取部门树状结构
  const handleGetDepart = (bol) => {
    Request.post(`/memberDepart/getDepartTree`).then((res) => {
      if (!bol && res.status === 200) {
        setDepart(res.data && res.data);
      }
    });
  };

  // 获取岗位职级数组
  const handleGetLevel = (bol) => {
    Request.post(`/sysPositionLevel/listJson`, {}).then((res) => {
      if (!bol && res.status === 200) {
        setLevel(res.data && res.data.list && res.data.list);
      }
    });
  };

  // 查询公司列表
  const handleGetCompanys = (bol) => {
    Request.post(`/company/listSelectJson`, {}).then((res) => {
      if (!bol && res.status === 200) {
        setCompanys(res.data && res.data);
      }
    });
  };

  // 提交
  const onFinish = (values) => {
    const obj = {};
    for (let item in values) {
      if (values[item] !== undefined && values[item] !== "")
        obj[item] = values[item];
    }
    // 处理choose
    if (obj.choose) {
      obj[currentValue] = obj.choose;
      delete obj.choose;
    }
    // 处理时间 需要处理的日期字段
    // joinTimeArr dimissionTimeArr joinWorkTimeArr conversionTimeArr contractExpireTimeArr contracteffectiveTimeArr retireTimeArr
    const dateArr = [
      "joinTimeArr",
      "dimissionTimeArr",
      "joinWorkTimeArr",
      "conversionTimeArr",
      "contractExpireTimeArr",
      "contracteffectiveTimeArr",
      "retireTimeArr",
    ];
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

  // 轮询
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
    <div className={`${classPrefix}-home-personnel-roster-search`}>
      <div className={`${classPrefix}-home-personnel-roster-search-content`}>
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
                  <Option value="" key="all">
                    全部
                  </Option>
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
              <Form.Item name={["joinTimeArr"]} label="入职日期">
                <RangePicker style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            {highSearch && (
              <React.Fragment>
                <Col span={colSpan}>
                  <Form.Item name={["dimissionTimeArr"]} label="离职日期">
                    <RangePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item name={["joinWorkTimeArr"]} label="参加工作时间">
                    <RangePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item name={["postLevelId"]} label="岗位职级">
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
                      <Option value="">全部</Option>
                      {level.length &&
                        level.map((it) => (
                          <Option value={it.id} key={it.id}>
                            {it.positionName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item name={["conversionTimeArr"]} label="转正日期">
                    <RangePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item name={["retireTimeArr"]} label="退休日期">
                    <RangePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item name={["degree"]} label="学历">
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
                      {education.length &&
                        education.map((it) => (
                          <Option value={it.keyValue} key={it.keyValue}>
                            {it.keyName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    name={["contractExpireTimeArr"]}
                    label="合同到期日期"
                  >
                    <RangePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    name={["contracteffectiveTimeArr"]}
                    label="合同生效日期"
                  >
                    <RangePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item name={["signedCompanyId"]} label="签署公司">
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
                      <Option value="">全部</Option>
                      {companys.length &&
                        companys.map((it) => (
                          <Option value={it.id} key={it.id}>
                            {it.company}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item name={["weedingStatus"]} label="婚姻状况">
                    <Select placeholder="请选择">
                      {maritalstatus.length &&
                        maritalstatus.map((it) => (
                          <Option value={it.keyValue} key={it.keyValue}>
                            {it.keyName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item name={["identityCard"]} label="身份证号">
                    <Input placeholder="请输入身份证号" />
                  </Form.Item>
                </Col>
              </React.Fragment>
            )}
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
            <div className="l-left">
              <Button
                onClick={() => {
                  setHighSearch(!highSearch);
                }}
              >
                {!highSearch ? "高级搜索" : "取消高级搜索"}
              </Button>
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
};

const SearchStore = connect(mapStateToProps)(Search);

export default SearchStore;
