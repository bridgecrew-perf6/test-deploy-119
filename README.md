# 互联网医院后台管理系统（基于vue-element-admin进行搭建）

## 2022.1.5
```(lua)
   views目录下
   perscription-list 处方列表
   reviewer 开始审方

   router目录下
   modules/prescription  关于处方列表路由调用
```



## 2021-12-09 开发示例说明  当前版本不涉及相关动态的角色路由权限
故只需要关注router/index.js文件下**constantRoutes**的变量

在modules下添加相关对应的一级路由和子路由等  按照提供的处方库和药品库提供的范例

导航栏相关更新layout/navBar组件   面包屑相关在components/breadcrumb下

函数编写按照utls/index.js下的示例  需要对全局公用函数添加做一个简要变量和使用说明
```
/**
 * This is just a simple version of deep copy
 * Has a lot of edge cases bug
 * If you want to use a perfect deep copy, use lodash's _.cloneDeep
 * @param {Object} source
 * @returns {Object}
 */
 ```

 variables.scss 统一修改界面组件的样式配色


## 目录说明
```
api ：接口请求
assets ：一些静态文件
components ： 封装组件
direcetive ：自定义指令
filters ：过滤器
icons ：图标
layout ：全局框架组件(非常重要)
router ：路由
store ：配置vuex
styles ：全局样式文件
utils ：工具类
views ：页面组件
App.vue ：父组件，其他的组件都是嵌套在App.vue里
main.js ：全局入口文件，将App.vue设置为全局父组件进行渲染
permissions.js ：登录的校验和登录之后的路由跳转
setting.js ：配置文件
```

## 功能

```
- 登录 / 注销

- 权限验证
  - 页面权限
  - 指令权限
  - 权限配置
  - 二步登录

- 多环境发布
  - dev
  - sit
  - stage
  - prod

- 全局功能
  - 国际化多语言
  - 多种动态换肤
  - 动态侧边栏（支持多级路由嵌套）
  - 动态面包屑
  - 快捷导航(标签页)
  - Svg Sprite 图标
  - 本地/后端 mock 数据
  - Screenfull全屏
  - 自适应收缩侧边栏

- 编辑器
  - 富文本
  - Markdown
  - JSON 等多格式

- Excel
  - 导出excel
  - 导入excel
  - 前端可视化excel
  - 导出zip

- 表格
  - 动态表格
  - 拖拽表格
  - 内联编辑

- 错误页面
  - 401
  - 404

- 組件
  - 头像上传
  - 返回顶部
  - 拖拽Dialog
  - 拖拽Select
  - 拖拽看板
  - 列表拖拽
  - SplitPane
  - Dropzone
  - Sticky
  - CountTo

- 综合实例
- 错误日志
- Dashboard
- 引导页
- ECharts 图表
- Clipboard(剪贴复制)
- Markdown2html
```

## 开发

```bash
# 克隆项目
git clone https://github.com/PanJiaChen/vue-element-admin.git

# 进入项目目录
cd vue-element-admin

# 安装依赖
npm install

# 建议不要直接使用 cnpm 安装依赖，会有各种诡异的 bug。可以通过如下操作解决 npm 下载速度慢的问题
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问 http://localhost:9527

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

## 其它

```bash
# 预览发布环境效果
npm run preview

# 预览发布环境效果 + 静态资源分析
npm run preview -- --report

# 代码格式检查
npm run lint

# 代码格式检查并自动修复
npm run lint -- --fix
```


