import axios from "axios";
import { message } from "antd";
import { getToken } from "./index";

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
      const headers = {
        //   "X-CSRF-TOKEN": _global && _global.csrf_token,
      };
      const token = getToken();
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
        .then((res) => resolve(res))
        .catch((error) => {
          if (error.response && error.response.status === 401) {
            // window.location.href = "/brand/login";
            // reject(error.response);
            console.log("请先登录");
            return;
          }

          // if (error.response && error.response.status === 419) {
          //     return refreshCrsfToken(item, url, data, options).then(r => resolve(r)).catch(err => reject(err.response));
          // }
          //   console.error(error)
          if (error.response && error.response.data) {
            if (!options.slient) {
              if (error.response.status >= 500) {
                message.error("服务器开了个小差");
              } else if (typeof error.response.data == "object") {
                message.error(
                  error.response.data.message || error.response.data.error
                );
              } else {
                message.error(error.response.data);
              }
            }
            reject(error.response);
          }
        });
    });
});

export default Api;
