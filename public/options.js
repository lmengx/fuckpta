// 默认配置
const defaultConfig = {
  autoPopup: true,
  extractDelay: 2000,
  language: 'c',
  aiEnabled: false,
  aiApiKey: '',
  aiApiUrl: 'https://api.openai.com/v1',
  aiModel: 'gpt-3.5-turbo',
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
测试点提示提示：{data_tip}

请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。
严格遵守格式：换行、空格、缩进必须完全符合题目要求。
题目如下：
{problem content}
错误源码如下：
{res_code}`
};

// 加载设置
document.addEventListener('DOMContentLoaded', function() {
  // 标签页切换
  const tabs = document.querySelectorAll('.tab');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const targetTab = tab.dataset.tab;
      
      tabs.forEach(t => t.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      tab.classList.add('active');
      document.getElementById(targetTab).classList.add('active');
    });
  });
  
  // 加载设置
  loadSettings();

  // 保存设置
  document.getElementById('saveBtn').addEventListener('click', saveSettings);
  
  // 导出配置
  document.getElementById('exportBtn').addEventListener('click', exportConfig);
  
  // 导入配置
  document.getElementById('importBtn').addEventListener('click', () => {
    document.getElementById('fileInput').click();
  });
  
  document.getElementById('fileInput').addEventListener('change', importConfig);
  
  // 恢复默认
  document.getElementById('resetBtn').addEventListener('click', resetToDefault);
});

// 加载设置
function loadSettings() {
  chrome.storage.local.get(Object.keys(defaultConfig), function(result) {
    // 使用默认配置填充未设置的值
    const settings = { ...defaultConfig, ...result };
    
    // 常规设置
    document.getElementById('autoPopup').checked = settings.autoPopup;
    document.getElementById('extractDelay').value = settings.extractDelay;
    document.getElementById('language').value = settings.language;
    
    // AI 设置
    document.getElementById('aiEnabled').checked = settings.aiEnabled;
    document.getElementById('aiApiKey').value = settings.aiApiKey;
    document.getElementById('aiApiUrl').value = settings.aiApiUrl;
    document.getElementById('aiModel').value = settings.aiModel;
    document.getElementById('aiSystemPrompt').value = settings.aiSystemPrompt;
    document.getElementById('aiErrorPrompt').value = settings.aiErrorPrompt;
  });
}

// 保存设置
function saveSettings() {
  const settings = {
    autoPopup: document.getElementById('autoPopup').checked,
    extractDelay: parseInt(document.getElementById('extractDelay').value) || 2000,
    language: document.getElementById('language').value,
    aiEnabled: document.getElementById('aiEnabled').checked,
    aiApiKey: document.getElementById('aiApiKey').value,
    aiApiUrl: document.getElementById('aiApiUrl').value,
    aiModel: document.getElementById('aiModel').value,
    aiSystemPrompt: document.getElementById('aiSystemPrompt').value,
    aiErrorPrompt: document.getElementById('aiErrorPrompt').value
  };
  
  chrome.storage.local.set(settings, function() {
    showStatus('设置已保存！', false);
  });
}

// 导出配置
function exportConfig() {
  chrome.storage.local.get(Object.keys(defaultConfig), function(result) {
    const settings = { ...defaultConfig, ...result };
    const configJson = JSON.stringify(settings, null, 2);
    
    const blob = new Blob([configJson], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = 'pta-helper-config.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    
    URL.revokeObjectURL(url);
    showStatus('配置已导出！', false);
  });
}

// 导入配置
function importConfig(event) {
  const file = event.target.files[0];
  if (!file) return;
  
  const reader = new FileReader();
  reader.onload = function(e) {
    try {
      const importedConfig = JSON.parse(e.target.result);
      
      // 验证配置
      const validKeys = Object.keys(defaultConfig);
      const filteredConfig = {};
      
      validKeys.forEach(key => {
        if (importedConfig.hasOwnProperty(key)) {
          filteredConfig[key] = importedConfig[key];
        }
      });
      
      // 保存导入的配置
      chrome.storage.local.set(filteredConfig, function() {
        loadSettings(); // 重新加载设置
        showStatus('配置已导入！', false);
      });
    } catch (error) {
      showStatus('导入失败：配置文件格式错误', true);
    }
  };
  
  reader.readAsText(file);
  
  // 清空文件输入，允许重复导入同一文件
  event.target.value = '';
}

// 恢复默认
function resetToDefault() {
  if (confirm('确定要恢复默认配置吗？这将覆盖当前所有设置。')) {
    chrome.storage.local.set(defaultConfig, function() {
      loadSettings(); // 重新加载设置
      showStatus('已恢复默认配置！', false);
    });
  }
}

// 显示状态信息
function showStatus(message, isError) {
  const status = document.getElementById('status');
  status.textContent = message;
  status.className = 'status show' + (isError ? ' error' : '');
  setTimeout(function() {
    status.classList.remove('show');
  }, 2000);
}