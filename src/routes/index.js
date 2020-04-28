import { Login, Home, NotFound, Help, Feedback } from "./../containers";
//
import {
  AppModal,
  BackstageModal,
  MailModal,
  MessageModal,
  UserModal,
  WorkModal,
  PersonnelModal,
} from "./../containers/Home/index.js";
// 智能人事嵌套路由
import {
  PersonneRoster,
  PersonneEntry,
  PersonneFormal,
  PersonneTransfer,
  PersonneQuit,
  PersonneContract,
  PersonneStaff,
  PersonneRecord,
  PersonneNumber,
  PersonneIncumbency,
  PersonneStatistics,
} from "./../containers/Home/Personnel";
export const routes = [
  {
    path: "/login",
    component: Login,
  },
  {
    path: "/help",
    component: Help,
  },
  {
    path: "/feedback",
    component: Feedback,
  },
  {
    path: "/",
    component: Home,
    routes: [
      {
        path: "/",
        component: MessageModal,
        exact: true,
        routes: [],
      },
      {
        path: "/message",
        component: MessageModal,
        routes: [],
      },
      {
        path: "/work",
        component: WorkModal,
        routes: [],
      },
      {
        path: "/mail",
        component: MailModal,
        routes: [],
      },
      {
        path: "/app",
        component: AppModal,
        routes: [],
      },
      {
        path: "/backstage",
        component: BackstageModal,
        routes: [],
      },
      {
        path: "/user",
        component: UserModal,
        routes: [],
      },
      {
        path: "/personnel",
        component: PersonnelModal,
        routes: [
          {
            title: "花名册",
            exact: true,
            path: "/personnel",
            component: PersonneRoster,
          },
          {
            title: "花名册",
            path: "/personnel/roster",
            component: PersonneRoster,
          },
          {
            title: "入职管理",
            path: "/personnel/entry",
            component: PersonneEntry,
          },
          {
            title: "转正管理",
            path: "/personnel/formal",
            component: PersonneFormal,
          },
          {
            title: "调动管理",
            path: "/personnel/transfer",
            component: PersonneTransfer,
          },
          {
            title: "离职管理",
            path: "/personnel/quit",
            component: PersonneQuit,
          },
          {
            title: "合同管理",
            path: "/personnel/contract",
            component: PersonneContract,
          },
          {
            title: "员工关怀",
            path: "/personnel/staff",
            component: PersonneStaff,
          },
          {
            title: "人事异常记录",
            path: "/personnel/record",
            component: PersonneRecord,
          },
          {
            title: "员工数量统计",
            path: "/personnel/number",
            component: PersonneNumber,
          },
          {
            title: "在职员工统计",
            path: "/personnel/incumbency",
            component: PersonneIncumbency,
          },
          {
            title: "离职员工统计",
            path: "/personnel/statistics",
            component: PersonneStatistics,
          },
        ],
      },
      {
        path: "*",
        component: NotFound,
      },
    ],
  },
  {
    path: "*",
    component: NotFound,
  },
];

export const contentRoutes = routes[1].routes;
