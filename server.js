/**
 * Kai-OS Platform Server
 * v0.2.0 - 平台基础设施
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
  sessions: path.join(DATA_DIR, 'sessions.json')
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
      res.end(JSON.stringify({ success: true }));
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

server.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════╗
║         Kai-OS Platform v0.2.0            ║
║   数字主理人开源构建平台                   ║
╠═══════════════════════════════════════════╣
║  🚀 Server running at:                    ║
║     http://localhost:${PORT}                  ║
║                                           ║
║  📱 Pages:                                ║
║     Home:     http://localhost:${PORT}/        ║
║     Dashboard:http://localhost:${PORT}/dashboard ║
║     Create:   http://localhost:${PORT}/create   ║
║                                           ║
║  🔧 API Endpoints:                        ║
║     GET    /api/users                     ║
║     POST   /api/users                     ║
║     GET    /api/hosts                     ║
║     POST   /api/hosts                     ║
║     GET    /api/hosts/:id                 ║
║     PUT    /api//hosts/:id                ║
║     DELETE /api/hosts/:id                 ║
╚═══════════════════════════════════════════╝
  `);
});
