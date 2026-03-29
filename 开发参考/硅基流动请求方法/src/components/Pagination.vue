<script setup>
defineProps({
  total: {
    type: Number,
    required: true
  },
  pageSize: {
    type: Number,
    default: 10
  },
  currentPage: {
    type: Number,
    default: 1
  }
});

const emit = defineEmits(['page-change']);

function changePage(page) {
  emit('page-change', page);
}

function getTotalPages(total, pageSize) {
  return Math.ceil(total / pageSize);
}

function getPageRange(currentPage, totalPages) {
  const range = [];
  const showPages = 5;
  let start = Math.max(1, currentPage - Math.floor(showPages / 2));
  let end = Math.min(totalPages, start + showPages - 1);
  
  if (end - start + 1 < showPages) {
    start = Math.max(1, end - showPages + 1);
  }
  
  for (let i = start; i <= end; i++) {
    range.push(i);
  }
  
  return range;
}
</script>

<template>
  <div class="pagination">
    <button 
      class="page-btn" 
      @click="changePage(1)" 
      :disabled="currentPage === 1"
    >
      首页
    </button>
    <button 
      class="page-btn" 
      @click="changePage(currentPage - 1)" 
      :disabled="currentPage === 1"
    >
      上一页
    </button>
    
    <span 
      v-for="page in getPageRange(currentPage, getTotalPages(total, pageSize))" 
      :key="page"
      class="page-item"
      :class="{ active: page === currentPage }"
      @click="changePage(page)"
    >
      {{ page }}
    </span>
    
    <button 
      class="page-btn" 
      @click="changePage(currentPage + 1)" 
      :disabled="currentPage === getTotalPages(total, pageSize)"
    >
      下一页
    </button>
    <button 
      class="page-btn" 
      @click="changePage(getTotalPages(total, pageSize))" 
      :disabled="currentPage === getTotalPages(total, pageSize)"
    >
      末页
    </button>
    
    <span class="page-info">
      共 {{ getTotalPages(total, pageSize) }} 页
    </span>
  </div>
</template>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 16px 0;
  border-top: 1px solid #f5f5f5;
}

.page-btn {
  padding: 6px 12px;
  border: 1px solid #e5e5e5;
  border-radius: 4px;
  background-color: #fff;
  color: #1a1a1a;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-btn:hover:not(:disabled) {
  border-color: #1a1a1a;
  background-color: #fafafa;
}

.page-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.page-item {
  padding: 6px 10px;
  border-radius: 4px;
  font-size: 13px;
  cursor: pointer;
  transition: all 0.2s;
}

.page-item:hover {
  background-color: #f5f5f5;
}

.page-item.active {
  background-color: #1a1a1a;
  color: #fff;
}

.page-info {
  font-size: 13px;
  color: #999;
  margin-left: 12px;
}
</style>