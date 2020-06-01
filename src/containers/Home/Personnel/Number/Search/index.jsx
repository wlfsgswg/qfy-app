import React, { useEffect } from "react";
import { classPrefix } from "./../../../../../const";
import PropTypes from "prop-types";
import "./index.less";
import { Form, Button, Row, Col, DatePicker } from "antd";
const { YearPicker } = DatePicker;
const layout = {
  labelCol: {
    span: 6
  },
  wrapperCol: {
    span: 18
  }
};
const colSpan = 8;

const Search = props => {
  const [form] = Form.useForm();
  useEffect(() => {
    if (props.defaultValue) {
      form.setFieldsValue({
        ...props.defaultValue
      });
    }
  }, [props.defaultValue, form]);

  // 提交
  const onFinish = values => {
    const obj = {};
    for (let item in values) {
      if (values[item] !== undefined && values[item] !== "")
        obj[item] = values[item];
    }
    // console.log(obj);
    // 回调返回给父组件
    props.onSummit(obj);
  };
  return (
    <div className={`${classPrefix}-number-search`}>
      <div className={`${classPrefix}-number-content`}>
        <Form {...layout} onFinish={onFinish} form={form}>
          <Row>
            <Col span={colSpan}>
              <Form.Item name={["year"]} label="统计年份">
                <YearPicker allowClear={false} />
              </Form.Item>
            </Col>
          </Row>
          <div className="clearfix">
            <div className="l-left p-r-10">
              <Button type="primary" htmlType="submit">
                查询
              </Button>
            </div>
          </div>
        </Form>
      </div>
    </div>
  );
};

Search.propTypes = {
  onSummit: PropTypes.func,
  defaultValue: PropTypes.object
};

export default Search;
