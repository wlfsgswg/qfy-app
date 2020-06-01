const siderObject = {
  openKeys: ["员工关系", "统计分析"],
  name: "智能人事",
  current: "员工花名册",
  menu: [
    {
      title: "员工花名册",
      path: "/personnel/roster",
    },
    {
      title: "员工关系",
      path: "",
      children: [
        {
          title: "入职管理",
          path: "/personnel/entry",
        },
        {
          title: "转正管理",
          path: "/personnel/formal",
        },
        {
          title: "调动管理",
          path: "/personnel/transfer",
        },
        {
          title: "离职管理",
          path: "/personnel/quit",
        },
        {
          title: "兼职实习管理",
          path: "/personnel/internship",
        },
        {
          title: "合同管理",
          path: "/personnel/contract",
        },
        {
          title: "员工关怀",
          path: "/personnel/staff",
        },
        {
          title: "人事异动记录",
          path: "/personnel/record",
        },
      ],
    },
    {
      title: "统计分析",
      path: "",
      children: [
        {
          title: "员工数量统计",
          path: "/personnel/number",
        },
        {
          title: "在职员工统计",
          path: "/personnel/incumbency",
        },
        {
          title: "离职员工统计",
          path: "/personnel/statistics",
        },
      ],
    },
  ],
};
export { siderObject };
