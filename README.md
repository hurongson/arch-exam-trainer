# 一注方案训练

一级注册建筑师考试 · 建筑方案设计（作图题）AI 训练平台

## 功能特性

- 📚 **历年真题库**：2003-2025 年共 22 道真题，按类型/难度筛选
- ✏️ **专业建筑绘图画布**：基于 tldraw 5.x 的 9 种建筑专业自定义形状
  - **双线墙**：外墙240/内墙120/隔墙60，自动双线渲染，可拖拽端点调整
  - **门**：平开门（90度弧线）/推拉门/双开门，自动适配墙厚
  - **窗**：建筑制图标准四线表示法，支持固定/推拉/平开窗
  - **柱**：方柱/圆柱，240/360/500 常用尺寸，实心填充
  - **尺寸标注**：水平/垂直标注，自动计算尺寸，45度箭头，尺寸界线
  - **轴号**：圆圈+字母/数字，带引线，支持上下左右四个方向
  - **标高**：三角形标高符号，支持 ±0.000、3.600 等常用值
  - **楼梯**：双跑楼梯，自动踏步线，上下行箭头标注
  - **图框**：A1/A2/A3 标准图幅，带标题栏（项目名/图名/图号/比例/日期）
- 🤖 **AI 智能评图**：基于 DeepSeek + 官方评分标准的自动评分
- 📊 **学习进度追踪**：得分趋势、按类型统计、学习时长
- 🏛️ **建筑案例库**：优秀案例平立面分析，积累设计素材
- 📱 **每日飞书推送**：每天早上 7:30 推送建筑案例到飞书
- 💾 **方案导出**：支持 PNG 高清导出，方案 JSON 保存/加载

## 技术栈

- **框架**：Next.js 14 (App Router) + TypeScript
- **样式**：Tailwind CSS
- **绘图**：tldraw SDK
- **AI**：DeepSeek API (deepseek-chat)
- **状态管理**：Zustand
- **数据存储**：localStorage（单用户模式）
- **部署**：Vercel
- **定时任务**：GitHub Actions

## 快速开始

### 1. 安装依赖

```bash
pnpm install
```

### 2. 配置环境变量

复制 `.env.example` 为 `.env.local` 并填写：

```bash
cp .env.example .env.local
```

```env
# 应用访问密码（默认 admin123）
APP_PASSWORD=your-password

# DeepSeek API
DEEPSEEK_API_KEY=your-deepseek-api-key
DEEPSEEK_BASE_URL=https://api.deepseek.com
DEEPSEEK_MODEL=deepseek-chat

# 飞书机器人 Webhook
FEISHU_WEBHOOK_URL=your-feishu-webhook-url
```

### 3. 启动开发服务器

```bash
pnpm dev
```

访问 http://localhost:3000，输入访问密码进入。

## 部署到 Vercel

1. 将代码推送到 GitHub
2. 在 Vercel 导入项目
3. 配置环境变量
4. 部署完成

## 配置飞书每日推送

### 1. 创建飞书自定义机器人

1. 在飞书群中点击「设置」→「群机器人」→「添加机器人」→「自定义机器人」
2. 复制 Webhook 地址
3. 将 Webhook 地址配置到环境变量 `FEISHU_WEBHOOK_URL`

### 2. 配置 GitHub Actions 定时任务

1. 在 GitHub 仓库的 Settings → Secrets and variables → Actions 中添加：
   - `APP_URL`：你的应用部署地址（如 https://your-app.vercel.app）
2. Workflow 会在每天 UTC 23:30（北京时间 7:30）自动触发
3. 也可以在 Actions 页面手动触发测试

## 项目结构

```
arch-exam-trainer/
├── data/
│   ├── exams.json          # 历年真题数据
│   └── cases.json          # 建筑案例数据
├── scripts/
│   └── daily-push.js       # 每日推送脚本
├── src/
│   ├── app/
│   │   ├── api/
│   │   │   ├── evaluate/route.ts    # AI评图 API
│   │   │   └── feishu-push/route.ts # 飞书推送 API
│   │   ├── quiz/             # 真题题库
│   │   ├── train/            # 方案训练（画布）
│   │   ├── records/          # 训练记录
│   │   ├── progress/         # 学习进度
│   │   ├── cases/            # 案例库
│   │   └── login/            # 登录页
│   ├── components/
│   │   ├── canvas/           # 画布组件
│   │   └── layout/           # 布局组件
│   ├── lib/
│   │   ├── deepseek.ts       # DeepSeek API 封装
│   │   ├── storage.ts        # 本地存储
│   │   ├── rubric.ts         # 评分标准
│   │   └── utils.ts          # 工具函数
│   ├── types/
│   │   └── index.ts          # 类型定义
│   └── store/                # 状态管理
├── .github/workflows/
│   └── daily-push.yml        # 每日推送定时任务
└── ...
```

## 使用说明

### 开始训练

1. 进入「真题题库」，选择一道真题
2. 查看任务书和设计要求
3. 点击「开始方案训练」进入画布
4. 使用绘图工具完成方案设计
5. 点击「提交AI评图」获取评分和改进建议

### 绘图技巧

- 按 `R` 矩形工具，`L` 直线工具，`T` 文字工具
- 使用左侧工具栏选择绘图工具
- 方案每 30 秒自动保存
- 可导出方案 JSON 备份

## 评分标准

基于一级注册建筑师考试官方评分标准，包含五大类：
1. 总平面设计（15分）
2. 功能分区与平面布局（35分）
3. 流线组织（20分）
4. 空间设计与规范（15分）
5. 图面表达与完整性（15分）

不同建筑类型（交通/医养/文体等）有针对性的附加评分标准。

## 注意事项

- 本应用为单用户模式，数据存储在浏览器本地，清除浏览器数据会丢失记录
- AI 评图结果仅供参考，最终评分以官方评卷为准
- 建议定期导出重要方案的 JSON 备份

## License

MIT
