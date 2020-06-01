import React from "react";
import ReactDOM from "react-dom";
import { ConfigProvider } from "antd";
import { createStore } from "redux";
import "./index.less";
import App from "./App.jsx";
import * as serviceWorker from "./serviceWorker";
import zhCN from "antd/es/locale/zh_CN";
import { Provider } from "react-redux";
import moment from "moment";
import "moment/locale/zh-cn";
import Reauest from "./../src/utils/request";
import storeData from "./store/reducers";
moment.locale("zhCN");
window.Request = Reauest;

let store = createStore(storeData);

ReactDOM.render(
  <ConfigProvider locale={zhCN}>
    <Provider store={store}>
      <App />
    </Provider>
  </ConfigProvider>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
// "proxy": "http://192.168.1.115:8070"
serviceWorker.unregister();
