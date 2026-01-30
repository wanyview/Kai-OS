# Kai-OS API 开发者文档

> v0.4.0 - 开放 API 与第三方接入

## 📚 概述

Kai-OS 提供 RESTful API，允许开发者：
- 创建和管理数字主理人
- 读取和更新知识矩阵 (DATM)
- 配置 Webhook 回调
- 集成到第三方应用

## 🔗 基础 URL

| 环境 | URL |
|------|-----|
| 本地开发 | `http://localhost:3000` |
| 生产环境 | `https://kai-os.example.com` |

## 📖 API 文档

完整的 OpenAPI 规范请查看：[openapi.json](../openapi.json)

可使用 Swagger UI 查看交互式文档：
```
http://localhost:3000/docs/openapi.json
```

---

## 🤖 主理人 API

### 获取所有主理人

```bash
GET /api/hosts
```

**参数：**
| 参数 | 类型 | 描述 |
|------|------|------|
| `status` | string | 过滤: `draft` / `published` |
| `domain` | string | 按领域过滤 |

**响应：**
```json
{
  "success": true,
  "data": [
    {
      "id": "abc123",
      "name": "咖啡助手",
      "description": "专业咖啡知识助手",
      "domain": "coffee",
      "status": "published",
      "datm": {
        "truth": 80,
        "goodness": 60,
        "beauty": 40,
        "intelligence": 70
      }
    }
  ]
}
```

### 创建主理人

```bash
POST /api/hosts
Content-Type: application/json

{
  "name": "我的助手",
  "description": "一句话介绍",
  "domain": "education",
  "datm": {
    "truth": 70,
    "goodness": 50,
    "beauty": 60,
    "intelligence": 80
  },
  "cozeConfig": {
    "botId": "your-bot-id",
    "apiKey": "your-api-key"
  }
}
```

### 与主理人对话

```bash
POST /api/hosts/{id}/chat
Content-Type: application/json

{
  "message": "你好，请介绍一下咖啡",
  "stream": false
}
```

**响应：**
```json
{
  "success": true,
  "reply": "咖啡是一种由烘焙的咖啡豆制成的饮料...",
  "hostId": "abc123"
}
```

---

## 🧠 DATM API

### 获取 DATM 配置

```bash
GET /api/datm/{hostId}
```

**响应：**
```json
{
  "success": true,
  "datm": {
    "truth": 50,
    "goodness": 50,
    "beauty": 50,
    "intelligence": 50
  }
}
```

### 更新 DATM 配置

```bash
PUT /api/datm/{hostId}
Content-Type: application/json

{
  "truth": 80,
  "goodness": 60,
  "beauty": 40,
  "intelligence": 70
}
```

---

## 🔔 Webhook API

### 创建 Webhook

```bash
POST /api/webhooks
Content-Type: application/json

{
  "url": "https://your-server.com/webhook",
  "events": ["host.created", "host.updated"],
  "secret": "your-webhook-secret"
}
```

**响应：**
```json
{
  "success": true,
  "data": {
    "id": "wh_abc123",
    "url": "https://your-server.com/webhook",
    "events": ["host.created", "host.updated"],
    "secret": "abc123...xyz",
    "status": "active"
  }
}
```

### 事件类型

| 事件 | 描述 |
|------|------|
| `host.created` | 主理人创建 |
| `host.updated` | 主理人更新 |
| `host.deleted` | 主理人删除 |
| `chat.message` | 对话消息 |
| `chat.start` | 对话开始 |
| `chat.end` | 对话结束 |

### Webhook 签名验证

Kai-OS 使用 HMAC-SHA256 签名验证 webhook 请求：

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const expected = crypto
    .createHmac('sha256', secret)
    .update(payload)
    .digest('hex');
  
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expected)
  );
}
```

### Webhook 请求格式

```http
POST /your-webhook-endpoint
Content-Type: application/json
X-KaiOS-Event: host.created
X-KaiOS-Signature: sha256=...

{
  "event": "host.created",
  "data": {
    "hostId": "abc123",
    "name": "新助手"
  },
  "timestamp": "2026-01-29T12:00:00.000Z"
}
```

---

## 💻 SDK 示例

### JavaScript/Node.js

```javascript
const kaiOS = {
  baseUrl: 'http://localhost:3000',
  
  async getHosts() {
    const res = await fetch(`${this.baseUrl}/api/hosts`);
    return res.json();
  },
  
  async createHost(data) {
    const res = await fetch(`${this.baseUrl}/api/hosts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  },
  
  async chat(hostId, message) {
    const res = await fetch(`${this.baseUrl}/api/hosts/${hostId}/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message })
    });
    return res.json();
  },
  
  async updateDATM(hostId, datm) {
    const res = await fetch(`${this.baseUrl}/api/datm/${hostId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(datm)
    });
    return res.json();
  },
  
  async createWebhook(data) {
    const res = await fetch(`${this.baseUrl}/api/webhooks`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    return res.json();
  }
};

// 使用示例
const hosts = await kaiOS.getHosts();
console.log('主理人列表:', hosts.data);
```

### Python

```python
import requests

class KaiOS:
    def __init__(self, base_url="http://localhost:3000"):
        self.base_url = base_url
    
    def get_hosts(self):
        return requests.get(f"{self.base_url}/api/hosts").json()
    
    def create_host(self, data):
        return requests.post(
            f"{self.base_url}/api/hosts",
            json=data
        ).json()
    
    def chat(self, host_id, message):
        return requests.post(
            f"{self.base_url}/api/hosts/{host_id}/chat",
            json={"message": message}
        ).json()
    
    def update_datm(self, host_id, datm):
        return requests.put(
            f"{self.base_url}/api/datm/{host_id}",
            json=datm
        ).json()

# 使用示例
kai = KaiOS()
hosts = kai.get_hosts()
print(hosts)
```

---

## 🔒 认证与安全

### 当前版本

v0.4.0 版本暂不强制认证，建议：
1. 使用网络层限制（如防火墙）
2. 配置 Webhook 签名验证
3. 敏感操作前添加认证中间件

### 未来版本

计划添加：
- API Key 认证
- OAuth 2.0 集成
- JWT Token 验证
- IP 白名单

---

## 📊 速率限制

| 级别 | 限制 |
|------|------|
| 普通 | 100 请求/分钟 |
| 认证 | 1000 请求/分钟 |

---

## 🐛 错误处理

所有 API 错误响应格式：

```json
{
  "success": false,
  "error": "错误描述信息"
}
```

**常见错误码：**

| 状态码 | 描述 |
|--------|------|
| 400 | 请求参数错误 |
| 404 | 资源不存在 |
| 500 | 服务器内部错误 |

---

## 📝 CHANGELOG

### v0.4.0 (2026-01-29)

- ✨ 新增 DATM API (读取/更新知识矩阵)
- ✨ 新增 Webhook API (创建/删除/触发)
- ✨ 新增 OpenAPI 3.0 规范文档
- ✨ 新增 Webhook 签名验证
- ✨ 新增开发者文档

---

## ❓ 常见问题

**Q: 如何获取主理人 ID?**
A: 调用 `GET /api/hosts` 获取所有主理人，响应中包含 `id` 字段。

**Q: Webhook 没有收到回调?**
A: 检查：1) Webhook 状态是否为 active；2) 事件是否已注册；3) 目标服务器是否可访问。

**Q: 如何修改 DATM 值?**
A: 调用 `PUT /api/datm/{hostId}`，所有四个维度值必须在 0-100 之间。

---

## 📞 反馈

- GitHub Issues: https://github.com/wanyview/Kai-OS/issues
- 文档反馈: https://github.com/wanyview/Kai-OS/issues/new

---

*Generated by Kai Digital Agent*
*Last Updated: 2026-01-29*
