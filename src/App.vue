<script setup>
import { ref, onMounted } from 'vue';

const autoPopup = ref(false);
const aiEnabled = ref(false);
let clickCount = 0;
let clickTimer = null;

// 打开配置页面
function openOptions() {
  chrome.tabs.create({
    url: chrome.runtime.getURL('options.html')
  });
}

// 打开GitHub页面
function openGitHub() {
  window.open('https://github.com/lmengx/fuckpta', '_blank');
}

// 打开问题反馈链接
function openFeedback() {
  window.open('https://github.com/lmengx/fuckpta/issues', '_blank');
}

// 切换自动弹窗
function toggleAutoPopup() {
  autoPopup.value = !autoPopup.value;
  chrome.storage.local.set({ autoPopup: autoPopup.value });
}

// 切换AI启用状态
function toggleAiEnabled() {
  aiEnabled.value = !aiEnabled.value;
  chrome.storage.local.set({ aiEnabled: aiEnabled.value });
}

// 版本号点击事件 - 点击5下开启调试模式
function onVersionClick() {
  clickCount++;
  
  // 重置计时器
  if (clickTimer) {
    clearTimeout(clickTimer);
  }
  
  // 3秒内点击5次开启调试模式
  clickTimer = setTimeout(() => {
    clickCount = 0;
  }, 3000);
  
  if (clickCount === 5) {
    // 开启调试模式
    chrome.storage.local.set({ debugMode: true }, () => {
      alert('调试模式已开启！');
      // 打开配置页面
      chrome.tabs.create({
        url: chrome.runtime.getURL('options.html')
      });
    });
    clickCount = 0;
  }
}


// 加载配置
onMounted(() => {
  chrome.storage.local.get(['autoPopup', 'aiEnabled'], (result) => {
    autoPopup.value = result.autoPopup ?? true;
    aiEnabled.value = result.aiEnabled ?? false;
  });
});
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>PTA 答题辅助</h1>
      <div class="actions">
        <button @click="openOptions" class="icon-btn" title="设置">
          <img src="/setting.svg" alt="设置" class="icon">
        </button>
        <button @click="openGitHub" class="icon-btn" title="GitHub">
          <img src="/github.svg" alt="GitHub" class="icon">
        </button>
      </div>
    </div>
    <div class="body">
      <div class="setting">
        <span>弹窗</span>
        <label class="toggle">
          <input type="checkbox" :checked="autoPopup" @change="toggleAutoPopup">
          <span class="toggle-slider"></span>
        </label>
      </div>
      <div class="setting">
        <span>AI</span>
        <label class="toggle">
          <input type="checkbox" :checked="aiEnabled" @change="toggleAiEnabled">
          <span class="toggle-slider"></span>
        </label>
      </div>

    </div>

  <footer class="footer">
      <span class="version" @click="onVersionClick">v1.0</span>
      <button @click="openFeedback" class="footer-link">问题反馈</button>
  </footer>

  </div>
</template>

<style scoped>
.container {
  font-family: Arial, sans-serif;
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  border: 1px solid #eee;
  border-radius: 4px;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 12 12px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  letter-spacing: 2px;
  line-height: 1.5;
  font-size: 16px;
  font-weight: bold;
  margin: 0;
}

.actions {
  display: flex;
  gap: 8px;
}

.icon-btn {
  background: none;
  border: none;
  padding: 4px;
  cursor: pointer;
  border-radius: 4px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #f0f0f0;
}

.icon {
  width: 16px;
  height: 16px;
}

.body {
  flex: 1;
  padding: 12px;
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
}

.setting span {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 36px;
  height: 18px;
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
  background-color: #ccc;
  transition: .4s;
  border-radius: 18px;
}

.toggle-slider:before {
  position: absolute;
  content: "";
  height: 14px;
  width: 14px;
  left: 2px;
  bottom: 2px;
  background-color: white;
  transition: .4s;
  border-radius: 50%;
}

input:checked + .toggle-slider {
  background-color: #32F08C;
}

input:checked + .toggle-slider:before {
  transform: translateX(18px);
}

/* 去掉滚动条 */
::-webkit-scrollbar {
  display: none;
}

* {
  scrollbar-width: none;
  -ms-overflow-style: none;
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

/* Footer */
.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  border-top: 1px solid #eee;
  font-size: 12px;
  color: #666;
  margin-top: auto;
}

.version {
  font-weight: 500;
}

.footer-link {
  background: none;
  border: none;
  color: #2196F3;
  cursor: pointer;
  padding: 0;
  font-size: 12px;
}

.footer-link:hover {
  text-decoration: underline;
}

</style>