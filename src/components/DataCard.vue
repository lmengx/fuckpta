<script setup>
defineProps({
  icon: {
    type: String,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  desc: {
    type: String,
    required: true
  },
  type: {
    type: String,
    default: '' // warning, danger
  }
});

const emit = defineEmits(['click']);

function handleClick() {
  emit('click');
}
</script>

<template>
  <div class="data-card" :class="type" @click="handleClick">
    <span class="data-icon">{{ icon }}</span>
    <span class="data-name">{{ name }}</span>
    <span class="data-desc">{{ desc }}</span>
  </div>
</template>

<style scoped>
.data-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
  border: 1px solid #f0f0f0;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.2s;
  background-color: #fafafa;
}

.data-card:hover {
  border-color: #1a1a1a;
  background-color: #fff;
  transform: translateY(-2px);
}

.data-card.warning:hover {
  border-color: #f59e0b;
  background-color: #fffbeb;
}

.data-card.danger:hover {
  border-color: #dc2626;
  background-color: #fef2f2;
}

.data-icon {
  font-size: 32px;
  margin-bottom: 4px;
}

.data-name {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a1a;
}

.data-desc {
  font-size: 12px;
  color: #999;
  text-align: center;
}
</style>
