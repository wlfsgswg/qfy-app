import React from "react";
import moment from "moment";
import { Link } from "react-router-dom";
import { textFromCodeTables } from "./../../../../utils";
/**
 *
 * @param {*} fieldCode 必填 对应表格columns中的dataIndex
 * @param {*} text 必填 对应表格list的值
 * @param {*} codeTable 必填 码表对象包含各种待处理对象
 * @return element 返回元素
 */
const switchRender = (fieldCode, text, codeTable, record) => {
  switch (fieldCode) {
    // 名字高亮，并可以跳转
    case "name":
      return (
        <Link to={`/personnel/roster/files/${record.id}`}>
          <div style={{ cursor: "pointer", color: "#497eef" }}>
            {text === undefined || text === "" ? "--" : text}
          </div>
        </Link>
      );
    //   性别
    case "sex":
      return <div>{textFromCodeTables(text, codeTable.sex)}</div>;
    //   状态
    case "status":
      return <div>{textFromCodeTables(text, codeTable.memberstatus)}</div>;
    //   degree
    case "degree":
      return <div>{textFromCodeTables(text, codeTable.education)}</div>;
    //   婚姻状况
    case "weedingStatus":
      return <div>{textFromCodeTables(text, codeTable.maritalstatus)}</div>;
    //   员工类型;
    case "memberType":
      return <div>{textFromCodeTables(text, codeTable.memberType)}</div>;

    // 出生年月
    case "birth":
      return <div>{text ? moment(text).format("YYYY-MM-DD") : "--"}</div>;
    // 入职日期
    case "joinTime":
      return <div>{text ? moment(text).format("YYYY-MM-DD") : "--"}</div>;
    // 转正日期
    case "conversionTime":
      return <div>{text ? moment(text).format("YYYY-MM-DD") : "--"}</div>;
    // 合同到期日期
    case "contractExpireTime":
      return <div>{text ? moment(text).format("YYYY-MM-DD") : "--"}</div>;
    // 离职日期
    case "dimissionTime":
      return <div>{text ? moment(text).format("YYYY-MM-DD") : "--"}</div>;
    // 退休日期
    case "retireTime":
      return <div>{text ? moment(text).format("YYYY-MM-DD") : "--"}</div>;
    //   合同生效日期
    case "contractEffectiveTime":
      return <div>{text ? moment(text).format("YYYY-MM-DD") : "--"}</div>;

    default:
      return <div>{text === undefined || text === "" ? "--" : text}</div>;
  }
};

export { switchRender };
