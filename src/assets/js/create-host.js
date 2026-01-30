/**
 * Kai-OS 创建主理人向导 JavaScript
 * v0.2.0
 */

// 当前步骤
let currentStep = 1;
const totalSteps = 5;

// DOM 加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  initForm();
  initDATM();
});

// 初始化表单
function initForm() {
  const form = document.getElementById('create-form');
  form.addEventListener('submit', handleSubmit);
  
  // 初始化雷达图
  drawDATMRadar();
}

// 切换步骤
function nextStep(current) {
  // 验证当前步骤
  if (!validateStep(current)) {
    return;
  }
  
  // 更新步骤显示
  updateStepDisplay(current, 'next');
  currentStep++;
  
  // 如果是步骤5，更新摘要
  if (currentStep === 5) {
    updateSummary();
  }
}

function prevStep(current) {
  updateStepDisplay(current, 'prev');
  currentStep--;
}

// 验证步骤
function validateStep(step) {
  if (step === 1) {
    const name = document.getElementById('host-name').value.trim();
    if (!name) {
      alert('请输入主理人名称');
      return false;
    }
  }
  return true;
}

// 更新步骤显示
function updateStepDisplay(current, direction) {
  const currentSection = document.querySelector(`.form-step[data-step="${current}"]`);
  const currentStepEl = document.querySelector(`.step[data-step="${current}"]`);
  
  // 隐藏当前步骤
  currentSection.classList.remove('active');
  
  // 更新步骤指示器
  if (direction === 'next') {
    currentStepEl.classList.add('completed');
  } else {
    currentStepEl.classList.remove('completed');
  }
  
  const nextSection = document.querySelector(`.form-step[data-step="${currentStep}"]`);
  const nextStepEl = document.querySelector(`.step[data-step="${currentStep}"]`);
  
  nextSection.classList.add('active');
  nextStepEl.classList.add('active');
}

// 更新摘要
function updateSummary() {
  const name = document.getElementById('host-name').value;
  const desc = document.getElementById('host-desc').value;
  const domain = document.getElementById('host-domain').value;
  const avatarStyle = document.querySelector('input[name="avatar-style"]:checked').value;
  
  const datm = {
    truth: document.getElementById('datm-truth').value,
    goodness: document.getElementById('datm-goodness').value,
    beauty: document.getElementById('datm-beauty').value,
    intelligence: document.getElementById('datm-intelligence').value
  };
  
  const summary = document.getElementById('summary-content');
  summary.innerHTML = `
    <div class="summary-item">
      <span class="summary-label">名称</span>
      <span class="summary-value">${escapeHtml(name)}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">介绍</span>
      <span class="summary-value">${escapeHtml(desc || '暂无')}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">领域</span>
      <span class="summary-value">${getDomainName(domain)}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">形象风格</span>
      <span class="summary-value">${getAvatarStyleName(avatarStyle)}</span>
    </div>
    <div class="summary-item">
      <span class="summary-label">知识矩阵</span>
      <span class="summary-value">真:${datm.truth} / 善:${datm.goodness} / 美:${datm.beauty} / 灵:${datm.intelligence}</span>
    </div>
  `;
}

// 提交表单
async function handleSubmit(e) {
  e.preventDefault();
  
  const name = document.getElementById('host-name').value;
  const description = document.getElementById('host-desc').value;
  const domain = document.getElementById('host-domain').value;
  const avatarUrl = document.getElementById('avatar-url').value;
  const avatarStyle = document.querySelector('input[name="avatar-style"]:checked').value;
  const cozeBotId = document.getElementById('coze-bot-id').value;
  const cozeApiKey = document.getElementById('coze-api-key').value;
  const publish = document.querySelector('input[name="publish"]:checked').value;
  
  const datm = {
    truth: parseInt(document.getElementById('datm-truth').value),
    goodness: parseInt(document.getElementById('datm-goodness').value),
    beauty: parseInt(document.getElementById('datm-beauty').value),
    intelligence: parseInt(document.getElementById('datm-intelligence').value)
  };
  
  const hostData = {
    name,
    description,
    domain,
    avatar: avatarUrl || `/assets/avatars/${avatarStyle}.svg`,
    datm,
    cozeConfig: cozeBotId ? {
      botId: cozeBotId,
      apiKey: cozeApiKey
    } : {},
    status: publish,
    creatorId: 'demo-user' // 简化：使用固定用户
  };
  
  try {
    const response = await fetch('/api/hosts', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(hostData)
    });
    
    const result = await response.json();
    
    if (result.success) {
      if (publish === 'publish') {
        alert('🎉 主理人创建成功并已发布！');
      } else {
        alert('💾 主理人已保存为草稿！');
      }
      window.location.href = '/dashboard';
    } else {
      alert('创建失败: ' + result.error);
    }
  } catch (error) {
    alert('网络错误: ' + error.message);
  }
}

// ===== DATM 相关功能 =====

// 更新滑块值显示
function updateSlider(type) {
  const value = document.getElementById(`datm-${type}`).value;
  document.getElementById(`${type}-value`).textContent = value;
  drawDATMRadar();
}

// 初始化 DATM 雷达图
function initDATM() {
  ['truth', 'goodness', 'beauty', 'intelligence'].forEach(type => {
    document.getElementById(`datm-${type}`).addEventListener('input', () => {
      updateSlider(type);
    });
  });
}

// 绘制雷达图
function drawDATMRadar() {
  const canvas = document.getElementById('datm-radar');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 100;
  
  // 获取当前值
  const values = {
    truth: parseInt(document.getElementById('datm-truth').value),
    goodness: parseInt(document.getElementById('datm-goodness').value),
    beauty: parseInt(document.getElementById('datm-beauty').value),
    intelligence: parseInt(document.getElementById('datm-intelligence').value)
  };
  
  const labels = ['Truth\n科学', 'Goodness\n社科', 'Beauty\n人文', 'Intelligence\n创新'];
  const angles = [ -Math.PI/2, -Math.PI/4, Math.PI/4, Math.PI/2];
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制背景网格
  ctx.strokeStyle = '#e2e8f0';
  ctx.lineWidth = 1;
  
  for (let i = 1; i <= 4; i++) {
    ctx.beginPath();
    const r = (radius / 4) * i;
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
    ctx.stroke();
  }
  
  // 绘制数据区域
  ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 2;
  
  ctx.beginPath();
  Object.values(values).forEach((value, index) => {
    const angle = angles[index] || 0;
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
  
  // 绘制标签
  ctx.fillStyle = '#1e293b';
  ctx.font = '12px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  labels.forEach((label, index) => {
    const angle = angles[index] || 0;
    const x = centerX + Math.cos(angle) * (radius + 25);
    const y = centerY + Math.sin(angle) * (radius + 25);
    const lines = label.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + (i * 14));
    });
  });
}

// 辅助函数
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function getDomainName(domain) {
  const names = {
    general: '通用',
    coffee: '咖啡',
    education: '教育',
    tech: '科技',
    art: '艺术',
    health: '健康',
    business: '商业'
  };
  return names[domain] || domain;
}

function getAvatarStyleName(style) {
  const names = {
    student: '学生风格',
    professional: '专业风格',
    casual: '轻松风格',
    cyber: '赛博风格'
  };
  return names[style] || style;
}
