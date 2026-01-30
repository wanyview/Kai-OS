# Kai-OS Skill 包

> 一个让任何人都能快速创建数字主理人的 Skill

## 📦 Skill 信息

- **名称**: kai-os
- **版本**: 1.0.0
- **描述**: 数字主理人开源构建框架，支持多场景、多智能体协作
- **作者**: wanyview

## 🚀 快速安装

### 在 Moltbot 中安装

```bash
# 查看 skill 状态
moltbot skill list | grep kai-os

# 安装 skill
moltbot skill install kai-os
```

### 在 Claude Code 中使用

```bash
# 克隆 skill
git clone https://github.com/wanyview/Kai-OS-Skill ~/.claude-code/skills/kai-os
```

## 🎯 使用方式

### 方式一：命令行创建

```bash
# 创建默认主理人
kai-os create --name "我的助手" --domain "general"

# 创建特定场景
kai-os create --name "咖啡助手" --template "coffee"
kai-os create --name "读书助手" --template "reading"
kai-os create --name "茶道大师" --template "tea"
```

### 方式二：配置文件

```yaml
# my-host.yaml
name: 我的数字主理人
description: 帮我处理日常事务
domain: general

# DATM 配置
datm:
  truth: 70
  goodness: 60
  beauty: 60
  intelligence: 80

# 智能体配置
agents:
  scheduler:
    prompt: "你是一个调度智能体..."
  expert:
    prompt: "你是一个领域专家..."
  qa:
    prompt: "你是一个问答助手..."

# 运行
kai-os create --config my-host.yaml
```

### 方式三：API 调用

```javascript
import { KaiOS } from 'kai-os-sdk';

const kai = new KaiOS({
  apiKey: 'your-api-key'
});

// 创建主理人
const host = await kai.createHost({
  name: '我的助手',
  domain: 'general',
  datm: { truth: 70, goodness: 60, beauty: 60, intelligence: 80 }
});

// 对话
const reply = await kai.chat(host.id, '你好！');
```

## 📋 可用模板

| 模板 | 场景 | DATM 特点 |
|------|------|----------|
| `general` | 通用助手 | 均衡 |
| `coffee` | 咖啡知识 | Truth ↑ |
| `reading` | 读书会 | Beauty ↑ |
| `tea` | 茶道文化 | Goodness ↑ |
| `education` | 教育辅导 | Truth/Intelligence ↑ |
| `art` | 艺术鉴赏 | Beauty ↑ |
| `health` | 健康养生 | Goodness ↑ |
| `business` | 商业顾问 | Intelligence ↑ |

## 🔧 核心功能

### 1. 多智能体协作

```
用户输入 → 调度智能体 → 分发任务
                         → 专家智能体 → 深度回答
                         → 问答智能体 → 快速响应
```

### 2. DATM 知识矩阵

```
DATM (Dual-Axis Knowledge Matrix)

Truth (科学性): 70      - 客观、准确、有据可查
Goodness (社科性): 60   - 价值观引导、社会责任
Beauty (人文性): 60     - 美感、共情、情感连接
Intelligence (创新性): 80 - 创新思维、启发思考

动态调整，根据场景自动优化
```

### 3. Prompt 模板库

```
内置多种场景的 Prompt 模板：

├── scheduler/    # 调度智能体
│   ├── general.yaml
│   ├── education.yaml
│   └── meeting.yaml
│
├── expert/       # 专家智能体
│   ├── general.yaml
│   ├── coffee.yaml
│   ├── reading.yaml
│   └── tea.yaml
│
└── qa/           # 问答智能体
    ├── general.yaml
    ├── casual.yaml
    └── professional.yaml
```

### 4. 知识沉淀

```
每次对话后自动：
1. 提取关键知识点
2. 更新 DATM 状态
3. 生成对话摘要
4. 存储到知识库
```

## 🛠️ 配置选项

### 基础配置

```yaml
# config.yaml
host:
  name: "我的主理人"
  description: "描述"
  avatar: "avatar.png"  # 可选

datm:
  truth: 70
  goodness: 60
  beauty: 60
  intelligence: 80

# 高级配置
advanced:
  model: "gpt-4"        # 使用的模型
  temperature: 0.7      # 温度参数
  maxTokens: 2000       # 最大输出
  streaming: true       # 流式输出
```

### 知识库配置

```yaml
knowledge:
  enabled: true
  storage: "./knowledge"
  autoIndex: true
  chunkSize: 500
```

## 📱 部署方式

### 本地部署

```bash
# 克隆
git clone https://github.com/wanyview/Kai-OS-Skill.git
cd Kai-OS-Skill

# 安装依赖
npm install

# 运行
npm start
```

### Docker 部署

```bash
# 构建
docker build -t kai-os .

# 运行
docker run -p 3000:3000 -v $(pwd)/data:/app/data kai-os
```

### Kubernetes 部署

```bash
kubectl apply -f k8s/
```

## 🔌 API 接口

### REST API

```
GET  /api/hosts          # 列出所有主理人
POST /api/hosts          # 创建主理人
GET  /api/hosts/:id      # 获取主理人详情
PUT  /api/hosts/:id      # 更新主理人
DELETE /api/hosts/:id    # 删除主理人
POST /api/hosts/:id/chat # 对话
GET  /api/datm/:hostId   # 获取 DATM
PUT  /api/datm/:hostId   # 更新 DATM
```

### WebSocket

```
ws://localhost:3000/ws

// 订阅消息
{
  "type": "subscribe",
  "hostId": "host_123"
}

// 发送消息
{
  "type": "message",
  "hostId": "host_123",
  "content": "你好！"
}
```

## 🔒 安全配置

### API Key 认证

```yaml
auth:
  enabled: true
  type: "api-key"
  keys:
    - "key-1"
    - "key-2"
```

### Webhook 签名

```yaml
webhooks:
  enabled: true
  secret: "your-webhook-secret"
  events:
    - "message.sent"
    - "datm.updated"
```

## 📊 监控指标

### 内置指标

```
- 对话次数
- 响应延迟
- DATM 分布
- 用户满意度
```

### 集成 Prometheus

```yaml
monitoring:
  enabled: true
  prometheus:
    enabled: true
    port: 9090
```

## 🐛 故障排查

### 常见问题

```bash
# 1. 启动失败
$ kai-os doctor

# 2. 对话无响应
$ kai-os logs

# 3. 清理数据
$ kai-os reset --force
```

### 日志查看

```bash
# 查看日志
kai-os logs --tail

# 查看错误
kai-os logs --level error
```

## 🤝 贡献指南

1. Fork 本仓库
2. 创建分支 (`git checkout -b feature/amazing`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送分支 (`git push origin feature/amazing`)
5. 创建 Pull Request

## 📄 许可证

MIT License - 详见 [LICENSE](LICENSE) 文件

## 📞 联系方式

- **GitHub**: https://github.com/wanyview/Kai-OS-Skill
- **作者**: wanyview
- **邮箱**: wendysnake55@qq.com

---

*Generated by Kai Digital Agent*
*Date: 2026-01-29*
