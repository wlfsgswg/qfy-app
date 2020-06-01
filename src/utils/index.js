import moment from "moment";
/**
 *
 * @param {*} path 必填 string 原始路由参数
 * @param {*} rank 非必填 默认 1 最大为3 number 需要返回的是几级路由
 * @return string
 */
export const routeMatching = (path, rank = 1) => {
  // if (!path) throw "path不应该为undefined";
  // if (rank > 3) throw `暂不支持截取${rank}级路由`;
  const routerArr = path.split("/");
  let router;
  if (routerArr.length === 2) router = "/" + routerArr[1];
  if (routerArr.length !== 2) {
    router =
      rank === 1
        ? "/" + routerArr[1]
        : rank === 2
        ? "/" + routerArr[1] + "/" + routerArr[2]
        : "/" + routerArr[1] + "/" + routerArr[2] + "/" + routerArr[3];
  }
  return router;
};
/**
 * @description 该方法主要是把后台给的数据流转化为.xls表格并进行下载
 * @param {*} url 必填接口地址
 * @param {*} obj 非必填，请求所传参数，默认为空对象
 * @param {*} methods 非必填请求方式 get post 等默认post
 * @param {*} name 非必填，如果不填默认名称为‘模板.xls‘
 * @param {*} cb 非必填，成功的回调
 *
 */

export const dataStreamToXls = (
  url,
  obj = {},
  methods = "post",
  name = "模板.xls",
  cb = () => {}
) => {
  fetch(url, {
    body: JSON.stringify(obj),
    mode: "cors",
    method: methods,
    responseType: "blob",
    headers: new Headers({
      "Content-Type": "application/json",
    }),
  })
    .then((res) => {
      return res.blob();
    })
    .then((blob) => {
      var link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = name;
      var evt = document.createEvent("MouseEvents");
      evt.initEvent("click", true, true);
      link.dispatchEvent(evt);
      window.URL.revokeObjectURL(link.href);
      cb();
    });
};

/**
 *
 * @param {*} text 必填 number|string 数据返回的值
 * @param {*} arr 必填 array code码表中的数组
 * @param {*} key 想要获取数组中的属性的名字，默认取keyValue
 * @param {*} value 想要获取数组中的特定属性的值，默认取keyName
 * @return string 返回码表中取得的名称
 */
export const textFromCodeTables = (
  text,
  arr = [],
  key = "keyValue",
  value = "keyName"
) => {
  let string = "--";
  arr.length &&
    arr.map((it) => {
      if (it[key] === text + "" || it[key] === Number(text)) string = it[value];
      return undefined;
    });
  return string;
};
/**
 * @description 该方法主要是通过模板code获取后台返回的模板html，并替换特定字段
 * @param {*} templateCode 必传 状态code匹配对应模板
 * @param {*} arr 必传 模板数组
 * @param {*} orginArr 返回模板中需要替换的特定字段组成的数组
 * @param {*} replaceArr 返回模板中对应替换字段组成的数组 和orginArr长度一定相同
 */

export const codeToTemplate = (
  templateCode,
  arr,
  orginArr = [],
  replaceArr = []
) => {
  let template = "<div></div>";
  arr.length &&
    arr.map((it) => {
      if (it.id === templateCode) template = it.content;
      return undefined;
    });
  // 此处开始匹配替换特定字段
  orginArr.length !== 0 &&
    orginArr.map((item, i) => {
      template = template.replace(
        new RegExp(item, "g"),
        replaceArr[i] ? replaceArr[i] : "--"
      );
      return undefined;
    });
  return template;
};

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
