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

// 检测状态
const checkStatus = ref({});

// 可用模型列表
const availableModels = ref([]);
const showModelList = ref(false);
const modelFilter = ref('');

// 编辑图标弹窗
const showEditIconModal = ref(false);
const editingSourceIndex = ref(-1);
const editIconData = ref({
  name: '',
  type: 'text',
  content: '',
  color: '#32F08C'
});

// 可用图标列表
const availableIcons = ref([
  'icon1.png',
  'icon2.png',
  'icon3.png',
  'icon4.png',
  'icon5.png'
]);

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
    if (Array.isArray(result.apiSources) && result.apiSources.length > 0) {
      config.value.apiSources = result.apiSources.map(source => ({
        name: source.name || '',
        url: source.url || 'https://api.openai.com/v1',
        keys: Array.isArray(source.keys) ? source.keys.filter(k => k.trim()) : [],
        models: Array.isArray(source.models) ? source.models.filter(m => m.trim()) : ['gpt-3.5-turbo'],
        enabled: source.enabled !== false,
        icon: source.icon || {
          type: 'text',
          content: source.name ? source.name.charAt(0).toUpperCase() : '?',
          color: '#32F08C'
        }
      }));
    } else {
      // 添加默认 API 源
      config.value.apiSources = [
        {
          name: '硅基流动',
          url: 'https://api.siliconflow.cn/v1',
          keys: [''],
          models: ['Qwen/Qwen2.5-7B-Instruct'],
          enabled: false,
          icon: {
            type: 'url',
            content: 'https://cloud.siliconflow.cn/favicon.ico',
            color: '#32F08C'
          }
        },
        {
          name: '阿里云百炼',
          url: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
          keys: [''],
          models: ['qwen3-max'],
          enabled: false,
          icon: {
            type: 'url',
            content: 'https://img.alicdn.com/imgextra/i4/O1CN01YDrZSq1jY4mWMcVoy_!!6000000004559-2-tps-56-56.png',
            color: '#32F08C'
          }
        }
      ];
      // 保存默认 API 源到存储
      autoSaveConfig();
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
    enabled: false,
    icon: {
      type: 'text',
      content: newSourceName.value.trim().charAt(0).toUpperCase(),
      color: '#32F08C'
    }
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

// 检测模型是否可用
async function checkModel(model, apiKey, apiUrl) {
  if (!model || !apiKey || !apiUrl) {
    return { valid: false, message: '请填写模型名称和 API Key' };
  }
  
  const checkKey = `${selectedSourceIndex.value}-${model}`;
  checkStatus.value[checkKey] = 'checking';
  
  try {
    // 检查是否是硅基流动的API
    if (apiUrl.includes('siliconflow.cn')) {
      // 硅基流动的模型检测逻辑
      // 由于硅基流动的API可能与标准OpenAI API不同，我们使用一个简单的测试请求
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          model: model,
          messages: [
            {
              role: 'user',
              content: '测试模型是否可用'
            }
          ],
          max_tokens: 1
        })
      });
      
      if (response.ok) {
        checkStatus.value[checkKey] = 'valid';
        return { valid: true, message: '模型可用' };
      } else {
        const errorData = await response.json();
        checkStatus.value[checkKey] = 'invalid';
        return { valid: false, message: errorData.error?.message || '模型不可用' };
      }
    } else {
      // 其他平台（如阿里云百炼）的标准检测逻辑
      const response = await fetch(`${apiUrl}/models/${model}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${apiKey}`,
          'Content-Type': 'application/json'
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        checkStatus.value[checkKey] = 'valid';
        return { valid: true, message: '模型可用' };
      } else {
        const errorData = await response.json();
        checkStatus.value[checkKey] = 'invalid';
        return { valid: false, message: errorData.error?.message || '模型不可用' };
      }
    }
  } catch (error) {
    checkStatus.value[checkKey] = 'invalid';
    return { valid: false, message: '网络错误，请检查 API 地址' };
  }
}

// 自动检测模型
async function autoCheckModel(modelIndex) {
  if (!selectedSource.value) return;
  
  const model = selectedSource.value.models[modelIndex];
  if (!model) return;
  
  const apiKey = selectedSource.value.keys.find(key => key.trim());
  if (!apiKey) {
    showMessage('请先添加 API Key', 'error');
    return;
  }
  
  const result = await checkModel(model, apiKey, selectedSource.value.url);
  if (result.valid) {
    showMessage('模型检测成功：' + result.message);
  } else {
    showMessage('模型检测失败：' + result.message, 'error');
  }
}

// 处理 API 源启用
async function handleSourceEnable(index, event) {
  const source = config.value.apiSources[index];
  const shouldEnable = event.target.checked;
  
  if (shouldEnable) {
    // 启用 API 源
    source.enabled = true;
    autoSaveConfig();
    showMessage('API 源已启用');
  } else {
    // 禁用 API 源
    source.enabled = false;
    autoSaveConfig();
    showMessage('API 源已禁用');
  }
}

// 手动触发检测
function triggerCheck(modelIndex) {
  autoCheckModel(modelIndex);
}

// 添加模型
function addModel() {
  if (!selectedSource.value) return;
  selectedSource.value.models.push('');
  autoSaveConfig();
}

// 获取可用模型列表
async function fetchAvailableModels() {
  if (!selectedSource.value) return;
  
  const apiKey = selectedSource.value.keys.find(key => key.trim());
  if (!apiKey) {
    showMessage('请先添加 API Key', 'error');
    return;
  }
  
  showMessage('正在获取可用模型...');
  
  try {
    const response = await fetch(`${selectedSource.value.url}/models`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      }
    });
    
    if (response.ok) {
      const data = await response.json();
      availableModels.value = data.data.map(model => ({
        id: model.id,
        name: model.id,
        description: model.description || ''
      }));
      showModelList.value = true;
      showMessage('获取可用模型成功');
    } else {
      const errorData = await response.json();
      showMessage('获取模型失败：' + (errorData.error?.message || '未知错误'), 'error');
    }
  } catch (error) {
    showMessage('网络错误，请检查 API 地址', 'error');
  }
}

// 过滤后的模型列表
const filteredModels = computed(() => {
  if (!modelFilter.value.trim()) {
    return availableModels.value;
  }
  
  const filter = modelFilter.value.toLowerCase();
  return availableModels.value.filter(model => 
    model.id.toLowerCase().includes(filter) ||
    (model.description && model.description.toLowerCase().includes(filter))
  );
});

// 添加选中的模型
function addSelectedModel(modelId) {
  if (!selectedSource.value) return;
  
  if (!selectedSource.value.models.includes(modelId)) {
    selectedSource.value.models.push(modelId);
    autoSaveConfig();
    showMessage('模型已添加');
  } else {
    showMessage('模型已存在', 'error');
  }
  
  showModelList.value = false;
}

// 关闭模型列表
function closeModelList() {
  showModelList.value = false;
  modelFilter.value = '';
}

// 打开编辑图标弹窗
function openEditIconModal(index) {
  const source = config.value.apiSources[index];
  if (!source) return;
  
  editingSourceIndex.value = index;
  editIconData.value = {
    name: source.name,
    type: source.icon.type || 'text',
    content: source.icon.content || source.name.charAt(0).toUpperCase(),
    color: source.icon.color || '#32F08C'
  };
  
  showEditIconModal.value = true;
}

// 关闭编辑图标弹窗
function closeEditIconModal() {
  showEditIconModal.value = false;
  editingSourceIndex.value = -1;
  editIconData.value = {
    type: 'text',
    content: '',
    color: '#32F08C'
  };
}

// 保存图标设置
function saveIconSettings() {
  if (editingSourceIndex.value === -1) return;
  
  const source = config.value.apiSources[editingSourceIndex.value];
  if (!source) return;
  
  // 保存名称
  source.name = editIconData.value.name;
  
  // 保存图标设置
  source.icon = {
    type: editIconData.value.type,
    content: editIconData.value.content || source.name.charAt(0).toUpperCase(),
    color: editIconData.value.color
  };
  
  autoSaveConfig();
  closeEditIconModal();
  showMessage('设置已保存');
}

// 获取 API 地址预览
function getApiUrlPreview(url) {
  if (!url) return '';
  
  // 去除末尾空格
  url = url.trim();
  
  // 如果末尾有井号，直接使用原始地址
  if (url.endsWith('#')) {
    return url;
  }
  
  // 检查是否已经包含 /v 数字
  if (/\/v\d+/.test(url)) {
    return url;
  }
  
  // 否则附加 /v1
  if (url.endsWith('/')) {
    return url + 'v1';
  } else {
    return url + '/v1';
  }
}

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
            <div class="source-icon" v-if="source.icon.type === 'text'" :style="{ backgroundColor: source.icon.color }">
              {{ source.icon.content }}
            </div>
            <div class="source-icon" v-else-if="source.icon.type === 'url'">
              <img :src="source.icon.content" :alt="source.icon.content" class="source-icon-img">
            </div>
            <div class="source-details">
              <div class="source-name">{{ source.name }}</div>
              <div class="source-status" :class="{ 'status-on': source.enabled, 'status-off': !source.enabled }">
                {{ source.enabled ? 'ON' : 'OFF' }}
              </div>
            </div>
          </div>
          <div class="source-actions">
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
      <div v-if="selectedSource" class="source-header">
        <div class="source-header-left">
          <h3 class="source-header-name">{{ selectedSource.name }}</h3>
          <button class="btn-edit-icon" @click="openEditIconModal(selectedSourceIndex)" title="设置图标">
            <img src="/public/setting.svg" alt="设置图标" class="edit-icon-img">
          </button>
        </div>
        <div class="source-header-right">
          <label class="toggle">
            <input 
              type="checkbox" 
              :checked="selectedSource.enabled"
              @change="handleSourceEnable(selectedSourceIndex, $event)"
            >
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
      
      <div v-if="selectedSource" class="source-editor">
        <div class="form-group">
          <label class="form-label">API 地址</label>
          <input 
            type="text" 
            v-model="selectedSource.url" 
            class="input-text"
            @change="autoSaveConfig"
          >
          <div class="api-url-preview">
            预览: {{ getApiUrlPreview(selectedSource.url) }}
          </div>
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
          <div class="form-header">
            <label class="form-label">模型列表</label>
            <div class="header-buttons">
              <button 
                class="btn-secondary" 
                @click="fetchAvailableModels"
              >
                📡 获取可用模型
              </button>
              <button 
                class="btn-add-model" 
                @click="addModel"
                title="添加模型"
              >
                +
              </button>
            </div>
          </div>
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
              <div class="model-actions">
                <button 
                  class="btn-check" 
                  @click="triggerCheck(modelIndex)"
                  :class="checkStatus[`${selectedSourceIndex}-${model}`]"
                >
                  <span v-if="checkStatus[`${selectedSourceIndex}-${model}`] === 'checking'" class="check-text">
                    检测中
                  </span>
                  <span v-else-if="checkStatus[`${selectedSourceIndex}-${model}`] === 'valid'" class="check-text valid">
                    可用
                  </span>
                  <span v-else-if="checkStatus[`${selectedSourceIndex}-${model}`] === 'invalid'" class="check-text invalid">
                    不可用
                  </span>
                  <span v-else class="check-text">
                    检测
                  </span>
                </button>
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
    
    <!-- 可用模型列表弹窗 -->
    <div v-if="showModelList" class="modal-overlay" @click="closeModelList">
      <div class="modal-content modal-large" @click.stop>
        <h3 class="modal-title">可用模型</h3>
        <div class="modal-body">
          <div class="filter-section">
            <input 
              type="text" 
              v-model="modelFilter" 
              class="input-text" 
              placeholder="搜索模型..."
            >
          </div>
          <div v-if="filteredModels.length > 0" class="models-grid">
            <div 
              v-for="model in filteredModels" 
              :key="model.id"
              class="model-card"
              @click="addSelectedModel(model.id)"
            >
              <div class="model-card-id">{{ model.id }}</div>
              <div class="model-card-desc">{{ model.description || '无描述' }}</div>
            </div>
          </div>
          <div v-else-if="availableModels.length > 0" class="empty-filter-state">
            <span class="empty-icon">🔍</span>
            <span class="empty-text">未找到匹配的模型</span>
          </div>
          <div v-else class="loading-state">
            <span class="loading-icon">🔄</span>
            <span class="loading-text">正在加载模型列表...</span>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeModelList">关闭</button>
        </div>
      </div>
    </div>
    
    <!-- 编辑图标弹窗 -->
    <div v-if="showEditIconModal" class="modal-overlay" @click="closeEditIconModal">
      <div class="modal-content" @click.stop>
        <h3 class="modal-title">编辑设置</h3>
        <div class="modal-body">
          <div class="form-group">
            <label class="form-label">名称</label>
            <input 
              type="text" 
              v-model="editIconData.name" 
              class="input-text" 
              placeholder="输入 API 源名称"
            >
          </div>
          
          <div class="form-group">
            <label class="form-label">图标类型</label>
            <div class="icon-type-selector">
              <button 
                class="icon-type-btn" 
                :class="{ active: editIconData.type === 'text' }"
                @click="editIconData.type = 'text'"
              >
                文字图标
              </button>
              <button 
                class="icon-type-btn" 
                :class="{ active: editIconData.type === 'url' }"
                @click="editIconData.type = 'url'"
              >
                URL 图标
              </button>
            </div>
          </div>
          
          <div class="form-group" v-if="editIconData.type === 'text'">
            <label class="form-label">图标文字</label>
            <input 
              type="text" 
              v-model="editIconData.content" 
              class="input-text" 
              placeholder="输入1-2个字符"
              maxlength="2"
            >
          </div>
          
          <div class="form-group" v-if="editIconData.type === 'url'">
            <label class="form-label">图标 URL</label>
            <input 
              type="text" 
              v-model="editIconData.content" 
              class="input-text" 
              placeholder="输入图标 URL"
            >
          </div>
          
          <div class="form-group" v-if="editIconData.type === 'text'">
            <label class="form-label">图标颜色</label>
            <div class="color-picker">
              <input 
                type="color" 
                v-model="editIconData.color" 
                class="color-input"
              >
              <span class="color-value">{{ editIconData.color }}</span>
            </div>
          </div>
          
          <div class="form-group">
            <label class="form-label">预览</label>
            <div class="icon-preview" v-if="editIconData.type === 'text'" :style="{ backgroundColor: editIconData.color }">
              {{ editIconData.content }}
            </div>
            <div class="icon-preview" v-else-if="editIconData.type === 'url'">
              <img :src="editIconData.content" :alt="editIconData.content" class="preview-icon-img">
            </div>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-cancel" @click="closeEditIconModal">取消</button>
          <button class="btn-confirm" @click="saveIconSettings">保存</button>
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
  display: flex;
  align-items: center;
  gap: 12px;
}

.source-icon {
  width: 32px;
  height: 32px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 14px;
  flex-shrink: 0;
  background-color: #f0f0f0;
}

.source-icon-img {
  width: 24px;
  height: 24px;
  object-fit: contain;
}

.source-details {
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
  margin-bottom: 2px;
}

.source-status {
  font-size: 12px;
  font-weight: 500;
  padding: 2px 6px;
  border-radius: 10px;
  display: inline-block;
}

.source-status.status-on {
  background-color: #d1fae5;
  color: #065f46;
}

.source-status.status-off {
  background-color: #fee2e2;
  color: #991b1b;
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

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 20px;
  flex-shrink: 0;
}

.source-header-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.source-header-name {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.btn-edit-icon {
  padding: 6px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background-color: transparent;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-edit-icon:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
  background-color: #f0f0f0;
}

.edit-icon-img {
  width: 16px;
  height: 16px;
  object-fit: contain;
}

.source-header-right {
  display: flex;
  align-items: center;
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

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.header-buttons {
  display: flex;
  gap: 8px;
  align-items: center;
}

.btn-secondary {
  padding: 6px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px 0 0 6px;
  background-color: #fafafa;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 4px;
  height: 32px;
}

.btn-secondary:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
  background-color: #f0f0f0;
}

.btn-add {
  padding: 6px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background-color: transparent;
  color: #666;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
}

.btn-add:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
  background-color: #f0f0f0;
}

.btn-add-model {
  padding: 6px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 0 6px 6px 0;
  background-color: #fafafa;
  color: #666;
  font-size: 14px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  margin-left: -1px;
}

.btn-add-model:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
  background-color: #f0f0f0;
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

.api-url-preview {
  font-size: 12px;
  color: #666;
  margin-top: 4px;
  font-style: italic;
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
  align-items: center;
}

.model-actions {
  display: flex;
  align-items: center;
  gap: 4px;
}

.btn-check {
  padding: 0 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background-color: #fafafa;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 12px;
  height: 34px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 60px;
}

.btn-check:hover {
  background-color: #f0f0f0;
  border-color: #1a1a1a;
}

.btn-check.checking {
  background-color: #f0f9ff;
  border-color: #3b82f6;
  color: #3b82f6;
}

.btn-check.valid {
  background-color: #ecfdf5;
  border-color: #10b981;
  color: #10b981;
}

.btn-check.invalid {
  background-color: #fef2f2;
  border-color: #ef4444;
  color: #ef4444;
}

.check-text {
  font-weight: 500;
}

.check-text.valid {
  color: #10b981;
}

.check-text.invalid {
  color: #ef4444;
}

.btn-remove {
  padding: 0 8px;
  border: none;
  border-radius: 6px;
  background-color: #f0f0f0;
  color: #999;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 34px;
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

.modal-large {
  width: 600px;
  max-height: 80vh;
  overflow-y: auto;
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

.filter-section {
  margin-bottom: 16px;
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

/* 模型网格 */
.models-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(250px, 1fr));
  gap: 12px;
  max-height: 400px;
  overflow-y: auto;
}

.model-card {
  padding: 16px;
  border: 1px solid #e5e5e5;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fafafa;
}

.model-card:hover {
  border-color: #1a1a1a;
  background-color: #f0f0f0;
  transform: translateY(-2px);
}

.model-card-id {
  font-size: 14px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 8px;
  word-break: break-all;
}

.model-card-desc {
  font-size: 12px;
  color: #666;
  line-height: 1.4;
}

.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 12px;
  padding: 40px 20px;
  color: #999;
  text-align: center;
}

.loading-icon {
  font-size: 32px;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

.loading-text {
  font-size: 14px;
}

.empty-filter-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px 20px;
  color: #999;
  text-align: center;
}

/* 图标类型选择器 */
.icon-type-selector {
  display: flex;
  gap: 8px;
  margin-top: 4px;
}

.icon-type-btn {
  flex: 1;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background-color: transparent;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
  text-align: center;
}

.icon-type-btn:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
  background-color: #f0f0f0;
}

.icon-type-btn.active {
  background-color: #32F08C;
  border-color: #32F08C;
  color: #fff;
}

/* 颜色选择器 */
.color-picker {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-top: 4px;
}

.color-input {
  width: 40px;
  height: 34px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  cursor: pointer;
  padding: 0;
}

.color-value {
  font-size: 14px;
  color: #666;
  font-family: monospace;
}

/* 图标预览 */
.icon-preview {
  width: 60px;
  height: 60px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 600;
  font-size: 20px;
  margin-top: 4px;
  background-color: #f0f0f0;
}

.preview-icon-img {
  width: 40px;
  height: 40px;
  object-fit: contain;
}

/* 图标网格 */
.icons-grid {
  display: grid;
  grid-template-columns: repeat(5, 1fr);
  gap: 12px;
  margin-top: 8px;
}

.icon-option {
  width: 50px;
  height: 50px;
  border: 2px solid transparent;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #f0f0f0;
}

.icon-option:hover {
  border-color: #32F08C;
  background-color: #f0f9ff;
}

.icon-option.active {
  border-color: #32F08C;
  background-color: #e6f7f0;
}

.icon-img {
  width: 30px;
  height: 30px;
  object-fit: contain;
}
</style>
