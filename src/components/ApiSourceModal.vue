<script setup>
import { ref, watch } from 'vue';

const props = defineProps({
  show: {
    type: Boolean,
    required: true
  },
  editingSource: {
    type: Object,
    required: true
  },
  isEdit: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['close', 'save', 'update:editingSource']);

// 创建本地副本
const localSource = ref({
  name: '',
  url: 'https://api.openai.com/v1',
  keys: [''],
  models: ['gpt-3.5-turbo'],
  enabled: true
});

// 当弹窗显示时，同步数据
watch(() => props.show, (newShow) => {
  if (newShow && props.editingSource) {
    localSource.value = {
      name: props.editingSource.name || '',
      url: props.editingSource.url || 'https://api.openai.com/v1',
      keys: Array.isArray(props.editingSource.keys) ? [...props.editingSource.keys] : [''],
      models: Array.isArray(props.editingSource.models) ? [...props.editingSource.models] : ['gpt-3.5-turbo'],
      enabled: props.editingSource.enabled !== false
    };
  }
}, { immediate: true });

function handleClose() {
  emit('close');
}

function handleSave() {
  // 将本地数据传回父组件
  emit('update:editingSource', localSource.value);
  emit('save');
}

function addKey() {
  localSource.value.keys.push('');
}

function removeKey(index) {
  localSource.value.keys.splice(index, 1);
}

function addModel() {
  localSource.value.models.push('');
}

function removeModel(index) {
  localSource.value.models.splice(index, 1);
}
</script>

<template>
  <div v-if="show" class="modal-overlay">
    <div class="modal">
      <div class="modal-header">
        <h3 class="modal-title">{{ isEdit ? '编辑 API 源' : '添加 API 源' }}</h3>
        <button class="modal-close" @click="handleClose">×</button>
      </div>
      <div class="modal-body">
        <div class="form-group">
          <label class="form-label">名称</label>
          <input v-model="localSource.name" class="form-input" placeholder="例如：OpenAI">
        </div>
        
        <div class="form-group">
          <label class="form-label">API 地址</label>
          <input v-model="localSource.url" class="form-input" placeholder="https://api.openai.com/v1">
        </div>
        
        <div class="form-group">
          <label class="form-label">
            API Keys
            <button class="btn-add-small" @click="addKey">+ 添加</button>
          </label>
          <div v-for="(key, index) in localSource.keys" :key="index" class="key-input-row">
            <input v-model="localSource.keys[index]" class="form-input" type="password" placeholder="sk-...">
            <button v-if="localSource.keys.length > 1" class="btn-remove" @click="removeKey(index)">×</button>
          </div>
        </div>
        
        <div class="form-group">
          <label class="form-label">
            模型列表
            <button class="btn-add-small" @click="addModel">+ 添加</button>
          </label>
          <div v-for="(model, index) in localSource.models" :key="index" class="key-input-row">
            <input v-model="localSource.models[index]" class="form-input" placeholder="gpt-3.5-turbo">
            <button v-if="localSource.models.length > 1" class="btn-remove" @click="removeModel(index)">×</button>
          </div>
        </div>
        
        <label class="form-checkbox">
          <input type="checkbox" v-model="localSource.enabled">
          <span>启用此 API 源</span>
        </label>
      </div>
      <div class="modal-footer">
        <button class="btn-text" @click="handleClose">取消</button>
        <button class="btn-primary" @click="handleSave">保存</button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0,0,0,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal {
  background-color: white;
  border-radius: 16px;
  width: 90%;
  max-width: 520px;
  max-height: 90vh;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #f0f0f0;
}

.modal-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
}

.modal-close {
  border: none;
  background: transparent;
  font-size: 24px;
  color: #999;
  cursor: pointer;
  padding: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 6px;
  transition: all 0.2s;
}

.modal-close:hover {
  background-color: #f0f0f0;
  color: #1a1a1a;
}

.modal-body {
  padding: 24px;
  overflow-y: auto;
  flex: 1;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 12px;
  padding: 16px 24px;
  border-top: 1px solid #f0f0f0;
}

/* Form */
.form-group {
  margin-bottom: 20px;
}

.form-label {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 14px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #e5e5e5;
  border-radius: 6px;
  font-size: 14px;
  background-color: #fafafa;
  transition: all 0.2s;
}

.form-input:focus {
  outline: none;
  border-color: #1a1a1a;
  background-color: #fff;
}

.key-input-row {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.key-input-row .form-input {
  flex: 1;
}

.btn-add-small {
  padding: 4px 10px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background-color: transparent;
  color: #666;
  font-size: 12px;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-add-small:hover {
  border-color: #1a1a1a;
  color: #1a1a1a;
}

.btn-remove {
  width: 36px;
  height: 36px;
  border: 1px solid #fee2e2;
  border-radius: 6px;
  background-color: transparent;
  color: #dc2626;
  font-size: 18px;
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-remove:hover {
  background-color: #fee2e2;
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 8px;
  font-size: 14px;
  color: #1a1a1a;
  cursor: pointer;
}

.form-checkbox input {
  width: 18px;
  height: 18px;
  cursor: pointer;
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

.btn-primary {
  padding: 10px 20px;
  border: none;
  border-radius: 6px;
  background-color: #1a1a1a;
  color: white;
  font-size: 14px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.btn-primary:hover {
  background-color: #333;
}
</style>
