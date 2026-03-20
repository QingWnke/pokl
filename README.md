# HTML5 Mini-Game Portal Platform

一个完整的全栈 HTML5 小游戏门户平台，使用 **React 18 + TypeScript + Tailwind CSS + Vite** 构建前端，使用 **Node.js + Express + TypeScript + MongoDB + Mongoose** 构建后端，包含：

- 面向用户的小游戏浏览、分类、评分评论、相关推荐与游戏播放页面。
- 完整的 `/admin` 后台系统：JWT 登录、RBAC、游戏/分类/评论/广告/设置管理。
- GitHub 开源 HTML5 游戏元数据导入模块。
- 广告位预留与展示配置、广告统计可视化。
- MongoDB 初始化种子数据、默认管理员、可直接本地开发与部署。

---

## 1. 技术栈

### Frontend
- React 18
- TypeScript
- Tailwind CSS v3
- React Router v6
- Vite
- Axios
- React Hook Form + Zod
- Recharts
- React Lazy Load

### Backend
- Node.js 20+
- Express.js
- TypeScript
- MongoDB + Mongoose
- JWT Authentication
- bcrypt 密码加密
- sanitize-html / express-mongo-sanitize / helmet 基础安全防护

---

## 2. 项目结构

```plaintext
html5-mini-game-portal/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── admin/
│   │   ├── hooks/
│   │   ├── api/
│   │   ├── types/
│   │   ├── utils/
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── router.tsx
│   ├── package.json
│   ├── tsconfig.json
│   ├── vite.config.ts
│   ├── tailwind.config.js
│   ├── postcss.config.js
│   ├── Dockerfile
│   └── .env.example
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   ├── models/
│   │   ├── routes/
│   │   ├── middleware/
│   │   ├── services/
│   │   ├── utils/
│   │   ├── config/
│   │   ├── app.ts
│   │   └── types.ts
│   ├── package.json
│   ├── tsconfig.json
│   ├── Dockerfile
│   └── .env.example
├── docker-compose.yml
├── .gitignore
└── README.md
```

---

## 3. 环境要求

- Node.js >= 20
- npm >= 10
- MongoDB >= 7
- 推荐开发环境：Linux/macOS/WSL

---

## 4. 本地安装与运行

### 4.1 启动 MongoDB

如果本机已安装 MongoDB：

```bash
mongod --dbpath /path/to/your/db
```

或使用 Docker：

```bash
docker compose up mongodb -d
```

### 4.2 配置后端环境变量

```bash
cd backend
cp .env.example .env
```

可选修改：
- `MONGODB_URI`
- `JWT_SECRET`
- `ADMIN_EMAIL`
- `ADMIN_PASSWORD`
- `CORS_ORIGIN`
- `GITHUB_TOKEN`

### 4.3 配置前端环境变量

```bash
cd frontend
cp .env.example .env
```

默认即可：
- `VITE_API_BASE_URL=http://localhost:4000/api`
- `VITE_APP_NAME=PlayNexus`

### 4.4 安装依赖

```bash
cd backend && npm install
cd ../frontend && npm install
```

### 4.5 启动开发环境

分别启动：

```bash
cd backend
npm run dev
```

```bash
cd frontend
npm run dev
```

访问：
- 前台：`http://localhost:5173`
- 后台登录：`http://localhost:5173/admin/login`
- 健康检查：`http://localhost:4000/health`

### 4.6 默认管理员账号

后台首次启动会自动创建管理员：

- Email: `admin@example.com`
- Password: `Admin123!`

如需修改，请在首次运行前修改 `backend/.env` 中的 `ADMIN_EMAIL` 与 `ADMIN_PASSWORD`。

---

## 5. 主要功能说明

## 5.1 前端用户侧

- 固定左侧导航栏，移动端自动切换为抽屉菜单。
- 游戏分类筛选、热门游戏、最新上线、评分评论、关于我们、联系我们页面。
- 响应式卡片网格：桌面 3 列、平板 2 列、手机 1 列。
- 游戏播放页：iframe 播放、全屏、重启、返回首页、评论提交、相关推荐、广告位展示。
- 首页网格中插入内联广告卡，带强制 `Ad` 标识。

## 5.2 后台管理

- `/admin` 受保护路由，未登录自动跳转 `/admin/login`。
- 游戏 CRUD、分类 CRUD、评论审核、广告 CRUD、系统设置、管理员与 RBAC。
- GitHub 仓库导入：输入 `owner/repo` 获取开源游戏元数据。
- 数据看板：访问量、热门游戏、广告 CTR 可视化。
- 备份导出：从后台一键导出 JSON 备份。

## 5.3 安全策略

- JWT 鉴权。
- bcrypt 加密管理员密码。
- Zod 参数校验。
- sanitize-html + express-mongo-sanitize 过滤输入。
- helmet / rate-limit / compression 增强安全与性能。

---

## 6. GitHub 开源游戏导入说明

后台 `游戏管理` 页面提供“GitHub 导入”按钮：

1. 输入仓库标识，例如：`owner/repo`
2. 后端调用 GitHub API 读取仓库信息。
3. 自动校验开源许可证，仅允许：
   - MIT
   - Apache-2.0
   - BSD-2-Clause / BSD-3-Clause
   - MPL-2.0
4. 返回仓库名称、描述、仓库地址、License、主页、开发者、更新时间等元数据。
5. 管理员可手动复制到创建游戏表单中完成发布。

> 注意：自动导入的是“元数据和许可证资格验证”，静态资源拉取与 CDN 同步可作为下一阶段扩展点。

---

## 7. 生产部署指南

## 7.1 Linux + Nginx

### 后端

```bash
cd backend
npm install
npm run build
npm run start
```

建议使用 PM2：

```bash
npm install -g pm2
pm2 start dist/app.js --name mini-game-backend
pm2 save
```

### 前端

```bash
cd frontend
npm install
npm run build
```

将 `frontend/dist` 交给 Nginx 托管：

```nginx
server {
    listen 80;
    server_name your-domain.com;

    root /var/www/playnexus/frontend/dist;
    index index.html;

    location / {
        try_files $uri /index.html;
    }

    location /api/ {
        proxy_pass http://127.0.0.1:4000/api/;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    }
}
```

配合 Certbot 开启 HTTPS：

```bash
sudo certbot --nginx -d your-domain.com
```

## 7.2 Vercel / Netlify

### 前端
- Root Directory 指向 `frontend`
- Build Command: `npm run build`
- Output Directory: `dist`
- 环境变量：`VITE_API_BASE_URL=https://your-backend-domain/api`

### 后端
由于本项目后端是 Express 持久进程，推荐部署到：
- Railway
- Render
- Fly.io
- Linux VPS + Nginx

如果要迁移到 Vercel Serverless，需要将 `backend/src/app.ts` 拆成 serverless handler 结构。

## 7.3 Docker Compose

根目录运行：

```bash
docker compose up --build
```

服务：
- frontend: `http://localhost:5173`
- backend: `http://localhost:4000`
- mongodb: `mongodb://localhost:27017`

---

## 8. API 概览

### Public API
- `GET /api/home`
- `GET /api/categories`
- `GET /api/games/popular`
- `GET /api/games/new`
- `GET /api/ratings`
- `GET /api/games/:slug`
- `POST /api/games/:slug/reviews`
- `POST /api/games/:slug/play`
- `POST /api/contact`
- `GET /api/settings`

### Auth API
- `POST /api/auth/login`

### Admin API
- `GET /api/admin/dashboard`
- `GET/POST/PATCH/DELETE /api/admin/games`
- `POST /api/admin/games/import-github`
- `GET/POST/PATCH/DELETE /api/admin/categories`
- `GET/PATCH/DELETE /api/admin/reviews`
- `GET/POST/PATCH/DELETE /api/admin/ads`
- `GET/PUT /api/admin/settings`
- `GET/POST/DELETE /api/admin/admins`
- `GET /api/admin/backup/export`
- `POST /api/admin/backup/preview`

---

## 9. 二次开发建议

- 将 GitHub 导入扩展为“下载静态资源并同步到对象存储/CDN”。
- 增加用户收藏、玩家账号体系、多语言国际化。
- 为评论系统增加图像审核与 AI 垃圾评论评分。
- 在广告模块中接入 Google AdSense / Media.net / Unity Ads for Web 脚本渲染适配层。
- 为数据统计接入真实埋点与时序数据库，而不只是后台可编辑指标。

---

## 10. 常见问题

### MongoDB 连接失败
- 检查 `backend/.env` 中 `MONGODB_URI` 是否正确。
- 检查 MongoDB 是否已启动。

### 登录后台失败
- 确保后端首次启动成功创建管理员。
- 如果修改了默认密码，需同步使用新密码登录。

### GitHub 导入报许可证不兼容
- 仓库 license 不在允许列表中，或 GitHub API 未返回合法 SPDX 标识。

### 前端接口访问失败
- 检查 `frontend/.env` 中 `VITE_API_BASE_URL`。
- 检查后端 CORS 配置 `CORS_ORIGIN`。

---

## 11. 后续优化方向

- 接入 Redis 缓存热门榜单与首页内容。
- 静态资源 CDN 化与图像自动压缩。
- 增加 E2E 测试、API 单元测试、CI/CD pipeline。
- 支持本地化、PWA、离线缓存与玩家档案。
