/**
 * Kai-OS Platform Server
 * v0.4.0 - 开放 API & 第三方接入
 */

const http = require('http');
const fs = require('fs');
const path = require('path');

// 配置
const PORT = process.env.PORT || 3000;
const DATA_DIR = path.join(__dirname, 'data');

// 初始化数据目录
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// 存储文件路径
const STORES = {
  users: path.join(DATA_DIR, 'users.json'),
  hosts: path.join(DATA_DIR, 'hosts.json'),
  sessions: path.join(DATA_DIR, 'sessions.json'),
  webhooks: path.join(DATA_DIR, 'webhooks.json')  // v0.4 新增
};

// 初始化存储
Object.values(STORES).forEach(file => {
  if (!fs.existsSync(file)) {
    fs.writeFileSync(file, JSON.stringify([], null, 2));
  }
});

// 简单路由
const routes = {
  'GET /': 'index.html',
  'GET /src/pages/dashboard.html': 'src/pages/dashboard.html',
  'GET /src/pages/create-host.html': 'src/pages/create-host.html',
  'GET /src/pages/datm-viz.html': 'src/pages/datm-viz.html',
  'GET /datm-viz': 'src/pages/datm-viz.html',
  'GET /src/api/users': 'api:users',
  'POST /api/users': 'api:create-user',
  'GET /api/hosts': 'api:hosts',
  'POST /api/hosts': 'api:create-host',
  'GET /api/hosts/:id': 'api:get-host',
  'PUT /api/hosts/:id': 'api:update-host',
  'DELETE /api/hosts/:id': 'api:delete-host'
};

// 静态文件 MIME 类型
const mimeTypes = {
  '.html': 'text/html',
  '.js': 'application/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
  '.md': 'text/markdown'
};

// 解析请求体
async function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

// API 处理器
async function handleAPI(req, res, route) {
  const [method, path] = route.split(' ');
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;

  // 设置 CORS
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Content-Type', 'application/json');

  try {
    // GET /api/users - 获取所有用户
    if (pathname === '/api/users' && method === 'GET') {
      const users = JSON.parse(fs.readFileSync(STORES.users, 'utf8'));
      res.end(JSON.stringify({ success: true, data: users }));
      return;
    }

    // POST /api/users - 创建用户
    if (pathname === '/api/users' && method === 'POST') {
      const body = await parseBody(req);
      const users = JSON.parse(fs.readFileSync(STORES.users, 'utf8'));
      
      // 简单验证
      if (!body.username || !body.email) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: '缺少必要字段' }));
        return;
      }

      // 检查重复
      if (users.find(u => u.email === body.email)) {
        res.statusCode = 409;
        res.end(JSON.stringify({ success: false, error: '邮箱已注册' }));
        return;
      }

      const newUser = {
        id: Date.now().toString(36),
        username: body.username,
        email: body.email,
        createdAt: new Date().toISOString(),
        hosts: []
      };
      
      users.push(newUser);
      fs.writeFileSync(STORES.users, JSON.stringify(users, null, 2));
      res.end(JSON.stringify({ success: true, data: newUser }));
      return;
    }

    // GET /api/hosts - 获取所有主理人
    if (pathname === '/api/hosts' && method === 'GET') {
      const hosts = JSON.parse(fs.readFileSync(STORES.hosts, 'utf8'));
      res.end(JSON.stringify({ success: true, data: hosts }));
      return;
    }

    // POST /api/hosts - 创建主理人
    if (pathname === '/api/hosts' && method === 'POST') {
      const body = await parseBody(req);
      const hosts = JSON.parse(fs.readFileSync(STORES.hosts, 'utf8'));
      
      // 简单验证
      if (!body.name || !body.creatorId) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: '缺少必要字段' }));
        return;
      }

      const newHost = {
        id: Date.now().toString(36),
        name: body.name,
        description: body.description || '',
        avatar: body.avatar || '',
        domain: body.domain || 'general',
        datm: body.datm || { truth: 50, goodness: 50, beauty: 50, intelligence: 50 },
        prompts: body.prompts || {
          scheduler: '你是一个调度智能体...',
          expert: '你是一个专家智能体...',
          qa: '你是一个问答智能体...'
        },
        cozeConfig: body.cozeConfig || {},
        creatorId: body.creatorId,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        status: 'draft'
      };
      
      hosts.push(newHost);
      fs.writeFileSync(STORES.hosts, JSON.stringify(hosts, null, 2));
      res.end(JSON.stringify({ success: true, data: newHost }));
      return;
    }

    // GET /api/hosts/:id - 获取单个主理人
    if (pathname.startsWith('/api/hosts/') && method === 'GET') {
      const id = pathname.split('/').pop();
      const hosts = JSON.parse(fs.readFileSync(STORES.hosts, 'utf8'));
      const host = hosts.find(h => h.id === id);
      
      if (!host) {
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, error: '主理人不存在' }));
        return;
      }
      
      res.end(JSON.stringify({ success: true, data: host }));
      return;
    }

    // PUT /api/hosts/:id - 更新主理人
    if (pathname.startsWith('/api/hosts/') && method === 'PUT') {
      const id = pathname.split('/').pop();
      const body = await parseBody(req);
      const hosts = JSON.parse(fs.readFileSync(STORES.hosts, 'utf8'));
      const index = hosts.findIndex(h => h.id === id);
      
      if (index === -1) {
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, error: '主理人不存在' }));
        return;
      }

      hosts[index] = { ...hosts[index], ...body, updatedAt: new Date().toISOString() };
      fs.writeFileSync(STORES.hosts, JSON.stringify(hosts, null, 2));
      res.end(JSON.stringify({ success: true, data: hosts[index] }));
      return;
    }

    // DELETE /api/hosts/:id - 删除主理人
    if (pathname.startsWith('/api/hosts/') && method === 'DELETE') {
      const id = pathname.split('/').pop();
      const hosts = JSON.parse(fs.readFileSync(STORES.hosts, 'utf8'));
      const filtered = hosts.filter(h => h.id !== id);
      
      fs.writeFileSync(STORES.hosts, JSON.stringify(filtered, null, 2));
      
      // 触发 webhook: host.deleted
      triggerWebhooks('host.deleted', { hostId: id });
      
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // ===== Webhook API (v0.4) =====
    
    // GET /api/webhooks - 获取所有 webhook
    if (pathname === '/api/webhooks' && method === 'GET') {
      const webhooks = JSON.parse(fs.readFileSync(STORES.webhooks, 'utf8'));
      // 不返回 secret
      const safeWebhooks = webhooks.map(w => ({ ...w, secret: w.secret ? '***' : '' }));
      res.end(JSON.stringify({ success: true, data: safeWebhooks }));
      return;
    }

    // POST /api/webhooks - 创建 webhook
    if (pathname === '/api/webhooks' && method === 'POST') {
      const body = await parseBody(req);
      const webhooks = JSON.parse(fs.readFileSync(STORES.webhooks, 'utf8'));
      
      if (!body.url || !body.events || body.events.length === 0) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: '缺少必要字段' }));
        return;
      }

      const newWebhook = {
        id: Date.now().toString(36),
        url: body.url,
        events: body.events,
        secret: body.secret || generateSecret(),
        status: 'active',
        createdAt: new Date().toISOString()
      };
      
      webhooks.push(newWebhook);
      fs.writeFileSync(STORES.webhooks, JSON.stringify(webhooks, null, 2));
      
      res.statusCode = 201;
      res.end(JSON.stringify({ 
        success: true, 
        data: { ...newWebhook, secret: newWebhook.secret } // 首次返回完整 secret
      }));
      return;
    }

    // DELETE /api/webhooks/:id - 删除 webhook
    if (pathname.startsWith('/api/webhooks/') && method === 'DELETE') {
      const id = pathname.split('/').pop();
      const webhooks = JSON.parse(fs.readFileSync(STORES.webhooks, 'utf8'));
      const filtered = webhooks.filter(w => w.id !== id);
      
      fs.writeFileSync(STORES.webhooks, JSON.stringify(filtered, null, 2));
      res.end(JSON.stringify({ success: true }));
      return;
    }

    // ===== DATM API (v0.4) =====
    
    // GET /api/datm/:hostId - 获取 DATM
    if (pathname.startsWith('/api/datm/') && method === 'GET') {
      const hostId = pathname.split('/').pop();
      const hosts = JSON.parse(fs.readFileSync(STORES.hosts, 'utf8'));
      const host = hosts.find(h => h.id === hostId);
      
      if (!host) {
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, error: '主理人不存在' }));
        return;
      }
      
      res.end(JSON.stringify({ 
        success: true, 
        datm: host.datm || { truth: 50, goodness: 50, beauty: 50, intelligence: 50 }
      }));
      return;
    }

    // PUT /api/datm/:hostId - 更新 DATM
    if (pathname.startsWith('/api/datm/') && method === 'PUT') {
      const hostId = pathname.split('/').pop();
      const body = await parseBody(req);
      const hosts = JSON.parse(fs.readFileSync(STORES.hosts, 'utf8'));
      const index = hosts.findIndex(h => h.id === hostId);
      
      if (index === -1) {
        res.statusCode = 404;
        res.end(JSON.stringify({ success: false, error: '主理人不存在' }));
        return;
      }

      // 验证 DATM 值
      const { truth, goodness, beauty, intelligence } = body;
      if ([truth, goodness, beauty, intelligence].some(v => v < 0 || v > 100 || isNaN(v))) {
        res.statusCode = 400;
        res.end(JSON.stringify({ success: false, error: 'DATM 值必须在 0-100 之间' }));
        return;
      }

      hosts[index].datm = { truth, goodness, beauty, intelligence };
      hosts[index].updatedAt = new Date().toISOString();
      fs.writeFileSync(STORES.hosts, JSON.stringify(hosts, null, 2));
      
      res.end(JSON.stringify({ success: true, datm: hosts[index].datm }));
      return;
    }

    res.statusCode = 404;
    res.end(JSON.stringify({ success: false, error: 'API 不存在' }));

  } catch (error) {
    res.statusCode = 500;
    res.end(JSON.stringify({ success: false, error: error.message }));
  }
}

// 创建服务器
const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://localhost:${PORT}`);
  const pathname = url.pathname;
  const method = req.method;

  // API 请求
  if (pathname.startsWith('/api/')) {
    await handleAPI(req, res, `${method} ${pathname}`);
    return;
  }

  // 静态文件
  let filePath = pathname === '/' ? '/index.html' : pathname;
  
  // 映射路由
  if (filePath === '/dashboard') filePath = '/src/pages/dashboard.html';
  if (filePath === '/create') filePath = '/src/pages/create-host.html';
  
  // 实际文件路径
  const fullPath = path.join(__dirname, filePath);
  const ext = path.extname(fullPath);
  const mimeType = mimeTypes[ext] || 'application/octet-stream';

  try {
    if (fs.existsSync(fullPath) && fs.statSync(fullPath).isFile()) {
      const content = fs.readFileSync(fullPath);
      res.setHeader('Content-Type', mimeType);
      res.end(content);
    } else {
      res.statusCode = 404;
      res.end('404 Not Found');
    }
  } catch (error) {
    res.statusCode = 500;
    res.end('Server Error');
  }
});

// ===== Webhook 触发函数 (v0.4) =====
function triggerWebhooks(event, data) {
  const webhooks = JSON.parse(fs.readFileSync(STORES.webhooks, 'utf8'));
  const targetWebhooks = webhooks.filter(w => w.status === 'active' && w.events.includes(event));
  
  targetWebhooks.forEach(webhook => {
    const payload = JSON.stringify({
      event,
      data,
      timestamp: new Date().toISOString()
    });
    
    // 异步发送 webhook 请求（不等待响应）
    const https = require('https');
    const url = new URL(webhook.url);
    
    const options = {
      hostname: url.hostname,
      path: url.pathname + url.search,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-KaiOS-Event': event,
        'X-KaiOS-Signature': generateSignature(payload, webhook.secret)
      },
      timeout: 5000
    };
    
    const req = https.request(options, (res) => {
      // 记录响应状态
      console.log(`[Webhook] ${event} -> ${webhook.url} [${res.statusCode}]`);
    });
    
    req.on('error', (error) => {
      console.error(`[Webhook] ${event} -> ${webhook.url} [ERROR: ${error.message}]`);
    });
    
    req.write(payload);
    req.end();
  });
}

// 生成签名
function generateSignature(payload, secret) {
  const crypto = require('crypto');
  return crypto.createHmac('sha256', secret).update(payload).digest('hex');
}

// 生成随机 secret
function generateSecret() {
  return require('crypto').randomBytes(32).toString('hex');
}

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║         Kai-OS Platform v0.4.0            ║
║   数字主理人开源构建平台                   ║
╠═══════════════════════════════════════════╣
║  🚀 Server running at:                    ║
║     http://localhost:${PORT}                  ║
║                                           ║
║  📱 Pages:                                ║
║     Home:     http://localhost:${PORT}/        ║
║     Dashboard:http://localhost:${PORT}/dashboard ║
║     Create:   http://localhost:${PORT}/create   ║
║     DATM Viz: http://localhost:${PORT}/datm-viz ║
║                                           ║
║  🔧 API Endpoints (v0.4):                 ║
║     GET    /api/hosts                     ║
║     POST   /api/hosts                     ║
║     GET    /api/hosts/:id                 ║
║     PUT    /api/hosts/:id                 ║
║     DELETE /api/hosts/:id                 ║
║     GET    /api/datm/:hostId              ║
║     PUT    /api/datm/:hostId              ║
║     GET    /api/webhooks                  ║
║     POST   /api/webhooks                  ║
║     DELETE /api/webhooks/:id              ║
║                                           ║
║  📖 API Docs: http://localhost:${PORT}/docs/openapi.json ║
╚═══════════════════════════════════════════╝
  `);
});
