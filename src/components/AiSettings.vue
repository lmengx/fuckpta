<script setup>
import { ref, computed } from 'vue';

// 配置数据
const config = ref({
  aiEnabled: false,
  modelSelectMode: 'random',
  selectedModelId: '',
  aiSystemPrompt: `你是专业的编程题 AC 生成器。
语言：{language}

请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。
严格遵守格式：换行、空格、缩进必须完全符合题目要求。

以下是题目内容：
{problem content}`,
  aiErrorPrompt: `你是专业的编程题 AC 生成器。
语言：{language}
错误类型：{error_type}
编译器提示：{compiler_msg}
测试点提示：{data_tip}

请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。
严格遵守格式：换行、空格、缩进必须完全符合题目要求。
题目如下：
{problem content}
错误源码如下：
{res_code}`
});

// API 源数据
const apiSources = ref([]);

// 获取所有已启用的模型列表
const enabledModels = computed(() => {
  const models = [];
  apiSources.value.forEach(source => {
    if (source.enabled) {
      source.models.forEach(model => {
        models.push({
          id: model,
          sourceName: source.name,
          sourceUrl: source.url
        });
      });
    }
  });
  return models;
});

// 显示状态消息
function showMessage(message, type = 'success') {
  // 创建临时的状态消息元素
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
  
  // 显示消息
  setTimeout(() => {
    messageElement.style.opacity = '1';
    messageElement.style.transform = 'translateY(0)';
  }, 100);
  
  // 2秒后隐藏消息
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
  chrome.storage.local.get(['aiEnabled', 'modelSelectMode', 'selectedModelId', 'apiSources', 'aiSystemPrompt', 'aiErrorPrompt'], (result) => {
    // 合并默认配置和用户配置
    config.value = {
      ...config.value,
      ...result
    };
    
    // 加载 API 源数据
    if (Array.isArray(result.apiSources)) {
      apiSources.value = result.apiSources.map(source => ({
        name: source.name || '',
        url: source.url || 'https://api.openai.com/v1',
        keys: Array.isArray(source.keys) ? source.keys.filter(k => k.trim()) : [],
        models: Array.isArray(source.models) ? source.models.filter(m => m.trim()) : ['gpt-3.5-turbo'],
        enabled: source.enabled !== false
      }));
    } else {
      apiSources.value = [];
    }
  });
}

// 自动保存配置
function autoSaveConfig() {
  // 将响应式对象转换为普通对象再保存
  const configToSave = JSON.parse(JSON.stringify(config.value));
  chrome.storage.local.set(configToSave);
}

// 页面加载完成后初始化
loadConfig();
</script>

<template>
  <div>
    <div class="setting-section">
      <h3 class="section-title">基本设置</h3>
      <div class="setting-card">
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-name">启用 AI 答题</div>
            <div class="setting-desc">自动使用 AI 生成答案</div>
          </div>
          <label class="toggle">
            <input type="checkbox" v-model="config.aiEnabled" @change="autoSaveConfig">
            <span class="toggle-slider"></span>
          </label>
        </div>
      </div>
    </div>
    

    
    <div class="setting-section">
      <h3 class="section-title">模型选择</h3>
      <div class="setting-card">
        <div class="setting-item">
          <div class="setting-info">
            <div class="setting-name">选择模式</div>
            <div class="setting-desc">随机选择可避免多次生成相同内容</div>
          </div>
          <select v-model="config.modelSelectMode" class="input-select" @change="autoSaveConfig">
            <option value="random">随机选择</option>
            <option value="manual">手动选择</option>
          </select>
        </div>
        
        <div class="setting-item" v-if="config.modelSelectMode === 'manual'">
          <div class="setting-info">
            <div class="setting-name">选择模型</div>
            <div class="setting-desc">从已启用的 API 源中选择模型</div>
          </div>
          <select v-model="config.selectedModelId" class="input-select wide" @change="autoSaveConfig">
            <option value="">请选择模型</option>
            <option v-for="model in enabledModels" :key="model.id" :value="model.id">
              {{ model.id }} ({{ model.sourceName }})
            </option>
          </select>
        </div>
        
        <div v-if="enabledModels.length > 0" class="model-preview">
          <span class="preview-label">可用模型 ({{ enabledModels.length }} 个):</span>
          <div class="model-tags">
            <span v-for="model in enabledModels" :key="model.id" class="model-tag">
              {{ model.id }}
            </span>
          </div>
        </div>
      </div>
    </div>
    
    <div class="setting-section">
      <h3 class="section-title">提示词设置</h3>
      <div class="setting-card">
        <div class="setting-item vertical">
          <div class="setting-info">
            <div class="setting-name">系统提示词</div>
            <div class="setting-desc">AI 的系统提示词</div>
          </div>
          <textarea v-model="config.aiSystemPrompt" class="input-textarea" placeholder="你是一个编程助手..." @blur="autoSaveConfig"></textarea>
        </div>
        
        <div class="setting-item vertical">
          <div class="setting-info">
            <div class="setting-name">纠错提示词</div>
            <div class="setting-desc">AI 纠错时的提示词</div>
          </div>
          <textarea v-model="config.aiErrorPrompt" class="input-textarea" placeholder="你是一个编程助手..." @blur="autoSaveConfig"></textarea>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.setting-section {
  margin-bottom: 40px;
}

.setting-card {
  background-color: #fafafa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.setting-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 0;
  border-bottom: 1px solid #f0f0f0;
  gap: 32px;
}

.setting-item:last-child {
  border-bottom: none;
}

.setting-item.vertical {
  flex-direction: column;
  align-items: flex-start;
  gap: 12px;
}

.setting-info {
  flex: 1;
  min-width: 0;
}

.setting-name {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.setting-desc {
  font-size: 13px;
  color: #999;
  line-height: 1.4;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
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
  border-radius: 24px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 18px;
  width: 18px;
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
  transform: translateX(20px);
}

/* Inputs */
.input-select {
  width: 140px;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fafafa;
  cursor: pointer;
}

.input-select.wide {
  width: 280px;
}

.input-select:focus {
  outline: none;
  border-color: #1a1a1a;
  background-color: #fff;
}

.input-textarea {
  width: 100%;
  height: 120px;
  padding: 12px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fafafa;
  resize: vertical;
  font-family: inherit;
  line-height: 1.5;
  transition: all 0.2s;
}

.input-textarea:focus {
  outline: none;
  border-color: #1a1a1a;
  background-color: #fff;
}

/* Section Divider */
.section-divider {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-top: 16px;
  border-top: 1px solid #f0f0f0;
  margin-top: 8px;
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

/* Buttons */
.btn-add {
  padding: 8px 16px;
  border: 1px dashed #ccc;
  border-radius: 6px;
  background-color: transparent;
  color: #666;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
  background-color: #fafafa;
}

/* Empty State */
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 40px;
  background-color: #fafafa;
  border-radius: 12px;
  border: 1px dashed #e5e5e5;
}

.empty-icon {
  font-size: 32px;
}

.empty-text {
  font-size: 14px;
  color: #999;
}

/* API Source List */
.api-source-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 16px;
}

/* Model Preview */
.model-preview {
  padding: 16px;
  background-color: #f0f0f0;
  border-radius: 8px;
  margin-top: 16px;
}

.preview-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
  display: block;
}

.model-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
}

.model-tag {
  padding: 4px 12px;
  background-color: #e0e0e0;
  border-radius: 4px;
  font-size: 13px;
  color: #666;
}
</style>
