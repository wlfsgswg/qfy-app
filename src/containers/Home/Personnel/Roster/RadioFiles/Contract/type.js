const contractType = [
  {
    title: "固定期限劳动合同",
    value: 1,
  },
  {
    title: "无固定期限劳动合同",
    value: 2,
  },
  {
    title: "以完成一定工作任务为期限的劳动合同",
    value: 3,
  },
  {
    title: "实习协议",
    value: 4,
  },
  {
    title: "劳务合同",
    value: 5,
  },
  {
    title: "返聘协议",
    value: 6,
  },
  {
    title: "劳务派遣合同",
    value: 7,
  },
  {
    title: "其他",
    value: 8,
  },
];
/**
 *
 * @param {*} key 数组对象的key值，通过这个值我们获取title
 */
const fromTypeToTitle = (key) => {
  let title = "";
  contractType.map((it) => {
    if (it.value === Number(key)) title = it.title;
    return undefined;
  });
  return title;
};
export { contractType, fromTypeToTitle };
