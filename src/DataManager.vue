<script setup>
import { ref, onMounted } from 'vue';

// 状态提示
const statusMessage = ref('');
const statusType = ref('success');
const showStatus = ref(false);

// 默认配置
const defaultConfig = {
  autoPopup: true,
  language: 'c',
  aiEnabled: false,
  aiApiKey: '',
  aiApiUrl: 'https://api.openai.com/v1',
  aiModel: 'gpt-3.5-turbo',
  debugMode: false,
  debugEnabled: false,
  showBuildTime: false,
  extractDelay: 2000,
  aiSystemPrompt: `你是专业的编程题 AC 生成器。\n语言：{language}\n\n请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。\n严格遵守格式：换行、空格、缩进必须完全符合题目要求。\n\n以下是题目内容：\n{problem content}`,
  aiErrorPrompt: `你是专业的编程题 AC 生成器。\n语言：{language}\n错误类型：{error_type}\n编译器提示：{compiler_msg}\n测试点提示：{data_tip}\n\n请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。\n严格遵守格式：换行、空格、缩进必须完全符合题目要求。\n题目如下：\n{problem content}\n错误源码如下：\n{res_code}`
};

// 显示状态消息
function showMessage(message, type = 'success') {
  statusMessage.value = message;
  statusType.value = type;
  showStatus.value = true;
  setTimeout(() => {
    showStatus.value = false;
  }, 2000);
}

// 导出全部配置
function exportAllConfig() {
  chrome.storage.local.get(null, (result) => {
    const exportData = { ...defaultConfig, ...result };
    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pta-helper-config-all.json';
    link.click();
    URL.revokeObjectURL(url);
    showMessage('全部配置已导出');
  });
}

// 导出 AI API 配置
function exportAiConfig() {
  chrome.storage.local.get(['aiEnabled', 'aiApiKey', 'aiApiUrl', 'aiModel', 'aiSystemPrompt', 'aiErrorPrompt'], (result) => {
    const aiConfig = {
      aiEnabled: result.aiEnabled ?? false,
      aiApiKey: result.aiApiKey ?? '',
      aiApiUrl: result.aiApiUrl ?? 'https://api.openai.com/v1',
      aiModel: result.aiModel ?? 'gpt-3.5-turbo',
      aiSystemPrompt: result.aiSystemPrompt ?? defaultConfig.aiSystemPrompt,
      aiErrorPrompt: result.aiErrorPrompt ?? defaultConfig.aiErrorPrompt
    };
    const dataStr = JSON.stringify(aiConfig, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'pta-helper-config-ai.json';
    link.click();
    URL.revokeObjectURL(url);
    showMessage('AI 配置已导出');
  });
}

// 导入配置
function importConfig() {
  const fileInput = document.createElement('input');
  fileInput.type = 'file';
  fileInput.accept = '.json';
  fileInput.onchange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const importedConfig = JSON.parse(e.target.result);
          chrome.storage.local.set(importedConfig, () => {
            showMessage('配置已导入，请刷新设置页面');
          });
        } catch (error) {
          showMessage('导入配置失败：' + error.message, 'error');
        }
      };
      reader.readAsText(file);
    }
  };
  fileInput.click();
}

// 恢复默认配置
function resetConfig() {
  if (confirm('确定要恢复默认配置吗？这将覆盖当前所有设置。')) {
    chrome.storage.local.clear(() => {
      chrome.storage.local.set(defaultConfig, () => {
        showMessage('已恢复默认配置，请刷新页面');
      });
    });
  }
}

// 清除所有数据
function clearAllData() {
  if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
    chrome.storage.local.clear(() => {
      showMessage('所有数据已清除，请刷新页面', 'error');
    });
  }
}
</script>

<template>
  <div class="container">
    <div class="content">
      <h1>数据管理</h1>
      
      <div class="section">
        <h2>导出配置</h2>
        <div class="card">
          <div class="card-item">
            <div class="card-info">
              <div class="card-title">导出全部配置</div>
              <div class="card-desc">导出所有设置项，包括常规设置、AI 设置和调试设置</div>
            </div>
            <button class="btn btn-primary" @click="exportAllConfig">导出全部</button>
          </div>
          
          <div class="card-item">
            <div class="card-info">
              <div class="card-title">导出 AI 配置</div>
              <div class="card-desc">仅导出 AI 相关设置，包括 API 密钥、模型、提示词等</div>
            </div>
            <button class="btn btn-secondary" @click="exportAiConfig">导出 AI 配置</button>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>导入配置</h2>
        <div class="card">
          <div class="card-item">
            <div class="card-info">
              <div class="card-title">导入配置文件</div>
              <div class="card-desc">从 JSON 文件导入配置，可以选择导入全部配置或仅 AI 配置</div>
            </div>
            <button class="btn btn-primary" @click="importConfig">选择文件导入</button>
          </div>
        </div>
      </div>
      
      <div class="section">
        <h2>重置数据</h2>
        <div class="card">
          <div class="card-item">
            <div class="card-info">
              <div class="card-title">恢复默认配置</div>
              <div class="card-desc">将所有设置恢复为默认值，保留扩展的基本功能</div>
            </div>
            <button class="btn btn-warning" @click="resetConfig">恢复默认</button>
          </div>
          
          <div class="card-item">
            <div class="card-info">
              <div class="card-title">清除所有数据</div>
              <div class="card-desc">删除所有存储的数据，包括配置和缓存，此操作不可恢复</div>
            </div>
            <button class="btn btn-danger" @click="clearAllData">清除所有</button>
          </div>
        </div>
      </div>
      
      <div class="status" :class="{ show: showStatus, error: statusType === 'error' }">{{ statusMessage }}</div>
    </div>
  </div>
</template>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  width: 100%;
  min-height: 100vh;
  padding: 20px;
  background-color: #f5f5f5;
  box-sizing: border-box;
}

.content {
  background-color: white;
  padding: 30px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0,0,0,0.1);
  max-width: 1200px;
  margin: 0 auto;
}

h1 {
  color: #333;
  margin-bottom: 30px;
  text-align: center;
}

h2 {
  color: #555;
  margin-bottom: 15px;
  font-size: 18px;
  border-bottom: 1px solid #eee;
  padding-bottom: 10px;
}

.section {
  margin-bottom: 30px;
}

.card {
  background-color: #fafafa;
  border-radius: 8px;
  padding: 20px;
}

.card-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 15px 0;
  border-bottom: 1px solid #eee;
  gap: 20px;
}

.card-item:last-child {
  border-bottom: none;
}

.card-info {
  flex: 1;
  min-width: 0;
}

.card-title {
  font-size: 16px;
  color: #333;
  margin-bottom: 5px;
  font-weight: 500;
}

.card-desc {
  font-size: 13px;
  color: #888;
}

.btn {
  padding: 10px 20px;
  border: none;
  border-radius: 4px;
  font-size: 14px;
  cursor: pointer;
  white-space: nowrap;
  transition: background-color 0.2s;
}

.btn-primary {
  background-color: #4CAF50;
  color: white;
}

.btn-primary:hover {
  background-color: #45a049;
}

.btn-secondary {
  background-color: #2196F3;
  color: white;
}

.btn-secondary:hover {
  background-color: #1976D2;
}

.btn-warning {
  background-color: #ff9800;
  color: white;
}

.btn-warning:hover {
  background-color: #f57c00;
}

.btn-danger {
  background-color: #f44336;
  color: white;
}

.btn-danger:hover {
  background-color: #d32f2f;
}

.status {
  text-align: center;
  margin-top: 30px;
  color: #4CAF50;
  font-size: 14px;
  opacity: 0;
  transition: opacity 0.3s;
}

.status.show {
  opacity: 1;
}

.status.error {
  color: #f44336;
}
</style>
