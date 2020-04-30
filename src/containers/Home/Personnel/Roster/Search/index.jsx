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

class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      searchObj: {},
      // 默认选中name
      currentValue: "name",
    };
  }

  onFinish = (values) => {
    console.log(values);
  };

  //   重置
  handleReset = () => {};

  render() {
    const { searchObj, currentValue } = this.state;
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
              <Col span={8}>
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
              <Col span={8}>
                <Form.Item name={["bm"]} label="部门" rules={[{}]}>
                  <Select placeholder="请选择">
                    <Option value="all">全部部门</Option>
                    <Option value="1">1</Option>
                    <Option value="2">2</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["gw"]} label="岗位" rules={[{}]}>
                  <Select placeholder="请选择">
                    <Option value="all">全部岗位</Option>
                    <Option value="11">11</Option>
                    <Option value="12">12</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item name={["time"]} label="入职日期">
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
              {/* <div className="l-left p-r-10">
                <Button onClick={this.handleReset}>重置</Button>
              </div> */}
              <div className="l-left">
                <Button>高级搜索</Button>
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
