// [
//     {
//       required: item.isRequired,
//       message: "请按要求正确填写!",
//     },
//   ]
/**
 * @param item 传入的item值
 * @returns 返回规则数组 此处可以手动更改规则显示，目前按照默认rules处理即可
 */
const rules = (item) => {
  const obj = {
    required: item.isRequired,
  };
  switch (item.fieldCode) {
    case "1":
      break;

    default:
      break;
  }

  // if(item.)

  return [obj];
};
export { rules };
