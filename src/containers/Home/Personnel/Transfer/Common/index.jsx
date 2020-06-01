import React, { useState, useEffect } from "react";
import { classPrefix } from "./../../../../../const";
import {
  Select,
  Button,
  Form,
  Row,
  Col,
  DatePicker,
  message,
  Upload,
  Modal,
  Radio,
  TreeSelect,
} from "antd";
import { PlusOutlined, ExclamationCircleOutlined } from "@ant-design/icons";
import { withRouter } from "react-router-dom";
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
const colSpan = 12;
// const colSpan2 = 24;
const Common = (props) => {
  const [memberList, setMemberList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [nameLoading, setNameLoading] = useState(false);
  // 部门
  const [depart, setDepart] = useState([]);
  // 岗位
  const [post, setPost] = useState([]);
  // 职务
  const [job, setJob] = useState([]);
  // 职级
  const [level, setLevel] = useState([]);
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
  const [obj] = useState(props.obj);
  // 选中特定的人物
  const [selectObj, setSelectObj] = useState({});
  // 办理离职-提交
  const onFinish = (values) => {
    const { targetDate, photoUrl, rankId, ...rest } = values;
    // 处理
    const data = { ...rest };
    data.targetDate = moment(targetDate).format("YYYY-MM-DD");
    if (rankId) data.rankId = rankId;
    // 离职申请文档
    if (typeof photoUrl === "string") {
      data.photoUrl = photoUrl;
    } else {
      if (photoUrl && photoUrl.length)
        data.photoUrl = photoUrl[0].response.fileUrl;
    }

    // 通过obj是否有id区分是新增还是修改
    if (obj && obj.id) data.id = obj.id;
    setLoading(true);
    Request.post(`/memberOperate/saveJson`, data)
      .then((res) => {
        if (res.status === 200) {
          message.success(obj && obj.id ? "保存成功" : "完成调动");
          setLoading(false);
          props.history.push("/personnel/transfer");
        }
      })
      .catch(() => setLoading(false));
  };

  useEffect(() => {
    handleGetMember();
    handleGetDepart();
    handleGetPost();
    handleGetJob();
    handleGetLevel();
  }, []);

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
    return e && e.fileList;
  };

  // 员工搜索
  const handleGetMember = () => {
    setNameLoading(true);
    Request.post(`/memberRelation/listJson`, { queryType: 7 })
      .then((res) => {
        if (res.status === 200) {
          setMemberList(res.data);
          setNameLoading(false);
        }
      })
      .catch(() => setNameLoading(false));
  };

  // 获取部门树状结构
  const handleGetDepart = () => {
    Request.post(`/memberDepart/getDepartTree`).then((res) => {
      if (res.status === 200) {
        setDepart(res.data);
      }
    });
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

  // 获取岗位数组
  const handleGetPost = () => {
    Request.post(`/postManage/listJson`).then((res) => {
      if (res.status === 200) setPost(res.data.list);
    });
  };

  // 获取职务数组
  const handleGetJob = () => {
    Request.post(`/sysDuty/listJson`, {}).then((res) => {
      if (res.status === 200) {
        setJob(res.data.list);
      }
    });
  };
  // 获取岗位职级数组
  const handleGetLevel = () => {
    Request.post(`/sysPositionLevel/listJson`, {}).then((res) => {
      if (res.status === 200) {
        setLevel(res.data.list);
      }
    });
  };
  // 选中特定name
  const selectName = (e) => {
    memberList.length !== 0 &&
      memberList.map((it) => {
        if (it.id === e) {
          setSelectObj({
            // 部门
            deptName: it.deptName,
            // 岗位
            postName: it.postName,
            // 职务
            dutyName: it.dutyName,
            // 职级
            positionLevelName: it.positionLevelName,
          });
        }
        return undefined;
      });
  };
  return (
    <div className={`${classPrefix}-home-personnel-transfer-common`}>
      <div className={`${classPrefix}-home-personnel-transfer-common-content`}>
        <div className="p-b-20 p-l-10">调动信息</div>
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
                  onSelect={selectName}
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
                name={"targetDate"}
                label="调动日期"
                rules={[
                  {
                    required: true,
                    message: "请选择调动日期",
                  },
                ]}
              >
                <DatePicker placeholder="选择日期" style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <Form.Item
                name={"operateType"}
                label="调动类型"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Radio.Group>
                  <Radio value={3}>调岗</Radio>
                  <Radio value={2}>晋升</Radio>
                  <Radio value={4}>降级</Radio>
                </Radio.Group>
              </Form.Item>
            </Col>

            <Col span={colSpan}>
              <Form.Item
                name="photoUrl"
                label="调岗申请表"
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
              <div className="transfer-item">
                <Row>
                  <Col span={layout.labelCol.span}>
                    <div className="t-a-r">原部门：</div>
                  </Col>
                  <Col span={layout.wrapperCol.span}>
                    {obj.oldGroupName
                      ? obj.oldGroupName
                      : selectObj.deptName
                      ? selectObj.deptName
                      : "--"}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={colSpan}>
              <Form.Item
                name={"groupId"}
                label="调动后部门"
                rules={[
                  {
                    required: true,
                    message: "请选择调动后部门",
                  },
                ]}
              >
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
              <div className="transfer-item">
                <Row>
                  <Col span={layout.labelCol.span}>
                    <div className="t-a-r">原岗位：</div>
                  </Col>
                  <Col span={layout.wrapperCol.span}>
                    {obj.oldPostName
                      ? obj.oldPostName
                      : selectObj.postName
                      ? selectObj.postName
                      : "--"}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={colSpan}>
              <Form.Item
                name={"postId"}
                label="调动后岗位"
                rules={[
                  {
                    required: true,
                    message: "请选择调动后岗位",
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
              <div className="transfer-item">
                <Row>
                  <Col span={layout.labelCol.span}>
                    <div className="t-a-r">原职务：</div>
                  </Col>
                  <Col span={layout.wrapperCol.span}>
                    {obj.oldDutyName
                      ? obj.oldDutyName
                      : selectObj.dutyName
                      ? selectObj.dutyName
                      : "--"}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={colSpan}>
              <Form.Item
                name={"dutyId"}
                label="调动后职务"
                rules={[
                  {
                    required: true,
                    message: "请选择调动后职务",
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
                >
                  {job.length &&
                    job.map((it) => (
                      <Option value={it.dutyId} key={it.dutyId}>
                        {it.dutyName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={colSpan}>
              <div className="transfer-item">
                <Row>
                  <Col span={layout.labelCol.span}>
                    <div className="t-a-r">原岗位级别：</div>
                  </Col>
                  <Col span={layout.wrapperCol.span}>
                    {obj.oldRankName
                      ? obj.oldRankName
                      : selectObj.positionLevelName
                      ? selectObj.positionLevelName
                      : "--"}
                  </Col>
                </Row>
              </div>
            </Col>
            <Col span={colSpan}>
              <Form.Item name={"rankId"} label="调动后级别">
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
                  {level.length &&
                    level.map((it) => (
                      <Option value={it.id} key={it.id}>
                        {it.positionName}
                      </Option>
                    ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <div className="t-a-r">
            <span className="p-r-10">
              <Button
                onClick={() => {
                  if (obj && !obj.memberId) {
                    Modal.confirm({
                      title: "提示",
                      icon: <ExclamationCircleOutlined />,
                      content: "员工的信息还未保存，是否返回？",
                      okText: "确认",
                      cancelText: "取消",
                      onOk: () => {
                        props.history.push("/personnel/transfer");
                      },
                    });
                  } else {
                    props.history.push("/personnel/transfer");
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
