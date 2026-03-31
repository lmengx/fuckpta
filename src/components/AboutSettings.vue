<script setup>
import { ref, onMounted } from 'vue';
import { PLUGIN_CONFIG, checkForUpdates } from '../config.js';

// 插件信息页面组件
const showPycatchModal = ref(false);
const updateInfo = ref({
  hasUpdate: false,
  currentVersion: PLUGIN_CONFIG.version,
  latestVersion: null,
  source: null,
  error: null,
  checking: true
});

function openPycatchModal() {
  showPycatchModal.value = true;
}

function closePycatchModal() {
  showPycatchModal.value = false;
}

// 打开更新链接
function openUpdateLink() {
  const url = updateInfo.value.source === 'gitee' 
    ? PLUGIN_CONFIG.giteeRepo 
    : PLUGIN_CONFIG.githubRepo;
  window.open(url, '_blank');
}

// 页面加载完成后初始化
onMounted(async () => {
  // 监听打开PyCatch模态框的事件
  window.addEventListener('openPycatchModal', () => {
    showPycatchModal.value = true;
  });
  
  // 检查更新
  const result = await checkForUpdates();
  updateInfo.value = {
    ...result,
    checking: false
  };
});
</script>

<template>
  <div class="about-content">
    <!-- 插件信息 -->
    <div class="section">
      <h3 class="section-title">插件信息</h3>
      <div class="section-content">
        <p>PTA 答题辅助是一个帮助用户在 PTA 平台上更高效完成编程题目的 Chrome 扩展。</p>
        <p>当前版本: {{ updateInfo.currentVersion }}</p>
        <div class="update-status">
          <span v-if="updateInfo.checking" class="checking">正在检查更新...</span>
          <span v-else-if="updateInfo.error" class="error">{{ updateInfo.error }}</span>
          <span v-else-if="updateInfo.hasUpdate" class="has-update">
            发现新版本: {{ updateInfo.latestVersion }}
            <button class="update-btn" @click="openUpdateLink">立即更新</button>
          </span>
          <span v-else class="no-update">已是最新版本</span>
        </div>
      </div>
    </div>
    
    <!-- 使用方法 FAQ -->
    <div class="section">
      <h3 class="section-title">使用方法 FAQ</h3>
      <div class="section-content">
        <div class="faq-item">
          <h4 class="faq-question">如何绕过粘贴限制?</h4>
          <p class="faq-answer">启用常规设置--自动弹出浮动窗口,在题目详情页面弹出的窗口中粘贴代码,直接提交,就可以绕过粘贴限制。</p>
        </div>

        <div class="faq-item">
          <h4 class="faq-question">如何启用 AI 答题功能?</h4>
          <p class="faq-answer">在 "AI 设置" 页面中，启用 AI 答题功能，并配置有效的 API 密钥和模型。AI模型可用后会自动一键完成题目,填入悬浮窗口。</p>
        </div>

        <div class="faq-item">
          <h4 class="faq-question">推荐的AI平台?</h4>
          <p class="faq-answer">推荐使用 <a href="https://cloud.siliconflow.cn" target="_blank">硅基流动</a> 和 <a href="https://bailian.aliyun.com" target="_blank">阿里云百炼</a>，平台免费，本插件适配，调用最快，直接点击链接去官网创建API Key粘贴到api源设置中即可。</p>
        </div>

        <div class="faq-item">
          <h4 class="faq-question">如何使用纠错功能?</h4>
          <p class="faq-answer">在提交结果页面，点击 "获取答案" 按钮，系统会分析错误并生成修正后的代码。</p>
        </div>

        <div class="faq-item">
          <h4 class="faq-question">如何在本插件没有适配接口时提交代码?</h4>
          <p class="faq-answer">您可以使用作者开发的 PyCatch 抓包替换工具，用于在本插件没有适配接口时提交代码。<span class="color-link" @click="openPycatchModal">使用说明</span></p>
        </div>
      </div>
    </div>
    
    <!-- 开发者信息 -->
    <div class="section">
      <h3 class="section-title">开发者信息</h3>
      <div class="section-content">
        <p><strong>作者:</strong> lmengx</p>
        <p><strong>开源地址:</strong> <a href="https://github.com/lmengx/fuckpta" target="_blank">https://github.com/lmengx/fuckpta</a></p>
        <p><strong>开源协议:</strong> MIT</p>
      </div>
    </div>
    
    <!-- PyCatch 工具使用说明弹窗 -->
    <div v-if="showPycatchModal" class="modal-overlay" @click="closePycatchModal">
      <div class="modal-content" @click.stop>
        <div class="modal-header">
          <h3 class="modal-title">PyCatch 工具使用说明</h3>
        </div>
        <div class="modal-body">
          <div class="pycatch-info">
            <p>PyCatch 是一个抓包替换工具，用于在本插件没有适配接口时提交代码。</p>
            
            <h4>使用方法</h4>
            <p>1. 下载并安装 PyCatch 工具，按照提示安装证书并重启浏览器。</p>
            <p>2. 运行 PyCatch，在 "抓包网页" 输入框中输入 "pintia.cn"，然后点击 "开始抓包"。</p>
            <p>3. 在 "替换内容" 文本框中输入 AI 生成的代码。</p>
            <p>4. 在 PTA 网站的代码编辑框中输入 "{ans content}"，然后点击提交按钮。</p>
            <p>5. PyCatch 会自动捕获请求并将 "{ans content}" 替换为您输入的代码，完成提交。</p>
            
            <p>开源地址：<a href="https://gitee.com/lmx12330/pycatch" target="_blank">https://gitee.com/lmx12330/pycatch</a></p>
          </div>
        </div>
        <div class="modal-footer">
          <button class="btn-confirm" @click="closePycatchModal">确定</button>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.about-content {
  display: flex;
  flex-direction: column;
  gap: 32px;
}

.section {
  background-color: #fafafa;
  border-radius: 12px;
  padding: 24px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.05);
}

.section-title {
  font-size: 18px;
  font-weight: 600;
  color: #1a1a1a;
  margin-bottom: 16px;
}

.section-content {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

.faq-item {
  margin-bottom: 16px;
  padding-bottom: 16px;
  border-bottom: 1px solid #f0f0f0;
}

.faq-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.faq-question {
  font-size: 15px;
  font-weight: 500;
  color: #1a1a1a;
  margin-bottom: 8px;
}

.faq-answer {
  color: #666;
  margin: 0;
}

a {
  color: #32F08C;
  text-decoration: none;
  transition: color 0.2s;
}

a:hover {
  color: #2ad87d;
  text-decoration: underline;
}

.color-link {
  color: #32F08C;
  cursor: pointer;
  text-decoration: underline;
  transition: color 0.2s;
}

.color-link:hover {
  color: #2ad87d;
}

/* 更新状态样式 */
.update-status {
  margin-top: 12px;
  padding: 10px 16px;
  border-radius: 8px;
  font-size: 14px;
}

.update-status .checking {
  color: #666;
}

.update-status .error {
  color: #ff4d4f;
}

.update-status .has-update {
  color: #ff4d4f;
  font-weight: 500;
  display: flex;
  align-items: center;
  gap: 12px;
}

.update-status .no-update {
  color: #32F08C;
}

.update-btn {
  padding: 6px 16px;
  border: none;
  border-radius: 6px;
  background-color: #ff4d4f;
  color: #fff;
  font-size: 13px;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s;
}

.update-btn:hover {
  background-color: #ff7875;
  transform: translateY(-1px);
  box-shadow: 0 2px 8px rgba(255, 77, 79, 0.3);
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
  width: 800px;
  max-width: 90%;
  max-height: 80vh;
  overflow-y: auto;
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
  margin-bottom: 24px;
  border-bottom: 1px solid #f0f0f0;
  padding-bottom: 16px;
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

.pycatch-info {
  font-size: 14px;
  line-height: 1.6;
  color: #666;
}

.pycatch-info h4 {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a1a;
  margin-top: 24px;
  margin-bottom: 12px;
}

.pycatch-info p {
  margin-bottom: 12px;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  border-top: 1px solid #f0f0f0;
  padding-top: 16px;
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