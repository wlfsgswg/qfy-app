import React from "react";
import { classPrefix } from "./../../../../../const";
import { Dialog } from "./../../../../../components";
import PropTypes from "prop-types";
import { Form, Row, Col, Select, TreeSelect, DatePicker, message } from "antd";
import moment from "moment";
import "./index.less";
const { Option } = Select;
const { TreeNode } = TreeSelect;
const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 18,
  },
};
const colSpan = 24;
class SureDialog extends React.Component {
  constructor(props) {
    super(props);
    this.formRef = React.createRef();
    this.state = {
      loading: false,
    };
  }
  // 轮询部门
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

  // 提交
  handleSummit = () => {
    const { id } = this.props.data.defaultObj;
    // 先调用报错
    this.formRef.current.submit();
    // 处理数据
    const summit = this.formRef.current.getFieldsValue();
    if (
      summit.memberType === 2 ||
      summit.memberType === 3 ||
      summit.memberType === 5
    ) {
      delete summit.status;
    }
    let bol = true;
    for (let i in summit) {
      bol = bol && !!summit[i];
    }
    if (bol) {
      summit.joinTime = moment(summit.joinTime).format("YYYY-MM-DD");
      summit.conversionTime = moment(summit.conversionTime).format(
        "YYYY-MM-DD"
      );
      if (
        Date.parse(new Date(summit.joinTime)) >
        Date.parse(new Date(summit.conversionTime))
      )
        return message.error("转正日期不能在入职日期之前！");
      this.setState({ loading: true });
      Request.post(`/memberRelation/entry`, {
        ...summit,
        id,
      })
        .then((res) => {
          if (res.status === 200) {
            message.success("完成入职");
            this.setState({ loading: false });
            this.props.afterClose();
            this.props.onSuccess();
          }
        })
        .catch(() => {
          this.setState({ loading: false });
        });
    }
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
    const { loading } = this.state;
    const { afterClose, getContainer, data } = this.props;
    const { post, depart, codeTable, defaultObj } = data;
    // 处理一下默认数据
    const { conversionTime, joinTime, ...rest } = defaultObj;
    for (let i in rest) {
      if (!rest[i]) rest[i] = undefined;
    }
    const obj = {
      ...rest,
      conversionTime: conversionTime ? moment(conversionTime) : null,
      joinTime: joinTime ? moment(joinTime) : null,
    };

    return (
      <div className={`${classPrefix}-home-personnel-enter-sure`}>
        <div className={`${classPrefix}-home-personnel-enter-sure-content`}>
          <Dialog
            title={"确认入职"}
            closable={true}
            afterClose={afterClose}
            getContainer={getContainer}
            width={500}
            onOk={this.handleSummit}
            okButtonProps={{
              loading,
            }}
          >
            <Form
              {...layout}
              name="sure-dialog"
              ref={this.formRef}
              initialValues={obj}
            >
              <Row>
                <Col span={colSpan}>
                  <Form.Item
                    name={["memberType"]}
                    label="员工类型"
                    rules={[
                      {
                        required: true,
                        message: "请选择员工类型！",
                      },
                    ]}
                  >
                    <Select
                      placeholder="请选择员工类型"
                      filterOption={(input, option) =>
                        option.children
                          .toLowerCase()
                          .indexOf(input.toLowerCase()) >= 0
                      }
                      showSearch
                      allowClear
                      onChange={this.onGenderChange}
                    >
                      {codeTable.memberType.length &&
                        codeTable.memberType.map((it) => (
                          <Option value={it.keyValue - 0} key={it.keyValue - 0}>
                            {it.keyName}
                          </Option>
                        ))}
                    </Select>
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    noStyle
                    shouldUpdate={(prevValues, currentValues) =>
                      prevValues.memberType !== currentValues.memberType
                    }
                  >
                    {({ getFieldValue }) => {
                      return (
                        <div>
                          {getFieldValue("memberType") === 2 ||
                          getFieldValue("memberType") === 3 ||
                          getFieldValue("memberType") === 5 ? (
                            <Form.Item name={["status"]} label="员工状态">
                              <Select
                                placeholder="员工状态不可选"
                                disabled={true}
                              ></Select>
                            </Form.Item>
                          ) : (
                            <Form.Item
                              name={["status"]}
                              label="员工状态"
                              rules={[
                                {
                                  required: true,
                                  message: "请选择员工状态！",
                                },
                              ]}
                            >
                              <Select
                                placeholder="请选择员工状态"
                                filterOption={(input, option) =>
                                  option.children
                                    .toLowerCase()
                                    .indexOf(input.toLowerCase()) >= 0
                                }
                                showSearch
                                allowClear
                              >
                                <Option value={1} key={1}>
                                  正式
                                </Option>
                                <Option value={2} key={2}>
                                  试用
                                </Option>
                              </Select>
                            </Form.Item>
                          )}
                        </div>
                      );
                    }}
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    name={["department"]}
                    label="部门"
                    rules={[
                      {
                        required: true,
                        message: "请选择部门！",
                      },
                    ]}
                  >
                    <TreeSelect
                      treeDefaultExpandAll
                      showSearch
                      placeholder="请选择部门"
                      allowClear
                    >
                      {depart.length && this.handlePoll(depart)}
                    </TreeSelect>
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    name={["postId"]}
                    label="岗位"
                    rules={[
                      {
                        required: true,
                        message: "请选择岗位！",
                      },
                    ]}
                  >
                    <Select
                      placeholder="请选择岗位"
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
                  <Form.Item
                    name={["joinTime"]}
                    label="入职日期"
                    rules={[
                      {
                        required: true,
                        message: "请选择日期！",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
                  </Form.Item>
                </Col>
                <Col span={colSpan}>
                  <Form.Item
                    name={["conversionTime"]}
                    label="转正日期"
                    rules={[
                      {
                        required: true,
                        message: "请选择日期！",
                      },
                    ]}
                  >
                    <DatePicker style={{ width: "100%" }} />
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

SureDialog.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  data: PropTypes.object,
  onSuccess: PropTypes.func,
};

const open = (props) => {
  Dialog.OpenDialog({}, <SureDialog {...props} />);
};

export { open };
