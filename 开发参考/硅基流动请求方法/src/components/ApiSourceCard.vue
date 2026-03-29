<script setup>
const props = defineProps({
  source: {
    type: Object,
    required: true
  },
  index: {
    type: Number,
    required: true
  }
});

const emit = defineEmits(['edit', 'delete']);

function handleEdit() {
  emit('edit', props.index);
}

function handleDelete() {
  emit('delete', props.index);
}
</script>

<template>
  <div class="api-source-card" :class="{ disabled: !source.enabled }">
    <div class="source-header">
      <div class="source-info">
        <span class="source-name">{{ source.name }}</span>
        <span class="source-url">{{ source.url }}</span>
      </div>
      <label class="toggle small">
        <input type="checkbox" v-model="source.enabled">
        <span class="toggle-slider"></span>
      </label>
    </div>
    <div class="source-details">
      <div class="detail-item">
        <span class="detail-label">Keys:</span>
        <span class="detail-value">{{ source.keys.length }} 个</span>
      </div>
      <div class="detail-item">
        <span class="detail-label">Models:</span>
        <span class="detail-value">{{ source.models.join(', ') }}</span>
      </div>
    </div>
    <div class="source-actions">
      <button class="btn-text" @click="handleEdit">编辑</button>
      <button class="btn-text danger" @click="handleDelete">删除</button>
    </div>
  </div>
</template>

<style scoped>
.api-source-card {
  padding: 16px;
  background-color: #fafafa;
  border-radius: 12px;
  border: 1px solid #f0f0f0;
  transition: all 0.2s;
}

.api-source-card:hover {
  border-color: #e5e5e5;
}

.api-source-card.disabled {
  opacity: 0.6;
}

.source-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 12px;
}

.source-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.source-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.source-url {
  font-size: 12px;
  color: #999;
}

.source-details {
  display: flex;
  flex-direction: column;
  gap: 4px;
  margin-bottom: 12px;
}

.detail-item {
  display: flex;
  gap: 8px;
  font-size: 13px;
}

.detail-label {
  color: #999;
  min-width: 60px;
}

.detail-value {
  color: #666;
}

.source-actions {
  display: flex;
  gap: 8px;
}

/* Toggle Switch */
.toggle {
  position: relative;
  display: inline-block;
  width: 44px;
  height: 24px;
}

.toggle.small {
  width: 36px;
  height: 20px;
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

.toggle.small .toggle-slider:before {
  height: 14px;
  width: 14px;
  left: 3px;
  bottom: 3px;
}

input:checked + .toggle-slider {
  background-color: #32F08C;
}

input:checked + .toggle-slider:before {
  transform: translateX(20px);
}

.toggle.small input:checked + .toggle-slider:before {
  transform: translateX(16px);
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
</style>
