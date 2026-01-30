/**
 * Kai-OS DATM 可视化 JavaScript
 * v0.3.0 - 知识矩阵动态可视化
 */

// 当前 DATM 值
let currentDATM = {
  truth: 50,
  goodness: 50,
  beauty: 50,
  intelligence: 50
};

// 知识轨迹历史
let timelineData = [];

// 初始化
document.addEventListener('DOMContentLoaded', () => {
  initSliders();
  initPresets();
  drawRadar();
  loadTimeline();
});

// 初始化滑块
function initSliders() {
  const sliders = ['truth', 'goodness', 'beauty', 'intelligence'];
  
  sliders.forEach(dim => {
    const slider = document.getElementById(`viz-${dim}`);
    const valueSpan = document.getElementById(`viz-${dim}-val`);
    
    slider.addEventListener('input', (e) => {
      const value = e.target.value;
      currentDATM[dim] = parseInt(value);
      valueSpan.textContent = value;
      
      // 更新滑块渐变
      slider.style.setProperty('--value', `${value}%`);
      
      // 重绘雷达图
      drawRadar();
      
      // 更新分析
      updateAnalysis();
    });
    
    // 初始化渐变
    slider.style.setProperty('--value', '50%');
  });
}

// 初始化预设模板
function initPresets() {
  // 预设模板数据
  window.presets = {
    science: { truth: 90, goodness: 30, beauty: 40, intelligence: 70 },
    education: { truth: 70, goodness: 90, beauty: 50, intelligence: 60 },
    creative: { truth: 40, goodness: 40, beauty: 95, intelligence: 85 },
    balanced: { truth: 60, goodness: 60, beauty: 60, intelligence: 60 }
  };
}

// 加载预设
function loadPreset(presetName) {
  const preset = window.presets[presetName];
  if (!preset) return;
  
  currentDATM = { ...preset };
  
  // 更新 UI
  Object.keys(preset).forEach(dim => {
    document.getElementById(`viz-${dim}`).value = preset[dim];
    document.getElementById(`viz-${dim}-val`).textContent = preset[dim];
    document.getElementById(`viz-${dim}`).style.setProperty('--value', `${preset[dim]}%`);
  });
  
  drawRadar();
  updateAnalysis();
}

// 绘制雷达图
function drawRadar() {
  const canvas = document.getElementById('datm-radar-full');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  const centerX = canvas.width / 2;
  const centerY = canvas.height / 2;
  const radius = 140;
  
  // 维度配置
  const dimensions = [
    { name: 'Truth', label: '科学性', angle: -Math.PI / 2, color: '#3b82f6' },
    { name: 'Goodness', label: '社科性', angle: -Math.PI / 4, color: '#22c55e' },
    { name: 'Beauty', label: '人文性', angle: Math.PI / 4, color: '#ec4899' },
    { name: 'Intelligence', label: '创新性', angle: Math.PI / 2, color: '#f59e0b' }
  ];
  
  const values = [
    currentDATM.truth,
    currentDATM.goodness,
    currentDATM.beauty,
    currentDATM.intelligence
  ];
  
  // 清空画布
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  
  // 绘制背景网格
  for (let level = 1; level <= 5; level++) {
    const r = (radius / 5) * level;
    ctx.beginPath();
    ctx.strokeStyle = level === 5 ? '#94a3b8' : '#e2e8f0';
    ctx.lineWidth = level === 5 ? 2 : 1;
    
    for (let i = 0; i <= 4; i++) {
      const dim = dimensions[i];
      const x = centerX + Math.cos(dim.angle) * r;
      const y = centerY + Math.sin(dim.angle) * r;
      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.closePath();
    ctx.stroke();
  }
  
  // 绘制轴线
  dimensions.forEach(dim => {
    ctx.beginPath();
    ctx.strokeStyle = '#e2e8f0';
    ctx.moveTo(centerX, centerY);
    const x = centerX + Math.cos(dim.angle) * radius;
    const y = centerY + Math.sin(dim.angle) * radius;
    ctx.lineTo(x, y);
    ctx.stroke();
  });
  
  // 绘制数据区域
  ctx.beginPath();
  ctx.fillStyle = 'rgba(99, 102, 241, 0.2)';
  ctx.strokeStyle = '#6366f1';
  ctx.lineWidth = 3;
  
  values.forEach((value, index) => {
    const dim = dimensions[index];
    const r = (value / 100) * radius;
    const x = centerX + Math.cos(dim.angle) * r;
    const y = centerY + Math.sin(dim.angle) * r;
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
    const dim = dimensions[index];
    const r = (value / 100) * radius;
    const x = centerX + Math.cos(dim.angle) * r;
    const y = centerY + Math.sin(dim.angle) * r;
    
    ctx.beginPath();
    ctx.arc(x, y, 6, 0, Math.PI * 2);
    ctx.fillStyle = '#6366f1';
    ctx.fill();
    ctx.strokeStyle = 'white';
    ctx.lineWidth = 2;
    ctx.stroke();
  });
  
  // 绘制标签
  ctx.fillStyle = '#1e293b';
  ctx.font = 'bold 14px sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  dimensions.forEach((dim, index) => {
    const x = centerX + Math.cos(dim.angle) * (radius + 35);
    const y = centerY + Math.sin(dim.angle) * (radius + 35);
    
    // 标签背景
    const text = `${dim.name}\n(${dim.label})`;
    const lines = text.split('\n');
    lines.forEach((line, i) => {
      ctx.fillText(line, x, y + (i * 16));
    });
  });
}

// 更新分析
function updateAnalysis() {
  const { truth, goodness, beauty, intelligence } = currentDATM;
  const values = [truth, goodness, beauty, intelligence];
  const maxVal = Math.max(...values);
  const minVal = Math.min(...values);
  const avgVal = values.reduce((a, b) => a + b, 0) / 4;
  
  // 当前状态
  const stateEl = document.getElementById('current-state');
  if (maxVal - minVal > 30) {
    if (truth > 70) stateEl.textContent = '科学导向型';
    else if (goodness > 70) stateEl.textContent = '社科导向型';
    else if (beauty > 70) stateEl.textContent = '人文导向型';
    else if (intelligence > 70) stateEl.textContent = '创新导向型';
  } else if (avgVal > 70) {
    stateEl.textContent = '全面发展型';
  } else if (avgVal < 40) {
    stateEl.textContent = '待发展型';
  } else {
    stateEl.textContent = '均衡发展型';
  }
  
  // 优势维度
  const strengthEl = document.getElementById('strength-dim');
  if (maxVal > 75) {
    const dims = { truth: '科学性', goodness: '社科性', beauty: '人文性', intelligence: '创新性' };
    const maxDim = Object.keys(currentDATM).find(k => currentDATM[k] === maxVal);
    strengthEl.textContent = `${dims[maxDim]} (${maxVal})`;
  } else {
    strengthEl.textContent = '无明显优势';
  }
  
  // 待提升维度
  const weaknessEl = document.getElementById('weakness-dim');
  if (minVal < 35) {
    const dims = { truth: '科学性', goodness: '社科性', beauty: '人文性', intelligence: '创新性' };
    const minDim = Object.keys(currentDATM).find(k => currentDATM[k] === minVal);
    weaknessEl.textContent = `${dims[minDim]} (${minVal})`;
  } else {
    weaknessEl.textContent = '无明显短板';
  }
  
  // 建议
  const suggestionEl = document.getElementById('suggestion');
  if (maxVal - minVal > 40) {
    suggestionEl.textContent = '建议均衡发展，提升较弱的维度';
  } else if (avgVal < 50) {
    suggestionEl.textContent = '建议全面提升知识储备';
  } else if (maxVal > 85) {
    suggestionEl.textContent = '可考虑深化专业方向';
  } else {
    suggestionEl.textContent = '保持当前发展节奏';
  }
}

// ===== 时间线功能 =====

// 添加轨迹点
function addTimelinePoint() {
  const label = document.getElementById('point-label').value.trim();
  if (!label) {
    alert('请输入标签');
    return;
  }
  
  const point = {
    id: Date.now().toString(36),
    label,
    datm: { ...currentDATM },
    timestamp: new Date().toISOString()
  };
  
  timelineData.push(point);
  saveTimeline();
  renderTimeline();
  document.getElementById('point-label').value = '';
}

// 渲染时间线
function renderTimeline() {
  const container = document.getElementById('timeline');
  if (!container) return;
  
  if (timelineData.length === 0) {
    container.innerHTML = '<p style="color: var(--text-muted); text-align: center;">暂无轨迹记录</p>';
    return;
  }
  
  container.innerHTML = timelineData.map((point, index) => `
    <div class="timeline-item" data-id="${point.id}">
      <div class="timeline-dot"></div>
      <div class="timeline-content">
        <h4>${escapeHtml(point.label)}</h4>
        <span class="timestamp">${formatDate(point.timestamp)}</span>
        <div class="datm-badges">
          <span class="datm-badge truth">真:${point.datm.truth}</span>
          <span class="datm-badge goodness">善:${point.datm.goodness}</span>
          <span class="datm-badge beauty">美:${point.datm.beauty}</span>
          <span class="datm-badge intelligence">灵:${point.datm.intelligence}</span>
        </div>
      </div>
      <div class="timeline-actions">
        <button class="load-btn" onclick="loadTimelinePoint('${point.id}')">加载</button>
        <button class="delete-btn" onclick="deleteTimelinePoint('${point.id}')">删除</button>
      </div>
    </div>
  `).join('');
}

// 加载轨迹点
function loadTimelinePoint(id) {
  const point = timelineData.find(p => p.id === id);
  if (!point) return;
  
  currentDATM = { ...point.datm };
  
  // 更新 UI
  Object.keys(point.datm).forEach(dim => {
    document.getElementById(`viz-${dim}`).value = point.datm[dim];
    document.getElementById(`viz-${dim}-val`).textContent = point.datm[dim];
    document.getElementById(`viz-${dim}`).style.setProperty('--value', `${point.datm[dim]}%`);
  });
  
  drawRadar();
  updateAnalysis();
}

// 删除轨迹点
function deleteTimelinePoint(id) {
  if (!confirm('确定删除此轨迹点？')) return;
  
  timelineData = timelineData.filter(p => p.id !== id);
  saveTimeline();
  renderTimeline();
}

// 保存时间线到 localStorage
function saveTimeline() {
  localStorage.setItem('kai-os-timeline', JSON.stringify(timelineData));
}

// 从 localS 加载时间线
function loadTimeline() {
  const saved = localStorage.getItem('kai-os-timeline');
  if (saved) {
    try {
      timelineData = JSON.parse(saved);
      renderTimeline();
    } catch (e) {
      console.error('加载时间线失败:', e);
    }
  }
}

// ===== 导出/导入功能 =====

// 导出 DATM 配置
function exportDATM() {
  const data = {
    version: '0.3.0',
    exportedAt: new Date().toISOString(),
    datm: currentDATM,
    timeline: timelineData
  };
  
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `kai-os-datm-${Date.now()}.json`;
  a.click();
  URL.revokeObjectURL(url);
}

// 导入 DATM 配置
function importDATM() {
  document.getElementById('import-modal').style.display = 'flex';
}

// 确认导入
function confirmImport() {
  const json = document.getElementById('import-json').value.trim();
  if (!json) {
    alert('请粘贴 JSON 配置');
    return;
  }
  
  try {
    const data = JSON.parse(json);
    
    if (data.datm) {
      currentDATM = data.datm;
      
      // 更新 UI
      Object.keys(data.datm).forEach(dim => {
        if (document.getElementById(`viz-${dim}`)) {
          document.getElementById(`viz-${dim}`).value = data.datm[dim];
          document.getElementById(`viz-${dim}-val`).textContent = data.datm[dim];
          document.getElementById(`viz-${dim}`).style.setProperty('--value', `${data.datm[dim]}%`);
        }
      });
      
      drawRadar();
      updateAnalysis();
    }
    
    if (data.timeline && Array.isArray(data.timeline)) {
      timelineData = data.timeline;
      saveTimeline();
      renderTimeline();
    }
    
    closeModal();
    alert('导入成功！');
  } catch (e) {
    alert('导入失败: ' + e.message);
  }
}

// 关闭模态框
function closeModal() {
  document.getElementById('import-modal').style.display = 'none';
  document.getElementById('import-json').value = '';
}

// 处理文件导入
function handleImport(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = (e) => {
    document.getElementById('import-json').value = e.target.result;
    importDATM();
  };
  reader.readAsText(file);
}

// 保存到主理人 (调用 API)
async function saveToHost() {
  alert('请前往控制台创建或编辑主理人，然后保存此配置。\n\n当前 DATM 值:\n' + JSON.stringify(currentDATM, null, 2));
}

// ===== 辅助函数 =====

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatDate(isoString) {
  const date = new Date(isoString);
  return date.toLocaleString('zh-CN', {
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit'
  });
}
