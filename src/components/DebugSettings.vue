<script setup>
import { ref } from 'vue';

// 配置数据
const config = ref({
  debugEnabled: false
});

// 构建时间弹窗显示状态
const showBuildTimeModal = ref(false);

// 构建时间
const BUILD_TIME = import.meta.env.BUILD_TIME || process.env.BUILD_TIME || BUILD_TIME || '未知';

// 加载配置
function loadConfig() {
  chrome.storage.local.get(['debugEnabled'], (result) => {
    config.value.debugEnabled = result.debugEnabled !== undefined ? result.debugEnabled : false;
  });
}

// 自动保存配置
function autoSaveConfig() {
  // 将响应式对象转换为普通对象再保存
  const configToSave = JSON.parse(JSON.stringify(config.value));
  chrome.storage.local.set(configToSave);
}

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

function openBuildTimeModal() {
  showBuildTimeModal.value = true;
}

function closeBuildTimeModal() {
  showBuildTimeModal.value = false;
}



// 页面加载完成后初始化
loadConfig();
</script>

<template>
  <div class="setting-section">
    <h3 class="section-title">调试选项</h3>
    <div class="setting-card">
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-name">输出调试信息</div>
          <div class="setting-desc">在控制台输出调试信息</div>
        </div>
        <label class="toggle">
          <input type="checkbox" v-model="config.debugEnabled" @change="autoSaveConfig">
          <span class="toggle-slider"></span>
        </label>
      </div>
      
      <div class="setting-item">
        <div class="setting-info">
          <div class="setting-name">查看构建时间</div>
          <div class="setting-desc">查看当前程序包的构建时间</div>
        </div>
        <button class="btn-text" @click="openBuildTimeModal">查看</button>
      </div>
      

    </div>
  </div>
  
  <!-- 构建时间弹窗 -->
  <div v-if="showBuildTimeModal" class="modal-overlay" @click="closeBuildTimeModal">
    <div class="modal-content" @click.stop>
      <div class="modal-header">
        <span class="modal-icon">📦</span>
        <h3 class="modal-title">构建信息</h3>
      </div>
      <div class="modal-body">
        <div class="build-info">
          <div class="info-label">当前程序包构建时间</div>
          <div class="info-value">{{ BUILD_TIME }}</div>
        </div>
      </div>
      <div class="modal-footer">
        <button class="btn-confirm" @click="closeBuildTimeModal">确定</button>
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

/* Buttons */
.btn-text {
  padding: 8px 16px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  background-color: transparent;
  color: #1a1a1a;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-text:hover {
  border-color: #1a1a1a;
  background-color: #fafafa;
}

.btn-text.danger {
  color: #dc2626;
  border-color: #fee2e2;
}

.btn-text.danger:hover {
  background-color: #fee2e2;
  border-color: #dc2626;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #999;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 16px;
}

/* Modal Styles */
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
  border-radius: 16px;
  padding: 32px;
  width: 400px;
  max-width: 90%;
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
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 24px;
}

.modal-icon {
  font-size: 48px;
  margin-bottom: 12px;
}

.modal-title {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  margin: 0;
}

.modal-body {
  margin-bottom: 24px;
}

.build-info {
  background-color: #f8f9fa;
  border-radius: 12px;
  padding: 20px;
  text-align: center;
}

.info-label {
  font-size: 13px;
  color: #999;
  margin-bottom: 8px;
}

.info-value {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
  word-break: break-all;
}

.modal-footer {
  display: flex;
  justify-content: center;
}

.btn-confirm {
  padding: 10px 32px;
  border: none;
  border-radius: 8px;
  background-color: #32F08C;
  color: #fff;
  font-size: 14px;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-confirm:hover {
  background-color: #2ad87d;
  transform: translateY(-1px);
  box-shadow: 0 4px 12px rgba(50, 240, 140, 0.3);
}
</style>
