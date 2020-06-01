import React from "react";
import { classPrefix } from "./../../../../../const";
import { Dialog } from "./../../../../../components";
import PropTypes from "prop-types";
import { Form, Row, Col, Select, message, Input } from "antd";
import "./index.less";
const { Option } = Select;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const colSpan = 24;
class QuitDialog extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      loading: false,
    };
  }
  // 提交
  handleSummit = () => {
    const { afterClose, onSuccess, data } = this.props;
    const { id } = data;
    // 先调用报错
    this.formRef.current.submit();
    // 处理数据
    const summit = this.formRef.current.getFieldsValue();
    if (!summit.abandonReason) return message.error("请选择放弃入职原因！");
    this.setState({ loading: true });
    Request.post(`/memberRelation/cancelEntry`, {
      ...summit,
      id,
    })
      .then((res) => {
        if (res.status === 200) {
          message.success("放弃入职成功");
          this.setState({ loading: false }, () => onSuccess());
          afterClose();
        }
      })
      .catch(() => {
        this.setState({ loading: false });
      });
  };

  render() {
    const { loading } = this.state;
    const { afterClose, getContainer, data } = this.props;
    const { codeTable } = data;

    return (
      <div className={`${classPrefix}-home-personnel-enter-quit`}>
        <div className={`${classPrefix}-home-personnel-enter-quit-content`}>
          <Dialog
            title={"放弃入职"}
            closable={true}
            afterClose={afterClose}
            getContainer={getContainer}
            width={500}
            onOk={this.handleSummit}
            okButtonProps={{
              loading,
            }}
          >
            <Form {...layout} name="quit-dialog" ref={this.formRef}>
              <Row>
                <Col span={colSpan}>
                  <Form.Item
                    name={["abandonReason"]}
                    label="放弃入职原因"
                    rules={[
                      {
                        required: true,
                        message: "请选择放弃入职原因！",
                      },
                    ]}
                  >
                    <Select
                      placeholder="请选择放弃入职原因"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                      allowClear
                    >
                      {codeTable.dimissionReason.length &&
                        codeTable.dimissionReason.map((it) => (
                          <Option value={it.keyValue - 0} key={it.keyValue - 0}>
                            {it.keyName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item name={["abandonRemark"]} label="备注">
                    <Input.TextArea
                      placeholder="备注不超过200字"
                      allowClear
                      maxLength={200}
                      rows={3}
                    />
                  </Form.Item>
                </Col>
              </Row>
            </Form>
          </Dialog>
        </div>
      </div>
    );
  }
}

QuitDialog.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  data: PropTypes.object,
  onSuccess: PropTypes.func,
};

const open = (props) => {
  Dialog.OpenDialog({}, <QuitDialog {...props} />);
};

export { open };
