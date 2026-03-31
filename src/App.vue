<script setup>
import { ref, onMounted } from 'vue';
import { PLUGIN_CONFIG, checkForUpdates } from './config.js';

const autoPopup = ref(false);
const aiEnabled = ref(false);
const version = ref(PLUGIN_CONFIG.version);
const hasUpdate = ref(false);
const showUpdateModal = ref(false);
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
  window.open(PLUGIN_CONFIG.githubRepo, '_blank');
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

// 打开更新选择弹窗
function openUpdateModal() {
  showUpdateModal.value = true;
}

// 关闭更新选择弹窗
function closeUpdateModal() {
  showUpdateModal.value = false;
}

// 打开GitHub更新链接
function openGitHubUpdate() {
  window.open(PLUGIN_CONFIG.githubRepo, '_blank');
  closeUpdateModal();
}

// 打开Gitee更新链接
function openGiteeUpdate() {
  window.open(PLUGIN_CONFIG.giteeRepo, '_blank');
  closeUpdateModal();
}

// 加载配置
onMounted(async () => {
  chrome.storage.local.get(['autoPopup', 'aiEnabled', 'debugMode', 'debugEnabled'], (result) => {
    autoPopup.value = result.autoPopup ?? true;
    aiEnabled.value = result.aiEnabled ?? false;
    
    // 检查更新
    checkForUpdates().then(updateInfo => {
      hasUpdate.value = updateInfo.hasUpdate;
      
      // 如果调试模式开启，输出版本更新匹配信息
      if (result.debugMode && result.debugEnabled) {
        console.log('[PTA 答题辅助] 版本更新检查结果:', {
          currentVersion: updateInfo.currentVersion,
          latestVersion: updateInfo.latestVersion,
          hasUpdate: updateInfo.hasUpdate,
          source: updateInfo.source,
          error: updateInfo.error
        });
      }
    });
  });
});
</script>

<template>
  <div class="container">
    <div class="header">
      <h1>PTA 答题辅助</h1>
      <div class="actions">
        <button v-if="hasUpdate" @click="openUpdateModal" class="icon-btn update-btn" title="发现新版本">
          <img src="/icon/smallPanel/update.svg" alt="更新" class="icon">
        </button>
        <button @click="openOptions" class="icon-btn" title="设置">
          <img src="/icon/smallPanel/setting.svg" alt="设置" class="icon">
        </button>
        <button @click="openGitHub" class="icon-btn" title="GitHub">
          <img src="/icon/smallPanel/github.svg" alt="GitHub" class="icon">
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
      <span class="version" @click="onVersionClick">v{{ version }}</span>
      <button @click="openFeedback" class="footer-link">问题反馈</button>
  </footer>

  <!-- 更新选择弹窗 -->
  <div v-if="showUpdateModal" class="modal-overlay" @click="closeUpdateModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <h3 class="modal-title">选择更新源</h3>
      </div>
      <div class="modal-body">
        <p class="modal-desc">发现新版本，请选择下载源：</p>
        <div class="update-options">
          <button class="update-option-btn github" @click="openGitHubUpdate">
            <span class="option-title">GitHub</span>
            <span class="option-desc">国外用户推荐</span>
          </button>
          <button class="update-option-btn gitee" @click="openGiteeUpdate">
            <span class="option-title">Gitee</span>
            <span class="option-desc">国内用户推荐</span>
          </button>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-cancel" @click="closeUpdateModal">取消</button>
      </div>
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

/* 更新按钮动画 */
.update-btn {
  animation: pulse 2s infinite;
}

@keyframes pulse {
  0% {
    transform: scale(1);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
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
  width: 320px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
  animation: modalAppear 0.3s ease;
}

@keyframes modalAppear {
  from {
    opacity: 0;
    transform: scale(0.9) translateY(20px);
  }
  to {
    opacity: 1;
    transform: scale(1) translateY(0);
  }
}

.modal-header {
  margin-bottom: 16px;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.modal-body {
  margin-bottom: 20px;
}

.modal-desc {
  font-size: 14px;
  color: #666;
  margin-bottom: 16px;
}

.update-options {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.update-option-btn {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 16px;
  border: 2px solid #e8e8e8;
  border-radius: 8px;
  background-color: #fff;
  cursor: pointer;
  transition: all 0.2s;
}

.update-option-btn:hover {
  border-color: #32F08C;
  background-color: #f6ffed;
}

.update-option-btn .option-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 4px;
}

.update-option-btn .option-desc {
  font-size: 12px;
  color: #999;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.btn-cancel {
  padding: 8px 24px;
  border: 1px solid #d9d9d9;
  border-radius: 6px;
  background-color: #fff;
  color: #666;
  font-size: 14px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-cancel:hover {
  border-color: #32F08C;
  color: #32F08C;
}

</style>