/**
 *
 * @param {*} fieldCode 必填 对应表格columns中的dataIndex
 * @return number 返回宽度数字
 */
const tableWidth = (fieldCode) => {
  switch (fieldCode) {
    //   性别
    case "sex":
      return 100;
    default:
      return 80;
  }
};

export { tableWidth };
