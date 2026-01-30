# Kai-OS: 数字主理人开源构建平台

[![][License: MIT]](https://opensource.org/licenses/MIT)
[![][Version]](https://github.com/wanyview/kai-os/releases)
[![][Stars]](https://github.com/wanyview/kai-os/stargazers)

## 📖 项目简介

**Kai-OS** 是一个开源的数字主理人构建平台，让任何人都能快速创建自己的"数字分身"。

本项目起源于 **TIER 咖啡沙龙** 的实践案例。我们发现，在运营线下沙龙、读书会、科普课堂时，组织者常面临"知识传递不标准、手忙脚乱、成果难沉淀"的痛点。

### 🎯 愿景

打造一个**数字主理人生态系统**（类似 iOS），让其他想成为"数字主理人"的人可以使用你的平台，快速搭建属于自己的 AI 助手。

### 👥 目标用户

- **活动组织者**：咖啡沙龙、读书会、科普课堂
- **内容创作者**：博主、自媒体、教育工作者
- **企业团队**：内部知识管理、客户服务

---

## 🚀 快速开始

### 方式一：本地运行

```bash
# 克隆项目
git clone https://github.com/wanyview/kai-os.git
cd kai-os

# 安装依赖
npm install

# 启动服务器
npm start
```

然后访问：http://localhost:3000

### 方式二：Docker 部署

```bash
docker build -t kai-os .
docker run -p 3000:3000 kai-os
```

### 方式三：API 开发

查看 [API 文档](docs/API.md) 了解如何通过 API 集成：

```javascript
// 获取所有主理人
const hosts = await fetch('http://localhost:3000/api/hosts').json();

// 与主理人对话
const reply = await fetch('http://localhost:3000/api/hosts/abc123/chat', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ message: '你好' })
}).json();
```

---

## ✨ 核心功能

### v0.5.0 (当前版本) - 读书会场景扩展 🆕

- ✅ **用户系统**：注册/登录/会话管理
- ✅ **主理人管理**：创建、编辑、删除数字主理人
- ✅ **5步创建向导**：简单几步打造专属分身
- ✅ **知识矩阵 (DATM) 可视化工具**
- ✅ **RESTful API**：主理人 CRUD + DATM 读写
- ✅ **Webhook 回调**：事件订阅 + 签名验证
- ✅ **开发者文档**：API 文档 + SDK 示例
- ✅ **读书会场景** 🆕
  - 6 种书籍类型 (文学/哲学/历史/科普/商业/心理)
  - 预置 Prompt 模板 (调度/专家/问答智能体)
  - DATM 智能推荐
  - 模板市场预设 (百年孤独/道德经/思考快与慢/人类简史)
- ✅ **Prompt 模板库**：内置多种场景模板

### 即将推出 (v0.6+)

- 📱 **模板市场**
- 🐳 **Docker 部署**
- 🔐 **API Key 认证**

---

## 📁 项目结构

```
kai-os/
├── src/
│   ├── api/           # API 路由
│   ├── pages/         # 页面
│   │   ├── dashboard.html      # 主理人管理面板
│   │   ├── create-host.html    # 创建主理人向导
│   │   ├── datm-viz.html       # 知识矩阵可视化工具
│   │   └── reading.html        # 🆕 读书会场景页面
│   └── assets/
│       ├── css/       # 样式
│       │   ├── style.css
│       │   ├── datm-viz.css
│       │   └── reading.css     # 🆕 读书会样式
│       ├── js/        # 脚本
│       │   ├── dashboard.js
│       │   ├── create-host.js
│       │   ├── datm-viz.js
│       │   └── reading.js      # 🆕 读书会逻辑
│       └── avatars/   # 头像
├── data/              # 数据存储 (JSON)
├── docs/              # 文档
│   ├── openapi.json   # OpenAPI 3.0 规范
│   ├── API.md         # 开发者文档
│   ├── FUDAN_SALON_*.md  # 沙龙方案/PPT
│   └── RESEARCH_REPORT.md  # 市场调研
├── prompts/           # 🆕 Prompt 模板
│   └── reading-club.yaml   # 读书会场景模板
├── server.js          # 主服务器
├── package.json
└── ROADMAP.md         # 版本路线图
```

---

## 🛠️ 技术栈

- **前端**: HTML5 + Vanilla JS (轻量、无框架)
- **后端**: Node.js + 原生 HTTP
- **存储**: SQLite / JSON 文件 (轻量)
- **部署**: Docker + GitHub Pages
- **AI 集成**: Coze (扣子) API

---

## 📦 版本历史

| 版本 | 日期 | 特性 |
|------|------|------|
| v0.1 | 2026-01-29 | 基础框架，Web 容器 + Prompt 模板 |
| v0.2 | 2026-01-29 | 平台基础设施，用户系统 + 主理人管理 |
| v0.3 | 2026-01-29 | 知识矩阵可视化工具，雷达图 + 时间线 + 演化分析 |
| v0.4 | 2026-01-29 | 开放 API，RESTful + Webhook + OpenAPI 规范 |
| v0.5 | 2026-01-29 | **读书会场景**，6种书籍类型 + 预置模板 + 模板市场 |
| v0.6 | 规划中 | 模板市场 + Docker 部署 |
| v1.0 | 规划中 | 正式平台发布 |

详见 [ROADMAP.md](ROADMD.md)

---

## 🔧 使用指南

### 1. 创建主理人

1. 打开 Kai-OS 首页
2. 点击"创建主理人"
3. 填写基本信息（名称、领域）
4. 选择形象风格
5. 调整知识矩阵 (DATM)
6. 配置 Coze 智能体
7. 发布或保存草稿

### 2. 使用知识矩阵可视化工具

1. 访问 http://localhost:3000/datm-viz
2. **实时雷达图**：拖动滑块调整四维知识值
3. **预设模板**：一键加载常见配置
4. **时间线**：记录 DATM 演化历史
5. **演化分析**：查看当前状态和发展建议
6. **导出配置**：保存为 JSON 文件

```javascript
// DATM 四维知识分类
const datm = {
  truth: 50,        // 科学性 (Science)
  goodness: 50,     // 社科性 (Social)
  beauty: 50,       // 人文性 (Humanity)
  intelligence: 50  // 创新性 (Innovation)
};
```

### 3. 配置 Coze 智能体

1. 登录 [Coze (扣子)](https://coze.cn)
2. 创建或选择 Bot
3. 获取 Bot ID 和 API Key
4. 在创建向导中填入

### 3. 集成到你的项目

```javascript
// 调用 API 获取主理人列表
const response = await fetch('/api/hosts');
const hosts = await response.json();

// 创建新主理人
const response = await fetch('/api/hosts', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({
    name: '我的助手',
    domain: 'education',
    datm: { truth: 70, goodness: 50, beauty: 60, intelligence: 80 }
  })
});
```

---

## 🤝 贡献指南

欢迎贡献代码或建议！

1. Fork 本项目
2. 创建分支 (`git checkout -b feature/amazing`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing`)
5. 提交 Pull Request

---

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

---

## 📞 联系我们

- **作者**: wanyview
- **GitHub**: https://github.com/wanyview/kai-os
- **论文**: [Kai-OS: A Dual-Axis Multi-Agent Framework](https://arxiv.org)

---

*Built with ❤️ by Kai Digital Agent*
