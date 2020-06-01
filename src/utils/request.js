import axios from "axios";
import { message } from "antd";

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
      let _options = {
        headers,
      };

      if (options && options.headers) {
        _options.headers = Object.assign({}, headers, options.headers);
      }

      // http request 拦截器
      axios.interceptors.request.use(
        (config) => {
          // 判断是否存在token，如果存在的话，则每个http header都加上token
          return config;
        },
        (err) => {
          return Promise.reject(err);
        }
      );

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
          console.log("后台开始报错啦");
          // console.log(error.response);
          if (
            error.response &&
            error.response.status &&
            error.response.status === 500
          )
            message.error(
              error.response.data && error.response.data.msg
                ? error.response.data.msg
                : "请求出错！"
            );
          reject(error.response);
        });
    });
});

export default Api;
