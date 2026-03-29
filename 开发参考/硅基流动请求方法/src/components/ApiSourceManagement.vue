<script setup>
import { ref, computed, onMounted } from 'vue';

// 配置数据
const config = ref({
  apiSources: []
});

// 选中的 API 源索引
const selectedSourceIndex = ref(-1);

// 添加弹窗显示状态
const showAddModal = ref(false);

// 新 API 源名称
const newSourceName = ref('');

// 显示状态消息
function showMessage(message, type = 'success') {
  const messageElement = document.createElement('div');
  messageElement.style.position = 'fixed';
  messageElement.style.top = '20px';
  messageElement.style.right = '20px';
  messageElement.style.padding = '12px 20px';
  messageElement.style.borderRadius = '6px';
  messageElement.style.color = '#fff';
  messageElement.style.fontSize = '14px';
  messageElement.style.fontWeight = '500';
  messageElement.style.zIndex = '9999';
  messageElement.style.transition = 'all 0.3s ease';
  messageElement.style.opacity = '0';
  messageElement.style.transform = 'translateY(-20px)';
  
  if (type === 'error') {
    messageElement.style.backgroundColor = '#dc2626';
  } else {
    messageElement.style.backgroundColor = '#10b981';
  }
  
  messageElement.textContent = message;
  document.body.appendChild(messageElement);
  
  setTimeout(() => {
    messageElement.style.opacity = '1';
    messageElement.style.transform = 'translateY(0)';
  }, 100);
  
  setTimeout(() => {
    messageElement.style.opacity = '0';
    messageElement.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (messageElement.parentNode) {
        document.body.removeChild(messageElement);
      }
    }, 300);
  }, 2000);
}

// 加载配置
function loadConfig() {
  chrome.storage.local.get(['apiSources'], (result) => {
    if (Array.isArray(result.apiSources)) {
      config.value.apiSources = result.apiSources.map(source => ({
        name: source.name || '',
        url: source.url || 'https://api.openai.com/v1',
        keys: Array.isArray(source.keys) ? source.keys.filter(k => k.trim()) : [],
        models: Array.isArray(source.models) ? source.models.filter(m => m.trim()) : ['gpt-3.5-turbo'],
        enabled: source.enabled !== false
      }));
    } else {
      config.value.apiSources = [];
    }
    
    // 默认选中第一个 API 源
    if (config.value.apiSources.length > 0 && selectedSourceIndex.value === -1) {
      selectedSourceIndex.value = 0;
    }
  });
}

// 自动保存配置
function autoSaveConfig() {
  const configToSave = JSON.parse(JSON.stringify(config.value));
  chrome.storage.local.set({ apiSources: configToSave.apiSources });
}

// 打开添加弹窗
function openAddModal() {
  newSourceName.value = '';
  showAddModal.value = true;
}

// 关闭添加弹窗
function closeAddModal() {
  showAddModal.value = false;
  newSourceName.value = '';
}

// 添加新 API 源
function addApiSource() {
  if (!newSourceName.value.trim()) {
    showMessage('请输入 API 源名称', 'error');
    return;
  }
  
  const newSource = {
    name: newSourceName.value.trim(),
    url: 'https://api.openai.com/v1',
    keys: [''],
    models: ['gpt-3.5-turbo'],
    enabled: true
  };
  
  config.value.apiSources.push(newSource);
  selectedSourceIndex.value = config.value.apiSources.length - 1;
  closeAddModal();
  autoSaveConfig();
  showMessage('API 源已添加');
}

// 删除 API 源
function deleteApiSource(index) {
  if (confirm('确定要删除这个 API 源吗？')) {
    config.value.apiSources.splice(index, 1);
    if (selectedSourceIndex.value >= config.value.apiSources.length) {
      selectedSourceIndex.value = Math.max(0, config.value.apiSources.length - 1);
    }
    autoSaveConfig();
    showMessage('API 源已删除');
  }
}

// 选择 API 源
function selectSource(index) {
  selectedSourceIndex.value = index;
}

// 获取当前选中的 API 源
const selectedSource = computed(() => {
  if (selectedSourceIndex.value >= 0 && selectedSourceIndex.value < config.value.apiSources.length) {
    return config.value.apiSources[selectedSourceIndex.value];
  }
  return null;
});

// 页面加载完成后初始化
onMounted(() => {
  loadConfig();
});
</script>

<template>
  <div class="api-source-management">
    <!-- 左侧 API 源列表 -->
    <div class="left-panel">
      <div class="panel-header">
        <h3 class="panel-title">API 源列表</h3>
      </div>
      
      <div class="source-list">
        <div 
          v-for="(source, index) in config.apiSources" 
          :key="index"
          class="source-item"
          :class="{ active: selectedSourceIndex === index }"
          @click="selectSource(index)"
        >
          <div class="source-info">
            <div class="source-name">{{ source.name }}</div>
          </div>
          <div class="source-actions">
            <label class="toggle">
              <input 
                type="checkbox" 
                v-model="source.enabled"
                @change="autoSaveConfig"
              >
              <span class="toggle-slider"></span>
            </label>
            <button class="btn-delete" @click.stop="deleteApiSource(index)">
              ×
            </button>
          </div>
        </div>
        
        <div v-if="config.apiSources.length === 0" class="empty-state">
          <span class="empty-icon">🔌</span>
          <span class="empty-text">暂无 API 源，请添加</span>
        </div>
      </div>
      
      <!-- 添加按钮放在左侧列表底部 -->
      <button 
        class="btn-add-wide" 
        @click="openAddModal"
      >
        + 添加 API 源
      </button>
    </div>
    
    <!-- 右侧编辑区域 -->
    <div class="right-panel">
      <h3 class="panel-title">编辑 API 源</h3>
      
      <div v-if="selectedSource" class="source-editor">
        <div class="form-group">
          <label class="form-label">名称</label>
          <input 
            type="text" 
            v-model="selectedSource.name" 
            class="input-text"
            @change="autoSaveConfig"
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">API 地址</label>
          <input 
            type="text" 
            v-model="selectedSource.url" 
            class="input-text"
            @change="autoSaveConfig"
          >
        </div>
        
        <div class="form-group">
          <label class="form-label">API Keys</label>
          <div class="keys-list">
            <div 
              v-for="(key, keyIndex) in selectedSource.keys" 
              :key="keyIndex"
              class="key-item"
            >
              <input 
                type="text" 
                v-model="selectedSource.keys[keyIndex]" 
                class="input-text"
                placeholder="API Key"
                @change="autoSaveConfig"
              >
              <button 
                class="btn-remove" 
                @click="selectedSource.keys.splice(keyIndex, 1); autoSaveConfig()"
              >
                ×
              </button>
            </div>
            <button 
              class="btn-add-key" 
              @click="selectedSource.keys.push(''); autoSaveConfig()"
            >
              + 添加 Key
            </button>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">模型列表</label>
          <div class="models-list">
            <div 
              v-for="(model, modelIndex) in selectedSource.models" 
              :key="modelIndex"
              class="model-item"
            >
              <input 
                type="text" 
                v-model="selectedSource.models[modelIndex]" 
                class="input-text"
                placeholder="模型名称"
                @change="autoSaveConfig"
              >
              <button 
                class="btn-remove" 
                @click="selectedSource.models.splice(modelIndex, 1); autoSaveConfig()"
              >
                ×
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <div v-else class="no-selection">
        <span class="no-selection-icon">📝</span>
        <span class="no-selection-text">请选择一个 API 源进行编辑</span>
      </div>
    </div>
    
    <!-- 添加 API 源弹窗 -->
    <div v-if="showAddModal" class="modal-overlay" @click="closeAddModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">添加 API 源</h3>
        <div class="modal-body">
          <label class="form-label">名称</label>
          <input 
            type="text" 
            v-model="newSourceName" 
            class="input-text"
            placeholder="输入 API 源名称"
            @keyup.enter="addApiSource"
          >
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeAddModal">取消</button>
          <button class="btn-confirm" @click="addApiSource">添加</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.api-source-management {
  display: flex;
  gap: 24px;
  height: 100%;
  overflow: hidden;
}

.left-panel {
  width: 300px;
  background-color: #fafafa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.panel-header {
  flex-shrink: 0;
  margin-bottom: 16px;
}

.panel-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.source-list {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin-bottom: 16px;
}

.source-list::-webkit-scrollbar {
  display: none;
}

.source-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12px 16px;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  margin-bottom: 8px;
}

.source-item:hover {
  background-color: #f0f0f0;
}

.source-item.active {
  background-color: #e6f7f0;
  border-left: 4px solid #32F08C;
}

.source-info {
  flex: 1;
  min-width: 0;
}

.source-name {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.source-actions {
  display: flex;
  align-items: center;
  gap: 8px;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 20px;
}

.toggle input {
  opacity: 0;
  width: 0;
  height: 0;
}

.toggle-slider {
  position: absolute;
  cursor: pointer;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: #e5e5e5;
  transition: 0.2s;
  border-radius: 20px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
  background-color: white;
  transition: 0.2s;
  border-radius: 50%;
  box-shadow: 0 1px 3px rgba(0,0,0,0.1);
}

input:checked + .toggle-slider {
  background-color: #32F08C;
}

input:checked + .toggle-slider:before {
  transform: translateX(16px);
}

.btn-delete {
  padding: 4px 8px;
  border: none;
  border-radius: 4px;
  background-color: transparent;
  color: #999;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-delete:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  color: #999;
  text-align: center;
}

.empty-icon {
  font-size: 32px;
}

.empty-text {
  font-size: 14px;
}

.btn-add-wide {
  width: 100%;
  padding: 12px;
  border: 1px dashed #ccc;
  border-radius: 6px;
  background-color: transparent;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  flex-shrink: 0;
}

.btn-add-wide:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
  background-color: #f0f0f0;
}

.right-panel {
  flex: 1;
  background-color: #fafafa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.right-panel > .panel-title {
  flex-shrink: 0;
  margin-bottom: 20px;
}

.source-editor {
  flex: 1;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.source-editor::-webkit-scrollbar {
  display: none;
}

.form-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.form-label {
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
}

.input-text {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fff;
  transition: all 0.2s;
}

.input-text:focus {
  outline: none;
  border-color: #1a1a1a;
  box-shadow: 0 0 0 2px rgba(26, 26, 26, 0.1);
}

.keys-list,
.models-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.key-item,
.model-item {
  display: flex;
  gap: 8px;
}

.btn-remove {
  padding: 0 8px;
  border: none;
  border-radius: 4px;
  background-color: #f0f0f0;
  color: #999;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background-color: #fee2e2;
  color: #dc2626;
}

.btn-add-key {
  padding: 8px 12px;
  border: 1px dashed #ccc;
  border-radius: 6px;
  background-color: transparent;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: left;
}

.btn-add-key:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
  background-color: #f0f0f0;
}

.no-selection {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 60px 20px;
  color: #999;
  text-align: center;
}

.no-selection-icon {
  font-size: 48px;
}

.no-selection-text {
  font-size: 16px;
}

/* 弹窗样式 */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 10000;
}

.modal-content {
  background-color: #fff;
  border-radius: 12px;
  padding: 24px;
  width: 400px;
  max-width: 90%;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 20px;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
}

.btn-cancel {
  padding: 8px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background-color: transparent;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
  background-color: #f0f0f0;
}

.btn-confirm {
  padding: 8px 16px;
  border: none;
  border-radius: 6px;
  background-color: #32F08C;
  color: #fff;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover {
  background-color: #2ad87d;
}
</style>
