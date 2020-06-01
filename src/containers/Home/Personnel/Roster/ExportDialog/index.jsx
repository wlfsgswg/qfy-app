import React, { Component } from "react";
import PropTypes from "prop-types";
import { Dialog } from "./../../../../../components";
import { classPrefix } from "./../../../../../const";
import { Checkbox, Row, Col, Radio } from "antd";
import { dataStreamToXls } from "./../../../../../utils";
import "./index.less";

const colSpan = 8;
class ExportDialog extends Component {
  constructor(props) {
    super(props);
    this.state = {
      checks: [],
      radio: "",
    };
  }

  componentDidMount() {
    // 关于导出表头默认选中要求如下
    /**
     * 1，导出表头以默认展示表头为准
     * 2，无论表头是展示姓名和手机号，导出表头默认导出这两项，并不会根据全选全不选进行更改
     */
    const { data } = this.props;
    const checks = [];

    data.map((it) => {
      if (it.isShow) {
        checks.push(it.fieldCode);
      }
      return undefined;
    });
    // 强制添加姓名手机号两项并进行去重
    const checksBin = [...new Set([...checks, "name", "mobilephone"])];
    this.setState({ checks: checksBin });
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
      return undefined;
    });
    const checksBin = [...new Set([...arr, "name", "mobilephone"])];
    this.setState({ radio, checks: checksBin });
  };

  render() {
    const { checks, radio } = this.state;
    const { afterClose, getContainer, onSuccess, data, total } = this.props;
    return (
      <Dialog
        title={"导出花名册"}
        closable={true}
        afterClose={afterClose}
        getContainer={getContainer}
        width={700}
        okText="导出"
        onOk={() => {
          // 此处提交表头设置并导出表格
          const { checks } = this.state;
          dataStreamToXls(
            `/fileUpload/member/exportData`,
            {
              isShowArr: checks,
            },
            "post",
            "花名册.xls",
            () => {
              afterClose();
              onSuccess();
            }
          );
        }}
      >
        <div className={`${classPrefix}-home-personnel-roster-exportdialog`}>
          <div
            className={`${classPrefix}-home-personnel-roster-exportdialog-content`}
          >
            <div style={{ textAlign: "center", paddingBottom: "5px" }}>
              本次将导出
              <span className="red">{total}</span>
              条数据
            </div>
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
                      <Checkbox
                        value={it.fieldCode}
                        disabled={
                          it.fieldCode === "name" ||
                          it.fieldCode === "mobilephone"
                        }
                      >
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
ExportDialog.propTypes = {
  afterClose: PropTypes.func,
  getContainer: PropTypes.func,
  data: PropTypes.array,
  onSuccess: PropTypes.func,
};

const open = (props) => {
  Dialog.OpenDialog({}, <ExportDialog {...props} />);
};

export { open };
