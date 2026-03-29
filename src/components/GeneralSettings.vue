<script setup>
import { ref, computed } from 'vue';

// 配置数据
const config = ref({
  autoPopup: true,
  language: 'c'
});

// 预置语言列表
const presetLanguages = [
  { value: 'c', label: 'C' },
  { value: 'c++', label: 'C++' },
  { value: 'cpp', label: 'C++' },
  { value: 'java', label: 'Java' },
  { value: 'python', label: 'Python' },
  { value: 'py', label: 'Python' },
  { value: 'javascript', label: 'JavaScript' },
  { value: 'js', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'ts', label: 'TypeScript' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'rs', label: 'Rust' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'rb', label: 'Ruby' },
  { value: 'php', label: 'PHP' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'kt', label: 'Kotlin' },
  { value: 'scala', label: 'Scala' },
  { value: 'r', label: 'R' },
  { value: 'matlab', label: 'MATLAB' },
  { value: 'sql', label: 'SQL' },
  { value: 'shell', label: 'Shell' },
  { value: 'bash', label: 'Bash' },
  { value: 'powershell', label: 'PowerShell' },
  { value: 'ps', label: 'PowerShell' }
];

// 是否显示下拉建议
const showSuggestions = ref(false);

// 过滤后的建议列表
const filteredSuggestions = computed(() => {
  const input = config.value.language.toLowerCase().trim();
  if (!input) return presetLanguages.slice(0, 8);
  
  return presetLanguages.filter(lang => 
    lang.value.toLowerCase().includes(input) || 
    lang.label.toLowerCase().includes(input)
  ).slice(0, 8);
});

// 选择建议
function selectSuggestion(lang) {
  config.value.language = lang.value;
  showSuggestions.value = false;
  autoSaveConfig();
}

// 隐藏建议（延迟，以便点击事件触发）
function hideSuggestions() {
  setTimeout(() => {
    showSuggestions.value = false;
  }, 200);
}

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
  chrome.storage.local.get(['autoPopup', 'language'], (result) => {
    config.value = {
      autoPopup: result.autoPopup !== undefined ? result.autoPopup : true,
      language: result.language || 'c'
    };
  });
}

// 自动保存配置
function autoSaveConfig() {
  const configToSave = JSON.parse(JSON.stringify(config.value));
  chrome.storage.local.set(configToSave);
}

// 页面加载完成后初始化
loadConfig();
</script>

<template>
  <div class="setting-section">
    <h3 class="section-title">基本设置</h3>
    <div class="setting-card">
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-name">自动弹出浮动窗口</div>
          <div class="setting-desc">在 PTA 答题页面自动显示代码提交浮动窗口</div>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="config.autoPopup" @change="autoSaveConfig">
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-name">指定语言</div>
          <div class="setting-desc">AI 生成代码的默认语言（可自定义输入）</div>
        </div>
        <div class="language-input-wrapper">
          <input 
            type="text" 
            v-model="config.language" 
            class="input-text"
            placeholder="输入语言，如：c, java, python"
            @focus="showSuggestions = true"
            @blur="hideSuggestions"
            @change="autoSaveConfig"
          >
          <div v-if="showSuggestions && filteredSuggestions.length > 0" class="suggestions-dropdown">
            <div 
              v-for="lang in filteredSuggestions" 
              :key="lang.value"
              class="suggestion-item"
              @mousedown.prevent="selectSuggestion(lang)"
            >
              <span class="suggestion-label">{{ lang.label }}</span>
              <span class="suggestion-value">{{ lang.value }}</span>
            </div>
          </div>
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

/* Language Input */
.language-input-wrapper {
  position: relative;
  width: 200px;
}

.input-text {
  width: 100%;
  padding: 8px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fafafa;
  transition: all 0.2s;
}

.input-text:focus {
  outline: none;
  border-color: #1a1a1a;
  background-color: #fff;
}

.suggestions-dropdown {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 4px;
  background-color: #fff;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
  z-index: 100;
  max-height: 200px;
  overflow-y: auto;
}

.suggestion-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  cursor: pointer;
  transition: background-color 0.2s;
}

.suggestion-item:hover {
  background-color: #f5f5f5;
}

.suggestion-item:first-child {
  border-radius: 6px 6px 0 0;
}

.suggestion-item:last-child {
  border-radius: 0 0 6px 6px;
}

.suggestion-label {
  font-size: 14px;
  color: #1a1a1a;
  font-weight: 500;
}

.suggestion-value {
  font-size: 12px;
  color: #999;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}
</style>
