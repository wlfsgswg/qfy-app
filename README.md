## 简介

企蜂云 客户端

## 项目使用

1. create-react-app 脚手架

2. 安装`package.json`中依赖

```sh
npm install
```

3. 开发环境启动服务

```sh
# 启动node 服务
npm run dev
# 或者
npm start

# 开始编译react
npm run start

# 项目打包
npm run build

```

### antd 配置

```
npm install antd --save

```

### 公共组件说明 `src/components`

- MyIcon

```jsx
// type 是对应iconfont上图标值em
<MyIcon type="icon-pinglun" />
```

注意 ⚠️ 图标的选取最好是选择单身图标，因为单色图标可以设置颜色


- Dialog

```jsx
详情弹出框
解决以变量控制弹出时多次声明变量的繁琐

```

如有问题请发邮件：`2496436621@qq.com`
