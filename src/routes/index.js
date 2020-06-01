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
  PersonneInternship,
} from "./../containers/Home/Personnel";
// 智能人事花名册添加
import PersonneRosterAdd from "./../containers/Home/Personnel/Roster/RosterAdd";
//  智能人事花名册员工档案
import PersonneRosterFiles from "./../containers/Home/Personnel/Roster/RadioFiles";
// 智能人事入职管理新增待入职
import PersonneEnterAdd from "./../containers/Home/Personnel/Enter/EnterAdd";
// 智能人事入职管理修改
import PersonneEnterEdit from "./../containers/Home/Personnel/Enter/EnterEdit";
// 智能人事离职管理办理离职
import PersonneQuitAdd from "./../containers/Home/Personnel/Quit/QuitAdd";
// 智能人事离职管理修改离职
import PersonneQuitEdit from "./../containers/Home/Personnel/Quit/QuitEdit";
// 智能人事调动管理发起调动
import PersonneTransferAdd from "./../containers/Home/Personnel/Transfer/TransferAdd";
// 智能人事调动管理修改调动
import PersonneTransferEdit from "./../containers/Home/Personnel/Transfer/TransferEdit";
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
        component: WorkModal,
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
            exact: true,
            component: PersonneRoster,
          },
          {
            title: "花名册-添加",
            path: "/personnel/roster/add",
            component: PersonneRosterAdd,
          },
          {
            title: "花名册-员工档案",
            path: "/personnel/roster/files/:id",
            component: PersonneRosterFiles,
          },
          {
            title: "入职管理",
            exact: true,
            path: "/personnel/entry",
            component: PersonneEntry,
          },
          {
            title: "入职管理-添加",
            path: "/personnel/entry/add",
            component: PersonneEnterAdd,
          },
          {
            title: "入职管理-修改",
            path: "/personnel/entry/edit/:id",
            component: PersonneEnterEdit,
          },
          {
            title: "转正管理",
            path: "/personnel/formal",
            component: PersonneFormal,
          },
          {
            title: "调动管理",
            exact: true,
            path: "/personnel/transfer",
            component: PersonneTransfer,
          },
          {
            title: "调动管理",
            path: "/personnel/transfer/add",
            component: PersonneTransferAdd,
          },
          {
            title: "调动管理",
            path: "/personnel/transfer/edit/:id",
            component: PersonneTransferEdit,
          },
          {
            title: "离职管理",
            exact: true,
            path: "/personnel/quit",
            component: PersonneQuit,
          },
          {
            title: "离职管理-办理离职",
            path: "/personnel/quit/add",
            component: PersonneQuitAdd,
          },
          {
            title: "离职管理-修改离职",
            path: "/personnel/quit/edit/:id",
            component: PersonneQuitEdit,
          },
          {
            title: "兼职实习管理",
            path: "/personnel/internship",
            component: PersonneInternship,
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
