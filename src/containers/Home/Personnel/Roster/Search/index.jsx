import React from "react";
import { classPrefix } from "./../../../../../const";
// import PropTypes from "prop-types";
import "./index.less";
import { Form, Input, Button, Row, Col, Select, DatePicker } from "antd";

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
const Demo = () => (
  <React.Fragment>
    <Col span={colSpan}>
      <Form.Item name={["a"]} label="离职日期">
        <RangePicker style={{ width: "100%" }} />
      </Form.Item>
    </Col>
    <Col span={colSpan}>
      <Form.Item name={["b"]} label="参加工作时间">
        <RangePicker style={{ width: "100%" }} />
      </Form.Item>
    </Col>
    <Col span={colSpan}>
      <Form.Item name={["c"]} label="职级">
        <Select placeholder="请选择">
          <Option value="all">全部</Option>
          <Option value="11">中级</Option>
          <Option value="12">高级</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col span={colSpan}>
      <Form.Item name={["a1"]} label="转正日期">
        <RangePicker style={{ width: "100%" }} />
      </Form.Item>
    </Col>
    <Col span={colSpan}>
      <Form.Item name={["b1"]} label="退休日期">
        <RangePicker style={{ width: "100%" }} />
      </Form.Item>
    </Col>
    <Col span={colSpan}>
      <Form.Item name={["c1"]} label="学历">
        <Select placeholder="请选择">
          <Option value="all">全部</Option>
          <Option value="11">本科</Option>
          <Option value="12">大专</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col span={colSpan}>
      <Form.Item name={["a2"]} label="合同到期日期">
        <RangePicker style={{ width: "100%" }} />
      </Form.Item>
    </Col>
    <Col span={colSpan}>
      <Form.Item name={["b2"]} label="合同生效日期">
        <RangePicker style={{ width: "100%" }} />
      </Form.Item>
    </Col>
    <Col span={colSpan}>
      <Form.Item name={["c2"]} label="签署公司">
        <Select placeholder="请选择">
          <Option value="11">阿里巴巴</Option>
          <Option value="12">百度</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col span={colSpan}>
      <Form.Item name={["c2-2"]} label="婚姻状况">
        <Select placeholder="请选择">
          <Option value="all">已婚</Option>
          <Option value="11">未婚</Option>
          <Option value="12">离异</Option>
        </Select>
      </Form.Item>
    </Col>
    <Col span={colSpan}>
      <Form.Item name={["c2-2-2"]} label="身份证号">
        <Input placeholder="请输入身份证号" />
      </Form.Item>
    </Col>
  </React.Fragment>
);
class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchObj: {},
      // 默认选中name
      currentValue: "name",
      highSearch: false,
    };
  }

  onFinish = (values) => {
    console.log(values);
  };

  //   重置
  handleReset = () => {};

  render() {
    const { searchObj, currentValue, highSearch } = this.state;
    return (
      <div className={`${classPrefix}-home-personnel-roster-search`}>
        <div className={`${classPrefix}-home-personnel-roster-search-content`}>
          <Form
            {...layout}
            name="nest-messages"
            onFinish={this.onFinish}
            initialValues={{
              ...searchObj,
            }}
          >
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
                      : {},
                  ]}
                  label={
                    <Select
                      value={currentValue}
                      onSelect={(value) =>
                        this.setState({ currentValue: value })
                      }
                      style={{ width: "84px" }}
                    >
                      <Select.Option key="name">姓名</Select.Option>
                      <Select.Option key="tel">手机号</Select.Option>
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
                <Form.Item name={["bm"]} label="部门" rules={[{}]}>
                  <Select placeholder="请选择">
                    <Option value="all">全部部门</Option>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={colSpan}>
                <Form.Item name={["gw"]} label="岗位" rules={[{}]}>
                  <Select placeholder="请选择">
                    <Option value="all">全部岗位</Option>
                    <Option value="11">11</Option>
                    <Option value="12">12</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={colSpan}>
                <Form.Item name={["time"]} label="入职日期">
                  <RangePicker style={{ width: "100%" }} />
                </Form.Item>
              </Col>
              {highSearch && <Demo />}
            </Row>
            <div className="clearfix">
              <div className="l-left p-r-10">
                <Button type="primary" htmlType="submit">
                  查询
                </Button>
              </div>
              {/* <div className="l-left p-r-10">
                <Button onClick={this.handleReset}>重置</Button>
              </div> */}
              <div className="l-left">
                <Button
                  onClick={() => this.setState({ highSearch: !highSearch })}
                >
                  {!highSearch ? "高级搜索" : "取消高级搜索"}
                </Button>
              </div>
            </div>
          </Form>
        </div>
      </div>
    );
  }
}

Search.propTypes = {
  //   onSelect: PropTypes.func,
};

export default Search;
