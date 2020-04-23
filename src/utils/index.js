import moment from "moment";
/**
 * 格式化金额
 * @param {number | string} value 金额值 （单位分）
 * @param {boolean} isCurrency 是否带前缀 默认true
 *
 * @return {number | string} 返回格式化后的金额
 */
export const getPrice = (value, isCurrency = true) => {
  if (isCurrency) return `${"¥"}${(parseInt(value) / 100).toFixed(2)}`;
  return parseInt(value) / 100;
};

/**
 *
 */
export const getToken = () => {};

/**
 * 数字格式化并每三位加逗号
 *
 * @param {number} num 数字
 * @param {string} commas 分割符 默认','
 *
 * @return {string} 格式化后的数据
 */
export const formatMoney = (num, isCurrency = true) => {
  //   num = getPrice(num, false)
  if (isCurrency) {
    return "¥" + num.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
  }
  return num.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
};

/**
 * 数字格式化并每三位加逗号
 *
 * @param {number} num 数字
 * @param {string} commas 分割符 默认','
 *
 * @return {string} 格式化后的数据
 */
export const formatNum = (num) => {
  return num.toString().replace(/\d{1,3}(?=(\d{3})+(\.\d*)?$)/g, "$&,");
};

/**
 * 数字转换添加单位
 *
 * @param {number | string} value 原始值
 * @param {number} multiple 转换的倍数
 * @param {number} decimal 保留小数点位数 默认小数点后2两位
 * @param {string} unit ['w'|'k']
 *
 * @return {number | string} 数字转换的值
 */
export const numberConversion = (value, multiple = 1, decimal = 0, unit) => {
  if (!value) {
    return `0`;
  }

  if (unit === "w" && value > 10000) {
    // 10000
    return `${formatNum(((value * multiple) / 10000).toFixed(decimal))}w+`;
  } else if (unit === "k" && value > 1000) {
    // 1000
    return `${formatNum(((value * multiple) / 1000).toFixed(decimal))}k+`;
  }

  return formatNum((value * multiple).toFixed(decimal));
};

/**
 * 格式化日期
 *
 * @param {string} date 日期
 * @param {string} format 格式化的格式
 */
export const formatDate = (date, format = "YYYY-MM-DD") => {
  return moment(date).format(format);
};

// 通过秒获取时间
export const timeStamp = (second_time) => {
  var time = parseInt(second_time) + "秒";
  if (parseInt(second_time) > 60) {
    var second = parseInt(second_time) % 60;
    var min = parseInt(second_time / 60);
    time = min + "分" + second + "秒";
    if (min > 59) {
      min = parseInt(second_time / 60) % 60;
      var hour = parseInt(parseInt(second_time / 60) / 60);
      time = hour + "小时" + min + "分" + second + "秒";
      if (hour > 23) {
        hour = parseInt(parseInt(second_time / 60) / 60) % 24;
        var day = parseInt(parseInt(parseInt(second_time / 60) / 60) / 24);
        // time = day + "天" + hour + "小时" + min + "分" + second + "秒";
        time = day + "天" + hour + "小时" + min + "分";
      }
    }
  }
  return time;
};
