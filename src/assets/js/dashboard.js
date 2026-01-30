/**
 * Kai-OS Dashboard JavaScript
 * v0.2.0
 */

// 页面加载完成后初始化
document.addEventListener('DOMContentLoaded', () => {
  loadHosts();
});

// 加载主理人列表
async function loadHosts() {
  try {
    const response = await fetch('/api/hosts');
    const result = await response.json();
    
    if (result.success) {
      renderHosts(result.data);
      updateStats(result.data);
    } else {
      showError('加载主理人失败');
    }
  } catch (error) {
    console.error('加载主理人失败:', error);
    showError('网络错误，请检查服务器是否运行');
  }
}

// 渲染主理人卡片
function renderHosts(hosts) {
  const grid = document.getElementById('hosts-grid');
  const emptyState = document.getElementById('empty-state');
  
  if (!hosts || hosts.length === 0) {
    grid.style.display = 'none';
    emptyState.style.display = 'block';
    return;
  }
  
  grid.style.display = 'grid';
  emptyState.style.display = 'none';
  
  grid.innerHTML = hosts.map(host => `
    <div class="host-card" data-id="${host.id}">
      <div class="host-avatar">
        ${host.avatar ? `<img src="${host.avatar}" alt="${host.name}" class="host-avatar">` : '🎭'}
      </div>
      <div class="host-info">
        <h3>${escapeHtml(host.name)}</h3>
        <p>${escapeHtml(host.description || '暂无描述')}</p>
        <div class="host-meta">
          <span>${host.domain || '通用'}</span>
          <span class="host-status ${host.status}">${host.status === 'published' ? '已发布' : '草稿'}</span>
        </div>
      </div>
      <div class="host-actions">
        <button class="btn btn-secondary" onclick="viewHost('${host.id}')">查看</button>
        <button class="btn btn-primary" onclick="editHost('${host.id}')">编辑</button>
        <button class="btn btn-danger" onclick="deleteHost('${host.id}')">删除</button>
      </div>
    </div>
  `).join('');
}

// 更新统计
function updateStats(hosts) {
  document.getElementById('total-hosts').textContent = hosts.length;
  document.getElementById('active-hosts').textContent = hosts.filter(h => h.status === 'published').length;
  document.getElementById('draft-hosts').textContent = hosts.filter(h => h.status === 'draft').length;
}

// 查看主理人
function viewHost(id) {
  window.location.href = `/api/hosts/${id}`;
}

// 编辑主理人
function editHost(id) {
  alert('编辑功能开发中...');
}

// 删除主理人
async function deleteHost(id) {
  if (!confirm('确定要删除这个主理人吗？此操作不可恢复。')) {
    return;
  }
  
  try {
    const response = await fetch(`/api/hosts/${id}`, {
      method: 'DELETE'
    });
    const result = await response.json();
    
    if (result.success) {
      loadHosts(); // 重新加载
    } else {
      alert('删除失败: ' + result.error);
    }
  } catch (error) {
    alert('网络错误');
  }
}

// 显示错误
function showError(message) {
  alert(message);
}

// HTML 转义
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
