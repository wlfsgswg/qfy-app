import axios from "axios";
import { message } from "antd";
// import { message } from "antd";

const Api = {};
const method = ["get", "post", "put", "delete"];

method.forEach((item) => {
  /**
   *
   * @param {string} url  接口地址
   * @param {object} data 请求数据
   * @param {object} option 请求配置
   *
   * @return {Promise}
   */
  Api[item] = (url = "", data, options = {}) =>
    new Promise((resolve, reject) => {
      const headers = {};
      const token = "";
      if (token) headers["Authorization"] = `Bearer ${token}`;

      let _options = {
        headers,
      };
      if (options && options.headers) {
        _options.headers = Object.assign({}, headers, options.headers);
      }

      axios(
        Object.assign(
          {
            url: `${url}`,
            method: item,
            params: item === "get" ? data : null,
            data,
          },
          _options
        )
      )
        .then((res) => {
          resolve(res);
        })
        .catch((error) => {
          if (
            error.response &&
            error.response.data &&
            error.response.data.code === "500"
          )
            message.error(
              error.response && error.response.data && error.response.data.msg
                ? error.response.data.msg
                : "请求出错！"
            );
          reject(error.response);
        });
    });
});

export default Api;
