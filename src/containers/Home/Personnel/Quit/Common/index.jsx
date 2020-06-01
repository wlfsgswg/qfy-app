import React, { useState, useEffect } from "react";
import { classPrefix } from "./../../../../../const";
import {
  Select,
  Button,
  Form,
  Row,
  Col,
  Input,
  DatePicker,
  message,
  Upload,
  Modal,
} from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
import moment from "moment";
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
const colSpan = 12;
const colSpan2 = 24;
const Common = (props) => {
  const [reasonList, setReasonList] = useState([]);
  const [memberList, setMemberList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  const [memberLoading, setMemberLoading] = useState(false);
  const [fileList1, setFileList1] = useState(
    props.obj && props.obj.photoUrl
      ? [
          {
            uid: "-4",
            status: "done",
            url: props.obj.photoUrl,
          },
        ]
      : []
  );
  const [fileList2, setFileList2] = useState(
    props.obj && props.obj.secondUrl
      ? [
          {
            uid: "-3",
            status: "done",
            url: props.obj.secondUrl,
          },
        ]
      : []
  );
  const [obj] = useState(props.obj);
  // 办理离职-提交
  const onFinish = (values) => {
    const {
      applyDate,
      targetDate,
      photoUrl,
      secondUrl,
      reason,
      ...rest
    } = values;

    // 处理
    const data = { ...rest, operateType: 5 };

    data.applyDate = moment(applyDate).format("YYYY-MM-DD");
    data.targetDate = moment(targetDate).format("YYYY-MM-DD");
    if (reason) data.reason = reason;
    // 离职申请文档
    if (typeof photoUrl === "string") {
      data.photoUrl = photoUrl;
    } else {
      if (photoUrl && photoUrl.length)
        data.photoUrl = photoUrl[0].response.fileUrl;
    }
    // 离职交接文档
    if (typeof secondUrl === "string") {
      data.secondUrl = secondUrl;
    } else {
      if (secondUrl && secondUrl.length)
        data.secondUrl = secondUrl[0].response.fileUrl;
    }
    // 通过obj是否有id区分是新增还是修改
    if (obj && obj.id) data.id = obj.id;
    setLoading(true);
    Request.post(`/memberOperate/saveJson`, data)
      .then((res) => {
        if (res.status === 200) {
          message.success(obj && obj.id ? "修改离职成功" : "办理离职成功");
          setLoading(false);
          props.history.push("/personnel/quit");
        }
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    handleGetMember();
    handleGetReasons();
  }, []);

  // 获取原因列表
  const handleGetReasons = () => {
    setMemberLoading(true);
    Request.get(`/option/optionListJson`, { optionCode: "quit_reasons" })
      .then((res) => {
        if (res.status === 200) {
          setReasonList(res.data && res.data.list && res.data.list);
          setMemberLoading(false);
        }
      })
      .catch(() => setMemberLoading(false));
  };
  // 上传开始前做一些限制
  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 20;
    if (!isLt2M) {
      message.error("单个文件限制小于20M!");
    }
    return isLt2M;
  };

  // 正在上传
  const normFile = (e, type) => {
    const { file } = e;
    if (file.status === "uploading") setLoading(true);
    if (file.status === "done" || file.status === "error") setLoading(false);
    if (Array.isArray(e)) return e;
    if (type === 1) setFileList1(e.fileList);
    if (type === 2) setFileList2(e.fileList);
    return e && e.fileList;
  };

  // 员工搜索
  const handleGetMember = () => {
    setNameLoading(true);
    Request.post(`/memberRelation/listJson`, { queryType: 3 })
      .then((res) => {
        if (res.status === 200) {
          setMemberList(res.data);
          setNameLoading(false);
        }
      })
      .catch(() => setNameLoading(false));
  };

  return (
    <div className={`${classPrefix}-home-personnel-quit-common`}>
      <div className={`${classPrefix}-home-personnel-quit-common-content`}>
        <div className="p-b-20 p-l-10">离职信息</div>
        <Form
          {...layout}
          name="quit-common"
          onFinish={onFinish}
          initialValues={obj}
        >
          <Row>
            <Col span={colSpan}>
              <Form.Item
                name={"memberId"}
                label="姓名"
                rules={[
                  {
                    required: true,
                    message: "请输入姓名",
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  allowClear
                  disabled={obj && obj.memberName}
                  loading={nameLoading}
                >
                  {memberList.length &&
                    memberList.map((it) => (
                      <Option value={it.id} key={it.id}>
                        {it.name}
                      </Option>
                    ))}
                  {obj && obj.memberName && (
                    <Option value={obj.memberId} key={obj.memberId}>
                      {obj.memberName}
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item
                name={"applyDate"}
                label="申请日期"
                rules={[
                  {
                    required: true,
                    message: "请选择申请日期",
                  },
                ]}
              >
                <DatePicker placeholder="选择日期" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item
                name={"targetDate"}
                label="预计离职日期"
                rules={[
                  {
                    required: true,
                    message: "请选择预计离职日期",
                  },
                ]}
              >
                <DatePicker placeholder="选择日期" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item
                name={"optionId"}
                label="离职原因"
                rules={[
                  {
                    required: true,
                    message: "请选择离职原因",
                  },
                ]}
              >
                <Select
                  placeholder="请选择"
                  filterOption={(input, option) =>
                    option.children
                      .toLowerCase()
                      .indexOf(input.toLowerCase()) >= 0
                  }
                  showSearch
                  allowClear
                  loading={memberLoading}
                >
                  {reasonList.length &&
                    reasonList.map((it) => (
                      <Option value={it.optionId} key={it.optionId}>
                        {it.optionName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item
                name="photoUrl"
                label="离职申请表"
                valuePropName="fileList1"
                getValueFromEvent={(e) => normFile(e, 1)}
              >
                <Upload
                  accept=".jpj,.jpeg,.png,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip"
                  action="/fileUpload/file/upload"
                  data={{ type: 2 }}
                  beforeUpload={beforeUpload}
                  listType="picture-card"
                  fileList={fileList1}
                  showUploadList={{
                    showPreviewIcon: false,
                    showDownloadIcon: true,
                  }}
                  onDownload={(e) => {
                    const url = e.url ? e.url : e.response.fileUrl;
                    window.open(url);
                  }}
                >
                  {fileList1.length === 0 && (
                    <div className="my-rel">
                      <PlusOutlined style={{ fontSize: "25px" }} />
                      <div className="my-pos">
                        支持jpj，.jpeg，.png，.doc，.docx，.pdf，.xls，.xlsx，.ppt，.pptx，.zip类型文件(20M以内)
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item
                name="secondUrl"
                label="离职交接表"
                valuePropName="fileList2"
                getValueFromEvent={(e) => normFile(e, 2)}
              >
                <Upload
                  accept=".jpj,.jpeg,.png,.doc,.docx,.pdf,.xls,.xlsx,.ppt,.pptx,.zip"
                  action="/fileUpload/file/upload"
                  data={{ type: 2 }}
                  beforeUpload={beforeUpload}
                  listType="picture-card"
                  fileList={fileList2}
                  showUploadList={{
                    showPreviewIcon: false,
                    showDownloadIcon: true,
                  }}
                  onDownload={(e) => {
                    const url = e.url ? e.url : e.response.fileUrl;
                    window.open(url);
                  }}
                >
                  {fileList2.length === 0 && (
                    <div className="my-rel">
                      <PlusOutlined style={{ fontSize: "25px" }} />
                      <div className="my-pos">
                        支持jpj，.jpeg，.png，.doc，.docx，.pdf，.xls，.xlsx，.ppt，.pptx，.zip类型文件(20M以内)
                      </div>
                    </div>
                  )}
                </Upload>
              </Form.Item>
            </Col>
            <Col span={colSpan2}>
              <Form.Item
                name={"reason"}
                label="离职原因"
                labelCol={{ span: 3 }}
                wrapperCol={{ span: 21 }}
              >
                <Input.TextArea
                  placeholder="原因限制200字之内"
                  rows={4}
                  maxLength={200}
                />
              </Form.Item>
            </Col>
          </Row>
          <div className="t-a-r">
            <span className="p-r-10">
              <Button
                onClick={() => {
                  if (!obj) {
                    Modal.confirm({
                      title: "提示",
                      icon: <ExclamationCircleOutlined />,
                      content: "员工的信息还未保存，是否返回？",
                      okText: "确认",
                      cancelText: "取消",
                      onOk: () => {
                        props.history.push("/personnel/quit");
                      },
                    });
                  } else {
                    props.history.push("/personnel/quit");
                  }
                }}
              >
                取消
              </Button>
            </span>
            <span>
              <Button type="primary" htmlType="submit" loading={loading}>
                保存
              </Button>
            </span>
          </div>
        </Form>
      </div>
    </div>
  );
};

export default withRouter(Common);
