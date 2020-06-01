/**
zzNum  在职
qzNum  全职
sxNum  实习
jzNum 兼职
lwpqNum 劳务派遣
lwwbNum 劳务外包
txfpNum 退休返聘
syNum 试用
zsNum 正式
dlzNum 待离职
*/

/**
 * 
查询条件 
queryType; // 1:在职 2.全职 3：实习 4：兼职 5：劳务派遣 6：劳务外包 7：退休返聘 8：试用 9：正式 10：待离职  11：已离职
*/
const top1 = [
  {
    title: "在职",
    num: 0,
    status: "zzNum",
    queryType: 1,
  },
  {
    title: "全职",
    num: 0,
    status: "qzNum",
    queryType: 2,
  },
  {
    title: "实习",
    num: 0,
    status: "sxNum",
    queryType: 3,
  },
  {
    title: "兼职",
    num: 0,
    status: "jzNum",
    queryType: 4,
  },
  {
    title: "劳务派遣",
    num: 0,
    status: "lwpqNum",
    queryType: 5,
  },
  {
    title: "劳务外包",
    num: 0,
    status: "lwwbNum",
    queryType: 6,
  },
  {
    title: "退休返岗",
    num: 0,
    status: "txfpNum",
    queryType: 7,
  },
];

const top2 = [
  {
    title: "试用",
    num: 0,
    status: "syNum",
    queryType: 8,
  },
  {
    title: "正式",
    num: 0,
    status: "zsNum",
    queryType: 9,
  },
  {
    title: "待离职",
    num: 0,
    status: "dlzNum",
    queryType: 10,
  },
];
const top3 = [
  // {
  //   title: "待入职",
  //   num: 0,
  // },
  {
    title: "已离职",
    num: 0,
    status: "ylzNum",
    queryType: 11,
  },
];
export { top1, top2, top3 };
