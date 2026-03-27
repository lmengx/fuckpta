<script setup>
import { ref, onMounted } from 'vue';

const autoPopup = ref(false);
const aiEnabled = ref(false);

// 打开配置页面
function openOptions() {
  chrome.runtime.openOptionsPage();
}

// 打开GitHub页面
function openGitHub() {
  window.open('https://github.com', '_blank');
}

// 打开问题反馈链接
function openFeedback() {
  window.open('https://github.com/issues', '_blank');
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
      <h1>PTA</h1>
      <div class="actions">
        <button @click="openOptions" class="icon-btn" title="设置">
          <img src="/setting.svg" alt="设置" class="icon">
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
  padding: 10px;
  border-bottom: 1px solid #eee;
}

.header h1 {
  font-size: 14px;
  font-weight: bold;
  margin: 0;
}

.actions {
  display: flex;
  gap: 5px;
}

.icon-btn {
  background: none;
  border: none;
  padding: 3px;
  cursor: pointer;
  border-radius: 3px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.icon-btn:hover {
  background: #f0f0f0;
}

.icon {
  width: 14px;
  height: 14px;
}

.body {
  flex: 1;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 0;
}

.setting span {
  font-size: 12px;
  color: #333;
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
  background-color: #4CAF50;
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
</style>