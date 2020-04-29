// 交易类型
// 0:充值 1:线下充值 2:系统充值 3:广告收入 4:退款 5:分销佣金 6:电商分销 7:解冻
const recordType = [
  {
    key: 0,
    title: "充值",
  },
  {
    key: 1,
    title: "线下充值",
  },
  {
    key: 2,
    title: "系统充值",
  },
  {
    key: 3,
    title: "广告收入",
  },
  // {
  //   key: 4,
  //   title: '退款'
  // },
  {
    key: 5,
    title: "分销佣金 ",
  },
  {
    key: 6,
    title: "电商分销",
  },
  {
    key: 7,
    title: "解冻",
  },
];
/**
 * @desc 根据key值拿到交易类型
 *
 * @param key number|string
 *
 * @return string
 */
const typeFromKey = (key) => {
  let title;
  recordType.map((it) => {
    if (it.key === Number(key)) title = it.title;
  });
  return title;
};

export { recordType, typeFromKey };
