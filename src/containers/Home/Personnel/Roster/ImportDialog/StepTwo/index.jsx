import React from "react";
import PropTypes from "prop-types";
import { classPrefix } from "./../../../../../../const";
import "./index.less";
import { Button, Table, Select, message } from "antd";
const { Option } = Select;

class StepTwo extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      dataSource: [],
    };
  }

  componentDidMount() {
    // 通过data整理dataSource数据
    const { data } = this.props;
    const { datas, header, headerFiled } = data.headerAndFistRowData;
    const source = [];
    datas.map((it, i) => {
      source.push({
        key: i,
        mykey: header[i],
        select: headerFiled[i],
        value: it,
      });
      return undefined;
    });
    this.setState({ dataSource: source });
  }
  componentWillUnmount() {
    this.setState = () => {
      return;
    };
  }

  // 下一步
  handleSuccess = () => {
    const { dataSource } = this.state;
    const { data, onSuccess } = this.props;
    const arr = [];
    dataSource.map((it) => {
      arr.push(it.select);
      return undefined;
    });
    if (arr.length !== new Set([...arr]).size)
      return message.error("匹配字段不能重复");
    // 开始请求接口
    Request.post(`/fileUpload/member/commit`, {
      fieldsStr: arr,
      id: data.id,
    }).then((res) => {
      if (res.status === 200) onSuccess();
    });
  };

  render() {
    const { onBack, data } = this.props;
    const { dataSource } = this.state;

    const columns = [
      {
        title: "导入字段",
        dataIndex: "mykey",
        key: "mykey",
      },
      {
        title: "导入字段",
        dataIndex: "select",
        key: "select",
        render: (text, record) => {
          const { importFields } = data;
          return (
            <Select
              placeholder="请选择"
              filterOption={(input, option) =>
                option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
              }
              showSearch
              allowClear
              value={text}
              onChange={(e) => {
                dataSource.map((it) => {
                  if (it.mykey === record.mykey) it.select = e;
                  return undefined;
                });
                this.setState({ dataSource });
              }}
              style={{ width: "100%" }}
            >
              {importFields.length &&
                importFields.map((it) => (
                  <Option value={it.fieldCode} key={it.fieldCode}>
                    {it.fieldName}
                  </Option>
                ))}
            </Select>
          );
        },
      },
      {
        title: "首条数据",
        dataIndex: "value",
        key: "value",
      },
    ];
    return (
      <div
        className={`${classPrefix}-home-personnel-roster-importdialog-steptwo`}
      >
        <div
          className={`${classPrefix}-home-personnel-roster-importdialog-steptwo-content`}
        >
          <div className="content">
            <div className="title p-b-20">数据字段匹配（共2条）</div>
            <Table
              dataSource={dataSource}
              columns={columns}
              pagination={false}
              scroll={{ y: 260 }}
            />
          </div>

          <div className="bottom">
            <span className="p-r-10">
              <Button onClick={() => onBack()}>上一步</Button>
            </span>
            <span>
              <Button type="primary" onClick={this.handleSuccess}>
                下一步
              </Button>
            </span>
          </div>
        </div>
      </div>
    );
  }
}

StepTwo.propTypes = {
  onSuccess: PropTypes.func,
  onBack: PropTypes.func,
};

export default StepTwo;
