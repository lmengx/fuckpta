<script setup>
defineProps({
  activeTab: {
    type: String,
    required: true
  },
  statusMessage: {
    type: String,
    default: ''
  },
  statusType: {
    type: String,
    default: 'success'
  },
  showStatus: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['switch-tab']);

function switchTab(tab) {
  emit('switch-tab', tab);
}
</script>

<template>
  <div class="sidebar">
    <div class="logo">
      <span class="logo-text">PTA Helper</span>
    </div>
    
    <nav class="nav">
      <button 
        class="nav-item" 
        :class="{ active: activeTab === 'general' }"
        @click="switchTab('general')"
      >
        <span class="nav-icon">⚙️</span>
        <span class="nav-text">常规设置</span>
      </button>
      
      <button 
        class="nav-item" 
        :class="{ active: activeTab === 'ai' }"
        @click="switchTab('ai')"
      >
        <span class="nav-icon">🤖</span>
        <span class="nav-text">AI 设置</span>
      </button>
      
      <button 
        class="nav-item" 
        :class="{ active: activeTab === 'api' }"
        @click="switchTab('api')"
      >
        <span class="nav-icon">🔌</span>
        <span class="nav-text">API 源管理</span>
      </button>
      
      <button 
        class="nav-item" 
        :class="{ active: activeTab === 'data' }"
        @click="switchTab('data')"
      >
        <span class="nav-icon">💾</span>
        <span class="nav-text">数据管理</span>
      </button>
      
      <button 
        class="nav-item" 
        :class="{ active: activeTab === 'about' }"
        @click="switchTab('about')"
      >
        <span class="nav-icon">ℹ️</span>
        <span class="nav-text">关于</span>
      </button>
      
      <button 
        class="nav-item" 
        :class="{ active: activeTab === 'debug' }"
        @click="switchTab('debug')"
      >
        <span class="nav-icon">🐛</span>
        <span class="nav-text">调试设置</span>
      </button>
    </nav>
    
    <div class="status-bar" :class="{ show: showStatus, error: statusType === 'error' }">
      {{ statusMessage }}
    </div>
  </div>
</template>

<style scoped>
.sidebar {
  width: 240px;
  background-color: #fafafa;
  border-right: 1px solid #f0f0f0;
  display: flex;
  flex-direction: column;
  padding: 24px 0;
}

.logo {
  padding: 0 24px 32px;
  border-bottom: 1px solid #f0f0f0;
  margin-bottom: 16px;
}

.logo-text {
  font-size: 20px;
  font-weight: 600;
  color: #1a1a1a;
  letter-spacing: -0.5px;
}

.nav {
  flex: 1;
  padding: 0 12px;
}

.nav-item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 12px 16px;
  margin-bottom: 4px;
  border: none;
  background: transparent;
  border-radius: 8px;
  cursor: pointer;
  transition: all 0.2s;
  color: #666;
  font-size: 14px;
}

.nav-item:hover {
  background-color: #f0f0f0;
  color: #1a1a1a;
}

.nav-item.active {
  color: #1a1a1a;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  border-radius: 8px;
  background-color: #ffffff;
}

.nav-icon {
  font-size: 18px;
  width: 24px;
  text-align: center;
}

.nav-text {
  font-weight: 500;
}

.status-bar {
  margin: 16px 12px 0;
  padding: 12px 16px;
  border-radius: 8px;
  font-size: 13px;
  text-align: center;
  opacity: 0;
  transition: opacity 0.3s;
  background-color: #f0f0f0;
  color: #1a1a1a;
}

.status-bar.show {
  opacity: 1;
}

.status-bar.error {
  background-color: #fee2e2;
  color: #dc2626;
}
</style>
