<script setup>
import { ref, computed, onMounted } from 'vue';
import Sidebar from './components/Sidebar.vue';
import GeneralSettings from './components/GeneralSettings.vue';
import AISettings from './components/AISettings.vue';
import ApiSourceManagement from './components/ApiSourceManagement.vue';
import DebugSettings from './components/DebugSettings.vue';
import DataManagement from './components/DataManagement.vue';

// 当前选中的选项卡
const activeTab = ref('general');

// 状态提示
const statusMessage = ref('');
const statusType = ref('success');
const showStatus = ref(false);

// 调试模式状态
const debugMode = ref(false);

// 是否显示调试选项卡
const showDebugTab = computed(() => debugMode.value);

// 显示状态消息
function showMessage(message, type = 'success') {
  statusMessage.value = message;
  statusType.value = type;
  showStatus.value = true;
  setTimeout(() => {
    showStatus.value = false;
  }, 2000);
}

// 加载调试模式状态
function loadDebugMode() {
  chrome.storage.local.get(['debugMode'], (result) => {
    debugMode.value = result.debugMode || false;
  });
}

// 切换选项卡
function switchTab(tab) {
  activeTab.value = tab;
}

// 页面加载完成后初始化
onMounted(() => {
  loadDebugMode();
});
</script>

<template>
  <div class="container">
    <!-- 左侧导航 -->
    <Sidebar 
      :active-tab="activeTab"
      :show-debug-tab="showDebugTab"
      :status-message="statusMessage"
      :status-type="statusType"
      :show-status="showStatus"
      @switch-tab="switchTab"
    />
    
    <!-- 右侧内容区 -->
    <div class="main">
      <!-- 常规设置 -->
      <div v-show="activeTab === 'general'" class="panel">
        <h2 class="panel-title">常规设置</h2>
        <GeneralSettings />
      </div>
      
      <!-- AI 设置 -->
      <div v-show="activeTab === 'ai'" class="panel">
        <h2 class="panel-title">AI 设置</h2>
        <AISettings />
      </div>
      
      <!-- API 源管理 -->
      <div v-show="activeTab === 'api'" class="panel panel-full">
        <ApiSourceManagement />
      </div>
      
      <!-- 调试设置 -->
      <div v-show="activeTab === 'debug' && showDebugTab" class="panel">
        <h2 class="panel-title">调试设置</h2>
        <DebugSettings />
      </div>
      
      <!-- 数据管理 -->
      <div v-show="activeTab === 'data'" class="panel">
        <h2 class="panel-title">数据管理</h2>
        <DataManagement />
      </div>
    </div>
  </div>
</template>

<style scoped>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  display: flex;
  height: 100vh;
  background-color: #ffffff;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
  overflow: hidden;
}

.main {
  flex: 1;
  padding: 48px 64px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.panel {
  max-width: 720px;
  width: 100%;
  height: 100%;
  overflow-y: auto;
  scrollbar-width: none;
  -ms-overflow-style: none;
}

.panel::-webkit-scrollbar {
  display: none;
}

.panel-full {
  max-width: none;
  padding: 0;
}

.panel-title {
  font-size: 28px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 32px;
  letter-spacing: -0.5px;
  flex-shrink: 0;
}
</style>
