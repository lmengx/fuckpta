<script setup>
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
      document.body.removeChild(messageElement);
    }, 300);
  }, 2000);
}

// 导出全部配置
function exportAllConfig() {
  chrome.storage.local.get(null, (result) => {
    // 默认配置
    const defaultConfig = {
      autoPopup: true,
      language: 'c',
      aiEnabled: false,
      debugMode: false,
      debugEnabled: false,
      showBuildTime: false,
      extractDelay: 2000,
      modelSelectMode: 'random',
      selectedModelId: '',
      apiSources: [],
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
    };
    
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

// 导出 AI 配置
function exportAiConfig() {
  chrome.storage.local.get(['aiEnabled', 'modelSelectMode', 'selectedModelId', 'apiSources', 'aiSystemPrompt', 'aiErrorPrompt'], (result) => {
    const aiConfig = {
      aiEnabled: result.aiEnabled || false,
      modelSelectMode: result.modelSelectMode || 'random',
      selectedModelId: result.selectedModelId || '',
      apiSources: result.apiSources || [],
      aiSystemPrompt: result.aiSystemPrompt || `你是专业的编程题 AC 生成器。
语言：{language}

请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。
严格遵守格式：换行、空格、缩进必须完全符合题目要求。

以下是题目内容：
{problem content}`,
      aiErrorPrompt: result.aiErrorPrompt || `你是专业的编程题 AC 生成器。
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
          // 确保导入的配置格式正确
          if (importedConfig.apiSources) {
            // 验证 apiSources 格式
            if (Array.isArray(importedConfig.apiSources)) {
              importedConfig.apiSources = importedConfig.apiSources.map(source => ({
                name: source.name || '',
                url: source.url || 'https://api.openai.com/v1',
                keys: Array.isArray(source.keys) ? source.keys.filter(k => k.trim()) : [],
                models: Array.isArray(source.models) ? source.models.filter(m => m.trim()) : ['gpt-3.5-turbo'],
                enabled: source.enabled !== false
              }));
            } else {
              importedConfig.apiSources = [];
            }
          } else {
            // 确保 apiSources 存在
            importedConfig.apiSources = [];
          }
          chrome.storage.local.set(importedConfig, () => {
            showMessage('配置已导入');
            // 重新加载页面以应用新配置
            setTimeout(() => {
              location.reload();
            }, 1000);
          });
        } catch (error) {
          showMessage('导入失败：' + error.message, 'error');
        }
      };
      reader.readAsText(file);
    }
  };
  fileInput.click();
}

// 恢复默认配置
function resetConfig() {
  if (confirm('确定要恢复默认配置吗？')) {
    const defaultConfig = {
      autoPopup: true,
      language: 'c',
      aiEnabled: false,
      debugMode: false,
      debugEnabled: false,
      showBuildTime: false,
      extractDelay: 2000,
      modelSelectMode: 'random',
      selectedModelId: '',
      apiSources: [],
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
    };
    chrome.storage.local.clear(() => {
      chrome.storage.local.set(defaultConfig, () => {
        showMessage('已恢复默认配置');
        // 重新加载页面以应用新配置
        setTimeout(() => {
          location.reload();
        }, 1000);
      });
    });
  }
}

// 清除所有数据
function clearAllData() {
  if (confirm('确定要清除所有数据吗？此操作不可恢复！')) {
    chrome.storage.local.clear(() => {
      showMessage('所有数据已清除', 'error');
      // 重新加载页面以应用新配置
      setTimeout(() => {
        location.reload();
      }, 1000);
    });
  }
}
</script>

<template>
  <div>
    <div class="data-section">
      <h3 class="section-title">导出配置</h3>
      <div class="data-grid">
        <DataCard 
          icon="📦" 
          name="导出全部" 
          desc="导出所有设置项" 
          @click="exportAllConfig"
        />
        <DataCard 
          icon="🤖" 
          name="导出 AI" 
          desc="仅导出 AI 配置" 
          @click="exportAiConfig"
        />
      </div>
    </div>
    
    <div class="data-section">
      <h3 class="section-title">导入配置</h3>
      <div class="data-grid">
        <DataCard 
          icon="📥" 
          name="导入配置" 
          desc="从 JSON 文件导入" 
          @click="importConfig"
        />
      </div>
    </div>
    
    <div class="data-section">
      <h3 class="section-title">重置数据</h3>
      <div class="data-grid">
        <DataCard 
          icon="🔄" 
          name="恢复默认" 
          desc="恢复默认配置" 
          type="warning"
          @click="resetConfig"
        />
        <DataCard 
          icon="🗑️" 
          name="清除所有" 
          desc="删除所有数据" 
          type="danger"
          @click="clearAllData"
        />
      </div>
    </div>
  </div>
</template>

<script>
import DataCard from './DataCard.vue';

export default {
  components: {
    DataCard
  }
};
</script>

<style scoped>
.data-section {
  margin-bottom: 40px;
}

.data-section > .section-title {
  margin-bottom: 16px;
}

.data-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}
</style>