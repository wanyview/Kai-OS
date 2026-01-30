/**
 * Kai-OS 读书会页面 JavaScript
 * v0.5.0
 */

// 当前选中的书籍类型
let selectedBookType = null;
let selectedDATM = { truth: 70, goodness: 70, beauty: 70, intelligence: 70 };

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initSliders();
  loadReadingHosts();
  drawRadar();
});

// 初始化滑块
function initSliders() {
  const dims = ['Truth', 'Goodness', 'Beauty', 'Intelligence'];
  
  dims.forEach(dim => {
    const slider = document.getElementById(`datm${dim}`);
    const valueSpan = document.getElementById(`datm${dim}Val`);
    
    slider.addEventListener('input', (e) => {
      const value = e.target.value;
      currentDATM[dim.toLowerCase()] = parseInt(value);
      valueSpan.textContent = value;
      drawRadar();
    });
  });
}

// 选择书籍类型
function selectBookType(type) {
  selectedBookType = type;
  
  // 更新 UI 选中状态
  document.querySelectorAll('.book-card').forEach(card => {
    card.classList.remove('selected');
  });
  document.querySelector(`.book-card[data-type="${type}"]`).classList.add('selected');
  
  // 根据类型设置默认 DATM
  const datmConfigs = {
    literature: { truth: 60, goodness: 80, beauty: 95, intelligence: 75 },
    philosophy: { truth: 80, goodness: 85, beauty: 70, intelligence: 90 },
    history: { truth: 80, goodness: 80, beauty: 75, intelligence: 70 },
    science: { truth: 90, goodness: 60, beauty: 70, intelligence: 85 },
    business: { truth: 75, goodness: 70, beauty: 60, intelligence: 80 },
    psychology: { truth: 70, goodness: 90, beauty: 85, intelligence: 75 }
  };
  
  selectedDATM = datmConfigs[type];
  
  // 更新滑块
  Object.keys(selectedDATM).forEach(dim => {
    document.getElementById(`datm${capitalize(dim)}`).value = selectedDATM[dim];
    document.getElementById(`datm${capitalize(dim)}Val`).textContent = selectedDATM[dim];
  });
  
  // 更新雷达图
  drawRadar();
  
  // 显示配置表单
  document.getElementById('customConfig').style.display = 'block';
  
  // 根据类型更新默认名称
  updateDefaultNames(type);
}

// 更新默认名称
function updateDefaultNames(type) {
  const typeNames = {
    literature: '文学经典',
    philosophy: '哲学思辨',
    history: '历史人文',
    science: '科普读物',
    business: '商业管理',
    psychology: '心理成长'
  };
  
  document.getElementById('hostName').value = `${typeNames[type]}读书助手`;
}

// 绘制雷达图
function drawRadar() {
  const canvas = document.getElementById('reading-radar');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 100;
  
  const dims = ['truth', 'goodness', 'beauty', 'intelligence'];
  const labels = ['Truth', 'Goodness', 'Beauty', 'Intelligence'];
  const angles = [-Math.PI / 2, -Math.PI / 4, Math.PI / 4, Math.PI / 2];
  const colors = {
    truth: '#3b82f6',
    goodness: '#22c55e',
    beauty: '#ec4899',
    intelligence: '#f59e0b'
  };
  
  const values = dims.map(dim => {
    const slider = document.getElementById(`datm${capitalize(dim)}`);
    return slider ? parseInt(slider.value) : 50;
  });
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制背景网格
  for (let i = 1; i <= 5; i++) {
    const r = (radius / 5) * i;
    ctx.beginPath();
    ctx.strokeStyle = i === 5 ? '#94a3b8' : '#e2e8f0';
    ctx.lineWidth = i === 5 ? 2 : 1;
    
    for (let j = 0; j <= 4; j++) {
      const angle = angles[j % 4] || 0;
      const x = centerX + Math.cos(angle) * r;
      const y = centerY + Math.sin(angle) * r;
      if (j === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  // 绘制轴线
  dims.forEach((dim, index) => {
    const angle = angles[index];
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.moveTo(centerX, centerY);
    const x = centerX + Math.cos(angle) * radius;
    const y = centerY + Math.sin(angle) * radius;
    ctx.lineTo(x, y);
    ctx.stroke();
  });
  
  // 绘制数据区域
  ctx.beginPath();
  ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  
  values.forEach((value, index) => {
    const angle = angles[index];
    const r = (value / 100) * radius;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    if (index === 0) {
      ctx.moveTo(x, y);
    } else {
      ctx.lineTo(x, y);
    }
  });
  ctx.closePath();
  ctx.fill();
  ctx.stroke();
  
  // 绘制数据点
  values.forEach((value, index) => {
    const angle = angles[index];
    const r = (value / 100) * radius;
    const x = centerX + Math.cos(angle) * r;
    const y = centerY + Math.sin(angle) * r;
    
    ctx.beginPath();
    ctx.arc(x, y, 5, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // 绘制标签
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  labels.forEach((label, index) => {
    const angle = angles[index];
    const x = centerX + Math.cos(angle) * (radius + 25);
    const y = centerY + Math.sin(angle) * (radius + 25);
    ctx.fillText(label, x, y);
  });
}

// 重置配置
function resetConfig() {
  if (selectedBookType) {
    selectBookType(selectedBookType);
  }
  
  document.getElementById('bookTitle').value = '';
  document.getElementById('hostName').value = '';
  document.getElementById('hostDesc').value = '';
}

// 创建读书助手
async function createReadingHost() {
  const bookTitle = document.getElementById('bookTitle').value.trim();
  const hostName = document.getElementById('hostName').value.trim();
  const hostDesc = document.getElementById('hostDesc').value.trim();
  
  if (!hostName) {
    alert('请输入主理人名称');
    return;
  }
  
  const datm = {
    truth: parseInt(document.getElementById('datmTruth').value),
    goodness: parseInt(document.getElementById('datmGoodness').value),
    beauty: parseInt(document.getElementById('datmBeauty').value),
    intelligence: parseInt(document.getElementById('datmIntelligence').value)
  };
  
  const hostData = {
    name: hostName,
    description: hostDesc || `帮你深入理解${bookTitle || '这本书'}`,
    domain: 'reading',
    bookType: selectedBookType,
    bookTitle: bookTitle,
    datm: datm,
    prompts: {
      scheduler: getPromptTemplate('scheduler', selectedBookType),
      expert: getPromptTemplate('expert', selectedBookType),
      qa: getPromptTemplate('qa', selectedBookType)
    },
    status: 'published'
  };
  
  try {
    const response = await fetch('/api/hosts', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(hostData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      alert('🎉 读书助手创建成功！');
      window.location.href = '/dashboard';
    } else {
      alert('创建失败: ' + result.error);
    }
  } catch (error) {
    alert('网络错误: ' + error.message);
  }
}

// 获取 Prompt 模板
function getPromptTemplate(type, bookType) {
  const templates = {
    scheduler: {
      literature: '你是一个文学经典读书会主持人，温和引导、鼓励分享、善于总结。重点关注人物情感、情节美感、语言艺术。',
      philosophy: '你是一个哲学思辨读书会主持人，严谨开放、鼓励质疑、引导深度思考。重点关注概念澄清、逻辑论证、跨学科连接。',
      history: '你是一个历史人文读书会主持人，客观分析、关联现实、启发思考。重点关注时代背景、因果分析、历史教训。',
      science: '你是一个科普读物读书会主持人，好奇探索、严谨求证、联系生活。重点关注科学原理、实验方法、前沿应用。',
      business: '你是一个商业管理读书会主持人，务实启发、案例导向、行动导向。重点关注核心观点、案例分析、实践应用。',
      psychology: '你是一个心理成长读书会主持人，温暖共情、洞察引导、支持鼓励。重点关注自我认知、情感理解、成长路径。'
    },
    expert: {
      literature: '你精通中外文学，解读文学作品时注重作者背景、写作手法、文学价值、情感表达。',
      philosophy: '你精通哲学，解读哲学著作时注重概念定义、论证逻辑、思想源流、现实意义。',
      history: '你精通历史，解读历史著作时注重时代背景、因果分析、多元视角、历史教训。',
      science: '你精通科学，解读科普著作时注重科学原理、实验方法、前沿进展、实际应用。',
      business: '你精通商业，解读商业著作时注重核心观点、案例分析、行业趋势、实践方法。',
      psychology: '你精通心理学，解读心理著作时注重理论框架、自我认知、情感理解、成长路径。'
    },
    qa: {
      literature: '你是一个热爱文学的阅读伙伴，回答简洁温暖，鼓励读者分享感受。',
      philosophy: '你是一个思考伙伴，回答引导深入思考，不给唯一答案，提供思考框架。',
      history: '你是一个历史爱好者，回答客观全面，关联现实生活，引发思考。',
      science: '你是一个科学好奇者，回答准确生动，用生活例子说明，鼓励探索验证。',
      business: '你是一个商业顾问，回答务实有用，提供行动建议，鼓励实践。',
      psychology: '你是一个温暖的支持者，回答共情理解，鼓励自我探索，支持成长。'
    }
  };
  
  return templates[type][bookType] || templates[type].literature;
}

// 加载已有的读书助手
async function loadReadingHosts() {
  const container = document.getElementById('readingHostsList');
  
  try {
    const response = await fetch('/api/hosts?domain=reading');
    const result = await response.json();
    
    if (result.success && result.data.length > 0) {
      container.innerHTML = result.data.map(host => `
        <div class="host-card-simple">
          <div class="host-icon">📚</div>
          <div class="host-info">
            <h4>${escapeHtml(host.name)}</h4>
            <p>${escapeHtml(host.description || '读书助手')}</p>
          </div>
          <div class="host-actions">
            <button class="btn btn-primary" onclick="openHost('${host.id}')">对话</button>
            <button class="btn btn-secondary" onclick="editHost('${host.id}')">编辑</button>
          </div>
        </div>
      `).join('');
    } else {
      container.innerHTML = '<p style="text-align:center;color:#7f8c8d;padding:2rem;">还没有读书助手，创建一个吧！</p>';
    }
  } catch (error) {
    container.innerHTML = '<p style="text-align:center;color:#e74c3c;padding:2rem;">加载失败，请刷新重试</p>';
  }
}

// 使用模板
function useTemplate(templateId) {
  const templates = {
    commonwealth: {
      name: '《百年孤独》读书助手',
      desc: '帮你深入理解这部魔幻现实主义经典',
      type: 'literature',
      bookTitle: '百年孤独',
      datm: { truth: 60, goodness: 80, beauty: 95, intelligence: 80 }
    },
    tao: {
      name: '《道德经》读书助手',
      desc: '带你入门道家哲学智慧',
      type: 'philosophy',
      bookTitle: '道德经',
      datm: { truth: 70, goodness: 90, beauty: 85, intelligence: 95 }
    },
    think: {
      name: '《思考，快与慢》读书助手',
      desc: '帮你理解人类决策的心理学',
      type: 'psychology',
      bookTitle: '思考，快与慢',
      datm: { truth: 85, goodness: 70, beauty: 60, intelligence: 90 }
    },
    sapiens: {
      name: '《人类简史》读书助手',
      desc: '一起探索人类文明的演化',
      type: 'history',
      bookTitle: '人类简史',
      datm: { truth: 85, goodness: 75, beauty: 70, intelligence: 85 }
    }
  };
  
  const template = templates[templateId];
  if (!template) return;
  
  // 填充表单
  document.getElementById('bookTitle').value = template.bookTitle;
  document.getElementById('hostName').value = template.name;
  document.getElementById('hostDesc').value = template.desc;
  
  // 设置书籍类型和 DATM
  selectBookType(template.type);
  selectedDATM = template.datm;
  
  // 更新滑块
  Object.keys(template.datm).forEach(dim => {
    document.getElementById(`datm${capitalize(dim)}`).value = template.datm[dim];
    document.getElementById(`datm${capitalize(dim)}Val`).textContent = template.datm[dim];
  });
  
  drawRadar();
}

// 打开主理人对话
function openHost(id) {
  alert('对话功能开发中...');
}

// 编辑主理人
function editHost(id) {
  alert('编辑功能开发中...');
}

// 辅助函数
function capitalize(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
