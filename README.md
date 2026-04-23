# MVP Starter

轻量级模块化 MVP 开发框架，专为快速原型开发设计。

## 核心特性

- **极简依赖** - 核心运行时仅 4 个依赖
- **插件架构** - 通过配置启用/禁用功能，解耦设计
- **可选数据库** - 默认无需数据库，开箱即用
- **易于扩展** - 轻松添加自定义插件和路由

## 项目结构

```
mvp-starter/
├── config/
│   └── defaults.js     # 配置文件（插件开关、功能配置）
├── src/
│   ├── server/         # 后端（Express API）
│   │   ├── server.js   # 服务器入口
│   │   └── plugins/    # 插件目录
│   │       ├── index.js      # 插件管理器
│   │       ├── auth/         # 认证插件（可选）
│   │       └── database/     # 数据库插件（可选）
│   └── client/        # 前端（React + Vite）
│       ├── App.jsx    # 主应用组件
│       ├── main.jsx   # 前端入口
│       ├── index.html # HTML 模板
│       └── api/       # API 客户端
│           └── client.js
├── .env.example       # 环境变量模板
├── vite.config.js     # Vite 配置
└── package.json
```

## 快速开始

```bash
# 1. 安装依赖
npm install

# 2. 启动开发服务器（后端 3000 + 前端 5173）
npm run dev

# 3. 访问 http://localhost:5173

# 4. 运行测试
npm test
```

## 环境变量配置

复制 `.env.example` 为 `.env`，根据需要配置：

```bash
cp .env.example .env
```

主要配置项：
- `PORT` - 服务器端口（默认 3000）
- `SESSION_SECRET` - **生产环境必须设置**，会话密钥
- `CORS_ORIGIN` - 允许的跨域源
- `DB_CONNECTION_STRING` - 数据库连接字符串（启用数据库插件时需要）

## 配置说明

编辑 `config/defaults.js` 控制功能开关：

```javascript
plugins: {
  auth: false,      // 启用认证模块
  database: false,  // 启用数据库（需配置 DB_CONNECTION_STRING）
}
```

## 开发指南

### 添加新的 API 路由

**方式一：创建插件（推荐）**

1. 创建 `src/server/plugins/my-plugin/index.js`：

```javascript
export default {
  name: 'my-plugin',
  // 可选：插件挂载时执行
  mount(app, config) {
    console.log('我的插件已加载');
  },
  // 定义路由
  routes(app, config) {
    app.get('/api/v1/my-endpoint', (req, res) => {
      res.json({ message: 'Hello!' });
    });
  },
};
```

2. 在 `config/defaults.js` 中启用：

```javascript
plugins: {
  myPlugin: true,  // 添加插件开关
}
```

3. 在 `src/server/server.js` 中加载（已配置后会自动扫描）。

**方式二：直接在 server.js 中添加**

对于简单场景，可以直接在 `src/server/server.js` 中添加路由。

### 前端调用 API

使用已封装好的 API 客户端：

```javascript
import api from './api/client.js';

// GET 请求
const data = await api.get('/users');

// POST 请求
const newUser = await api.post('/users', { name: '张三' });

// PUT 请求
const updated = await api.put('/users/1', { name: '李四' });

// DELETE 请求
await api.delete('/users/1');
```

### 添加新的前端页面

1. 在 `src/client/App.jsx` 的 `renderPage` 函数中添加路由：

```javascript
case 'newpage':
  return <NewPage />;
```

2. 在导航栏添加按钮跳转到该页面。

## API 端点说明

| 端点 | 方法 | 说明 |
|------|------|------|
| `/health` | GET | 健康检查 |
| `/api/v1/*` | * | 自定义路由（来自插件）|

启用认证插件后可使用：
- `POST /api/v1/auth/register` - 注册
- `POST /api/v1/auth/login` - 登录
- `POST /api/v1/auth/logout` - 登出
- `GET /api/v1/auth/me` - 获取当前用户

## 目录规范

| 目录 | 用途 |
|------|------|
| `src/server/plugins/` | 后端插件，每个插件一个文件夹 |
| `src/client/api/` | 前端 API 调用代码 |
| `src/client/components/` | React 组件（组件较多时创建）|
| `config/` | 配置文件 |

## 技术栈

| 层级 | 技术 |
|------|------|
| 前端框架 | React 19 |
| 前端构建 | Vite 6 |
| 后端框架 | Express 5 |
| 测试框架 | Vitest |
| 包管理 | npm |

## 与 hackathon-starter 对比

| 特性 | hackathon-starter | mvp-starter |
|------|------------------|------------|
| 依赖数量 | 90+ | 4 核心 |
| 数据库 | MongoDB 必选 | 可选 |
| 认证 | 10+ OAuth 提供商 | 简单 Session |
| 启动时间 | 30+ 分钟 | 5 分钟 |

## 常见问题

**Q: 前端 5173 端口打不开？**
A: 确保后端 3000 端口已启动，且两边都在运行。

**Q: 如何启用数据库？**
A: 设置 `plugins.database = true` 并配置 `DB_CONNECTION_STRING` 环境变量。

**Q: 生产环境如何部署？**
A: `npm run build` 构建前端到 `dist/`，然后 `npm start` 启动后端。
