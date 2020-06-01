import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog } from "./../../../../../components";
import { classPrefix } from "./../../../../../const";
import { Checkbox, Row, Col, message, Radio } from "antd";
import "./index.less";

const colSpan = 8;
class RadioDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checks: [],
      radio: "",
    };
  }

  componentDidMount() {
    const { data } = this.props;
    const checks = [];
    data.map((it) => {
      if (it.isShow) {
        checks.push(it.fieldCode);
      }
      return undefined;
    });
    this.setState({ checks });
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }
  handleRadio = (e) => {
    const { data } = this.props;
    const radio = e.target.value;
    const arr = [];
    data.map((item) => {
      if (radio === "yes") arr.push(item.fieldCode);
      if (radio === "no" && item.isRead && item.isShow)
        arr.push(item.fieldCode);
      return undefined;
    });
    this.setState({ radio, checks: arr });
  };

  render() {
    const { checks, radio } = this.state;
    const { afterClose, getContainer, onSuccess, data } = this.props;
    return (
      <Dialog
        title={"自定义表头"}
        closable={true}
        afterClose={afterClose}
        getContainer={getContainer}
        width={700}
        okText="保存"
        onOk={() => {
          // 此处提交表头设置
          const { checks } = this.state;
          Request.post(`/member/saveIsShow`, { isShowArr: checks }).then(
            (res) => {
              if (res.status === 200) {
                message.success("自定义表头成功");
                afterClose();
                onSuccess();
              }
            }
          );
        }}
      >
        <div className={`${classPrefix}-home-personnel-roster-radiodialog`}>
          <div
            className={`${classPrefix}-home-personnel-roster-radiodialog-content`}
          >
            <div className="p-b-10">
              <Radio.Group onChange={(e) => this.handleRadio(e)} value={radio}>
                <Radio value={"yes"}>全选</Radio>
                <Radio value={"no"}>全不选</Radio>
              </Radio.Group>
            </div>
            <Checkbox.Group
              style={{ width: "100%" }}
              onChange={(e) => {
                this.setState({ checks: e });
              }}
              value={checks}
            >
              <Row>
                {data.length &&
                  data.map((it) => (
                    <Col
                      key={it.fieldCode}
                      span={colSpan}
                      style={{ paddingBottom: "10px" }}
                    >
                      <Checkbox value={it.fieldCode} disabled={it.isRead}>
                        {it.fieldName}
                      </Checkbox>
                    </Col>
                  ))}
              </Row>
            </Checkbox.Group>
          </div>
        </div>
      </Dialog>
    );
  }
}
RadioDialog.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  data: PropTypes.array,
  onSuccess: PropTypes.func,
};

const open = (props) => {
  Dialog.OpenDialog({}, <RadioDialog {...props} />);
};

export { open };
