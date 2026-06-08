// 显示PrimeVue风格的确认对话框
function showConfirmDialog(options) {
  // 创建对话框容器
  const dialogContainer = document.createElement('div');
  dialogContainer.id = 'pta-confirm-dialog';
  dialogContainer.style.position = 'fixed';
  dialogContainer.style.top = '0';
  dialogContainer.style.left = '0';
  dialogContainer.style.width = '100%';
  dialogContainer.style.height = '100%';
  dialogContainer.style.background = 'rgba(0, 0, 0, 0.5)';
  dialogContainer.style.display = 'flex';
  dialogContainer.style.justifyContent = 'center';
  dialogContainer.style.alignItems = 'center';
  dialogContainer.style.zIndex = '999999';
  dialogContainer.style.backdropFilter = 'blur(2px)';
  
  // 创建对话框内容
  const dialogContent = document.createElement('div');
  dialogContent.style.background = 'white';
  dialogContent.style.borderRadius = '6px';
  dialogContent.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
  dialogContent.style.width = '400px';
  dialogContent.style.maxWidth = '90%';
  dialogContent.style.overflow = 'hidden';
  
  // 对话框头部
  const dialogHeader = document.createElement('div');
  dialogHeader.style.padding = '16px';
  dialogHeader.style.borderBottom = '1px solid #e0e0e0';
  dialogHeader.style.display = 'flex';
  dialogHeader.style.justifyContent = 'space-between';
  dialogHeader.style.alignItems = 'center';
  
  const headerTitle = document.createElement('div');
  headerTitle.style.fontSize = '16px';
  headerTitle.style.fontWeight = 'bold';
  headerTitle.style.color = '#333';
  headerTitle.textContent = options.header || '确认';
  
  const closeBtn = document.createElement('button');
  closeBtn.style.background = 'none';
  closeBtn.style.border = 'none';
  closeBtn.style.fontSize = '20px';
  closeBtn.style.cursor = 'pointer';
  closeBtn.style.color = '#666';
  closeBtn.textContent = '×';
  closeBtn.addEventListener('click', () => {
    if (options.reject) {
      options.reject();
    }
    document.body.removeChild(dialogContainer);
  });
  
  dialogHeader.appendChild(headerTitle);
  dialogHeader.appendChild(closeBtn);
  
  // 对话框内容
  const dialogBody = document.createElement('div');
  dialogBody.style.padding = '20px';
  
  const messageDiv = document.createElement('div');
  messageDiv.style.fontSize = '14px';
  messageDiv.style.color = '#333';
  messageDiv.style.lineHeight = '1.5';
  messageDiv.textContent = options.message;
  
  dialogBody.appendChild(messageDiv);
  
  // 对话框底部
  const dialogFooter = document.createElement('div');
  dialogFooter.style.padding = '16px';
  dialogFooter.style.borderTop = '1px solid #e0e0e0';
  dialogFooter.style.display = 'flex';
  dialogFooter.style.justifyContent = 'flex-end';
  dialogFooter.style.gap = '10px';
  
  // 取消按钮
  const cancelBtn = document.createElement('button');
  cancelBtn.style.padding = '8px 16px';
  cancelBtn.style.border = '1px solid #ddd';
  cancelBtn.style.borderRadius = '4px';
  cancelBtn.style.background = 'white';
  cancelBtn.style.color = '#333';
  cancelBtn.style.cursor = 'pointer';
  cancelBtn.style.fontSize = '14px';
  cancelBtn.textContent = '取消';
  cancelBtn.addEventListener('click', () => {
    if (options.reject) {
      options.reject();
    }
    document.body.removeChild(dialogContainer);
  });
  
  // 确认按钮
  const confirmBtn = document.createElement('button');
  confirmBtn.style.padding = '8px 16px';
  confirmBtn.style.border = 'none';
  confirmBtn.style.borderRadius = '4px';
  confirmBtn.style.background = '#4CAF50';
  confirmBtn.style.color = 'white';
  confirmBtn.style.cursor = 'pointer';
  confirmBtn.style.fontSize = '14px';
  confirmBtn.textContent = '确认';
  confirmBtn.addEventListener('click', () => {
    // 立即移除对话框
    document.body.removeChild(dialogContainer);
    // 异步执行 accept 函数
    if (options.accept) {
      options.accept();
    }
  });
  
  dialogFooter.appendChild(cancelBtn);
  dialogFooter.appendChild(confirmBtn);
  
  // 组装对话框
  dialogContent.appendChild(dialogHeader);
  dialogContent.appendChild(dialogBody);
  dialogContent.appendChild(dialogFooter);
  dialogContainer.appendChild(dialogContent);
  
  // 添加到页面
  document.body.appendChild(dialogContainer);
  
  // 点击背景关闭
  dialogContainer.addEventListener('click', (e) => {
    if (e.target === dialogContainer) {
      if (options.reject) {
        options.reject();
      }
      document.body.removeChild(dialogContainer);
    }
  });
}

// 显示Toast提示
function showToast(message, severity = 'info') {
  // 创建Toast容器
  let toastContainer = document.getElementById('pta-toast-container');
  if (!toastContainer) {
    toastContainer = document.createElement('div');
    toastContainer.id = 'pta-toast-container';
    toastContainer.style.position = 'fixed';
    toastContainer.style.top = '20px';
    toastContainer.style.right = '20px';
    toastContainer.style.zIndex = '999999';
    toastContainer.style.display = 'flex';
    toastContainer.style.flexDirection = 'column';
    toastContainer.style.gap = '10px';
    document.body.appendChild(toastContainer);
  }
  
  // 创建Toast元素
  const toast = document.createElement('div');
  toast.style.padding = '12px 16px';
  toast.style.borderRadius = '4px';
  toast.style.color = 'white';
  toast.style.fontSize = '14px';
  toast.style.fontWeight = '500';
  toast.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)';
  toast.style.transition = 'all 0.3s ease';
  toast.style.opacity = '0';
  toast.style.transform = 'translateX(100%)';
  
  // 根据严重程度设置不同的背景色
  switch (severity) {
    case 'success':
      toast.style.backgroundColor = '#4CAF50';
      break;
    case 'error':
      toast.style.backgroundColor = '#f44336';
      break;
    case 'warning':
      toast.style.backgroundColor = '#ff9800';
      break;
    default:
      toast.style.backgroundColor = '#2196F3';
  }
  
  toast.textContent = message;
  toastContainer.appendChild(toast);
  
  // 显示动画
  setTimeout(() => {
    toast.style.opacity = '1';
    toast.style.transform = 'translateX(0)';
  }, 10);
  
  // 3秒后自动消失
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateX(100%)';
    setTimeout(() => {
      if (toast.parentNode) {
        toast.parentNode.removeChild(toast);
      }
    }, 300);
  }, 3000);
}

// 调试日志函数
function debugLog(message, data = null) {
  getConfig(function(config) {
    if (config.debugMode && config.debugEnabled) {
      console.log('[PTA 答题辅助] ' + message, data);
    }
  });
}

// 默认配置
const defaultConfig = {
  autoPopup: true,
  language: 'c',
  aiEnabled: false,
  aiApiKey: '',
  aiApiUrl: 'https://api.openai.com/v1',
  aiModel: 'gpt-3.5-turbo',
  debugMode: false,
  debugEnabled: false,
  showBuildTime: false,
  extractDelay: 2000,
  // 模型选择模式: 'manual' 手动选择, 'random' 随机选择
  modelSelectMode: 'random',
  // 手动选择的模型ID
  selectedModelId: '',
  // API 源列表
  apiSources: [],
  aiSystemPrompt: `你是专业的编程题 AC 生成器。
语言：{language}

请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。
严格遵守格式：换行、空格、缩进必须完全符合题目要求。

以下是题目内容：
{problem content}`,
  aiErrorPrompt: `你是专业的编程题 AC 生成器。
语言：{language}
错误类型：{error_type}
编译器提示：{compiler_msg}
测试点提示提示：{data_tip}

请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。
严格遵守格式：换行、空格、缩进必须完全符合题目要求。
题目如下：
{problem content}
错误源码如下：
{res_code}`,
  choiceBatchSize: 20,
  choicePrompt: `你是一个专业的AI做题工具
请直接输出**符合格式的JSON**，不要解释、不要说明、不要多余内容。

格式如下
[
  "A",
  "B"
]

以下是题目内容：
{problem content}`
};

// 获取所有已启用的模型列表
function getEnabledModels(apiSources) {
  const models = [];
  if (!Array.isArray(apiSources)) return models;
  apiSources.forEach(source => {
    if (source.enabled) {
      source.models.forEach(model => {
        models.push({
          id: model,
          sourceName: source.name,
          sourceUrl: source.url,
          sourceKeys: source.keys
        });
      });
    }
  });
  return models;
}

// 获取当前可用的 API 配置（用于实际调用）
function getActiveApiConfig(config) {
  // 如果存在旧的配置，优先使用旧的配置（向后兼容）
  if (config.aiApiKey) {
    // 直接使用配置中的 URL，不添加额外后缀
    let url = config.aiApiUrl || 'https://api.openai.com/v1';
    return {
      url: url,
      key: config.aiApiKey,
      model: config.aiModel || 'gpt-3.5-turbo'
    };
  }
  
  // 使用新的 apiSources 配置
  // 确保 apiSources 是数组
  const apiSources = Array.isArray(config.apiSources) ? config.apiSources : [];
  const enabledSources = apiSources.filter(s => s.enabled);
  if (enabledSources.length === 0) return null;
  
  // 获取所有已启用的模型
  const enabledModels = getEnabledModels(apiSources);
  if (enabledModels.length === 0) return null;
  
  let selectedModel;
  let selectedSource;
  
  if (config.modelSelectMode === 'manual' && config.selectedModelId) {
    // 手动选择模式
    selectedModel = enabledModels.find(m => m.id === config.selectedModelId);
    if (!selectedModel) {
      // 如果手动选择的模型不可用，随机选择一个
      selectedModel = enabledModels[Math.floor(Math.random() * enabledModels.length)];
    }
  } else {
    // 随机选择模式
    selectedModel = enabledModels[Math.floor(Math.random() * enabledModels.length)];
  }
  
  // 找到对应的源
  selectedSource = enabledSources.find(s => s.models.includes(selectedModel.id));
  
  if (!selectedSource || !selectedModel) return null;
  
  // 直接使用配置中的 URL，不添加额外后缀
  let url = selectedSource.url;
  
  return {
    url: url,
    key: selectedSource.keys[Math.floor(Math.random() * selectedSource.keys.length)],
    model: selectedModel.id
  };
}

// 存储当前题目文本、提交结果数据和 AI 对话历史
let currentProblemText = '';
window.currentSubmissionData = null;
let aiConversationHistory = [];

// 获取配置（合并默认配置和用户配置）
function getConfig(callback) {
  try {
    chrome.storage.local.get(Object.keys(defaultConfig), function(result) {
      try {
        const config = { ...defaultConfig, ...result };
        
        // 检查是否有配置项缺失，如果有则写入默认值
        let hasMissingConfig = false;
        for (const key in defaultConfig) {
          if (!(key in result)) {
            hasMissingConfig = true;
            break;
          }
        }
        
        if (hasMissingConfig) {
          // 写入默认配置
          chrome.storage.local.set(config, function() {
            console.log('配置已更新为默认值');
          });
        }
        
        callback(config);
      } catch (error) {
        console.warn('处理配置时出错:', error);
        callback(defaultConfig);
      }
    });
  } catch (error) {
    console.warn('获取配置时出错:', error);
    callback(defaultConfig);
  }
}

// 检查是否需要自动弹出浮动窗口
function checkAutoPopup() {
  getConfig(function(config) {
    if (config.autoPopup) {
      const isProgrammingList = isProgrammingListPage();
      const isProgrammingDetail = isProgrammingDetailPage();
      const isChoice = isChoiceQuestionPage();
      const isSubmission = isSubmissionResultPage();

      if (isChoice) {
        removeFloatingWindow();
        createFloatingWindow();
        setTimeout(() => {
          fetchChoiceQuestions();
        }, 100);
      } else if (isProgrammingList) {
        removeFloatingWindow();
        createFloatingWindow();
        setTimeout(() => {
          fetchProblemList();
        }, 100);
      } else if (isProgrammingDetail) {
        removeFloatingWindow();
        createFloatingWindow();
        setTimeout(() => {
          extractProblemTextWithDelay();
        }, 100);
      } else if (isSubmission) {
        extractSubmissionResultWithDelay();
      } else {
        removeFloatingWindow();
      }
    } else {
      removeFloatingWindow();
    }
  });
}

// 延迟提取题目文本（固定10ms延迟）
function extractProblemTextWithDelay() {
  setTimeout(async () => {
    await extractProblemText();
  }, 10);
}

// 延迟提取提交结果页面内容（固定10ms延迟）
function extractSubmissionResultWithDelay() {
  setTimeout(async () => {
    await extractSubmissionResult();
  }, 10);
}

// FUCKPTA retry wrapper
async function pintiaFetch(url, options = {}, retries = 3) {
  const baseDelay = 1000;
  for (let attempt = 0; attempt <= retries; attempt++) {
    let resp;
    try {
      resp = await fetch(url, options);
    } catch (e) {
      if (attempt < retries) {
        const delay = baseDelay * (2 ** attempt) + Math.random() * 1000;
        await new Promise(r => setTimeout(r, delay));
        continue;
      }
      throw e;
    }
    if (resp.ok) return resp;
    // 429 或 5xx 服务器错误 → 重试
    if ((resp.status === 429 || resp.status >= 500) && attempt < retries) {
      const delay = baseDelay * (2 ** attempt) + Math.random() * 1000;
      await new Promise(r => setTimeout(r, delay));
      continue;
    }
    return resp;
  }
}

// 获取 exam ID
async function getExamId(problemSetId) {
  const resp = await pintiaFetch(`https://pintia.cn/api/problem-sets/${problemSetId}/exams`, {
    headers: {
      'accept': 'application/json;charset=UTF-8',
      'content-type': 'application/json;charset=UTF-8',
      'x-lollipop': getLollipop(),
      'x-marshmallow': ''
    },
    method: 'GET',
    credentials: 'include'
  });
  if (!resp.ok) return null;
  const data = await resp.json();
  return data?.exam?.id || null;
}

// 检查是否是编程题/函数题详情页（/type/7 或 /type/6 含 problemSetProblemId）
function isProgrammingDetailPage() {
  const url = window.location.href;
  return /\/problem-sets\/.+\/exam\/problems\/type\/[67]/.test(url) && 
         /problemSetProblemId=\d+/.test(url);
}

// 检查是否是编程题/函数题列表页（/type/7 或 /type/6 不含 problemSetProblemId）
function isProgrammingListPage() {
  const url = window.location.href;
  return /\/problem-sets\/.+\/exam\/problems\/type\/[67](?:\?.*)?$/.test(url) &&
         !/problemSetProblemId=\d+/.test(url);
}

// 获取当前题目的类型：PROGRAMMING 或 CODE_COMPLETION
function getProblemType() {
  const url = window.location.href;
  if (/\/type\/7/.test(url)) return 'PROGRAMMING';
  if (/\/type\/6/.test(url)) return 'CODE_COMPLETION';
  return 'PROGRAMMING';
}

// 检查是否是选择题页面（/type/2）
function isChoiceQuestionPage() {
  const url = window.location.href;
  return /\/problem-sets\/.+\/exam\/problems\/type\/2/.test(url);
}

// 检查是否是提交结果页面
function isSubmissionResultPage() {
  const url = window.location.href;
  return url.includes('/problem-sets/') && url.includes('/exam/submissions/');
}

// 获取题目列表
async function fetchProblemList() {
  if (!isProgrammingListPage()) {
    return;
  }

  const problemListContainer = document.getElementById('pta-problem-list');
  const statusDiv = document.getElementById('pta-problem-list-status');
  if (!problemListContainer) {
    return;
  }

  try {
    const url = window.location.href;

    // 从URL中提取problemSetId
    const problemSetMatch = url.match(/\/problem-sets\/(\d+)/);
    if (!problemSetMatch) {
      showToast('无法从URL中提取problemSetId', 'error');
      problemListContainer.innerHTML = '<div class="problem-item"><span class="problem-index">错误</span><span class="problem-title">无法获取题目列表</span></div>';
      return;
    }
    const problemSetId = problemSetMatch[1];

    // 获取examId
    const examId = await getExamId(problemSetId);
    if (!examId) {
      showToast('无法获取examId', 'error');
      problemListContainer.innerHTML = '<div class="problem-item"><span class="problem-index">错误</span><span class="problem-title">无法获取examId</span></div>';
      return;
    }

    // 获取题目状态
    let statusMap = {};
    try {
      const statusResponse = await pintiaFetch(
        `https://pintia.cn/api/exams/${examId}/problem-sets/${problemSetId}/problem-status`,
        {
          headers: {
            accept: 'application/json;charset=UTF-8',
            'content-type': 'application/json;charset=UTF-8',
            'x-lollipop': getLollipop(),
            'x-marshmallow': ''
          },
          method: 'GET',
          credentials: 'include'
        }
      );
      if (statusResponse.ok) {
        const statusData = await statusResponse.json();
        (statusData.problemStatus || []).forEach(s => {
          statusMap[s.id] = s.problemSubmissionStatus;
        });
      }
    } catch (e) { /* 静默失败 */ }

    // 获取题目列表（自动翻页）
    const problemType = getProblemType();
    const PAGE_SIZE = 200;
    const firstResponse = await pintiaFetch(
      `https://pintia.cn/api/problem-sets/${problemSetId}/exam-problem-list?exam_id=${examId}&problem_type=${problemType}&page=0&limit=${PAGE_SIZE}`,
      {
        headers: {
          accept: 'application/json;charset=UTF-8',
          'content-type': 'application/json;charset=UTF-8',
          'x-lollipop': getLollipop(),
          'x-marshmallow': ''
        },
        method: 'GET',
        credentials: 'include'
      }
    );

    if (!firstResponse.ok) {
      showToast(`获取题目列表失败: ${firstResponse.status}`, 'error');
      problemListContainer.innerHTML = '<div class="problem-item"><span class="problem-index">错误</span><span class="problem-title">获取题目列表失败</span></div>';
      return;
    }

    const firstData = await firstResponse.json();
    let allProblems = firstData.problemSetProblems || [];
    let allLabels = firstData.examLabelByProblemSetProblemId || {};
    const total = firstData.total || allProblems.length;

    // 翻页获取剩余题目
    if (total > PAGE_SIZE) {
      const totalPages = Math.ceil(total / PAGE_SIZE);
      const pagePromises = [];
      for (let p = 1; p < totalPages; p++) {
        pagePromises.push(pintiaFetch(
          `https://pintia.cn/api/problem-sets/${problemSetId}/exam-problem-list?exam_id=${examId}&problem_type=${problemType}&page=${p}&limit=${PAGE_SIZE}`,
          {
            headers: {
              accept: 'application/json;charset=UTF-8',
              'content-type': 'application/json;charset=UTF-8',
              'x-lollipop': getLollipop(),
              'x-marshmallow': ''
            },
            method: 'GET',
            credentials: 'include'
          }
        ).then(r => r.ok ? r.json() : null));
      }
      const extraPages = await Promise.all(pagePromises);
      extraPages.forEach(data => {
        if (data) {
          if (data.problemSetProblems) allProblems = allProblems.concat(data.problemSetProblems);
          if (data.examLabelByProblemSetProblemId) Object.assign(allLabels, data.examLabelByProblemSetProblemId);
        }
      });
    }

    // 获取题目序号映射
    const examLabelMap = allLabels;

    // 提取题目ID和名字并输出到console，同时渲染到浮动窗口
    if (allProblems.length > 0) {
      const statusText = {
        'PROBLEM_ACCEPTED': '已通过',
        'PROBLEM_NO_ANSWER': '未尝试'
      };

      let acceptedCount = 0;
      let html = '';
      allProblems.forEach((problem, index) => {
        const label = examLabelMap[problem.id] || `${index + 1}`;
        const ps = statusMap[problem.id] || '';
        let badge = '';
        if (ps === 'PROBLEM_ACCEPTED') {
          badge = `<span class="problem-status" style="background:#e8f5e9;color:#32F08C;font-size:11px;padding:2px 8px;border-radius:4px;margin-left:8px;">${statusText[ps]}</span>`;
          acceptedCount++;
        } else if (ps === 'PROBLEM_NO_ANSWER') {
          badge = `<span class="problem-status" style="background:#f5f5f5;color:#999;font-size:11px;padding:2px 8px;border-radius:4px;margin-left:8px;">${statusText[ps]}</span>`;
        } else if (ps) {
          badge = `<span class="problem-status" style="background:#ffebee;color:#f44336;font-size:11px;padding:2px 8px;border-radius:4px;margin-left:8px;">未通过</span>`;
        }
        html += `<div class="problem-item" data-id="${problem.id}">
          <span class="problem-index">${label}</span>
          <span class="problem-title">${problem.title}</span>${badge}
          <button class="problem-action-btn">一键完成</button>
        </div>`;
      });

      problemListContainer.innerHTML = html;
      if (statusDiv) {
        statusDiv.textContent = `共 ${allProblems.length} 题` + (acceptedCount > 0 ? `，已通过 ${acceptedCount}` : '');
        statusDiv.className = 'success';
      }

      // 添加点击事件
      problemListContainer.querySelectorAll('.problem-item').forEach(item => {
        // 题目点击事件（跳转到题目页面）
        item.addEventListener('click', function(e) {
          // 如果点击的是一键完成按钮，不执行跳转
          if (e.target.classList.contains('problem-action-btn')) {
            return;
          }
          const problemId = this.getAttribute('data-id');
          const problemTitle = this.querySelector('.problem-title').textContent;
          //console.log(`点击了题目: ${problemTitle}, ID: ${problemId}`);
          // 跳转到题目页面
          const typeParam = getProblemType() === 'CODE_COMPLETION' ? '6' : '7';
          window.open(`https://pintia.cn/problem-sets/${problemSetId}/exam/problems/type/${typeParam}?problemSetProblemId=${problemId}`, '_blank');
        });

        // 一键完成按钮点击事件
        const actionBtn = item.querySelector('.problem-action-btn');
        if (actionBtn) {
          actionBtn.addEventListener('click', async function() {
            const problemId = item.getAttribute('data-id');
            const problemTitle = item.querySelector('.problem-title').textContent;

            actionBtn.disabled = true;

            try {
              // 读题
              actionBtn.textContent = '读题';
              actionBtn.style.background = '#2196F3';

              // 步骤1: 获取examId
              const examId = await getExamId(problemSetId);
              if (!examId) {
                throw new Error('无法获取examId');
              }

              // 步骤2: 获取题目内容
              const problemResponse = await pintiaFetch(`https://pintia.cn/api/problem-sets/${problemSetId}/exam-problems/${problemId}`, {
                headers: {
                  accept: 'application/json;charset=UTF-8',
                  'content-type': 'application/json;charset=UTF-8',
                  'x-lollipop': getLollipop(),
                  'x-marshmallow': ''
                },
                method: 'GET',
                credentials: 'include'
              });

              if (!problemResponse.ok) {
                throw new Error('获取题目内容失败');
              }

              const problemData = await problemResponse.json();
              let problemContent = '';
              if (problemData && problemData.problemSetProblem) {
                problemContent = problemData.problemSetProblem.content || problemData.problemSetProblem.description || '';
              }

              if (!problemContent) {
                throw new Error('未提取到题目内容');
              }

              // AI生成
              actionBtn.textContent = 'AI生成';
              actionBtn.style.background = '#ff9800';

              // 步骤3: 调用AI生成代码
              const config = await new Promise(resolve => {
                getConfig(resolve);
              });

              const apiConfig = getActiveApiConfig(config);
              
              if (!config.aiEnabled || !apiConfig) {
                throw new Error('AI 未启用或未配置 API 密钥');
              }

              const apiKey = apiConfig.key;
              const apiUrl = apiConfig.url;
              const model = apiConfig.model;
              let systemPrompt = config.aiSystemPrompt;
              const language = config.language;

              systemPrompt = systemPrompt
                .replace('{language}', language)
                .replace('{problem content}', problemContent);

              let messages = [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: '' }
              ];

              let aiCode = await generateAIResponse(apiUrl, apiKey, model, messages);
              
              if (!aiCode) {
                throw new Error('AI 未返回有效结果');
              }
              
              aiCode = aiCode.replace(/```[\w]*\n?/g, '').trim();

              const result = await submitCode(aiCode, problemSetId, problemId);

              if (!result.success) {
                throw new Error('提交失败: ' + result.error);
              }

              if (result.examId && result.submissionId) {
                pollForButtonResult(actionBtn, result.examId, result.submissionId);
              } else {
                actionBtn.textContent = '完成';
                actionBtn.style.background = '#2196F3';
                actionBtn.disabled = false;
              }
            } catch (error) {
                showToast(`一键完成出现错误: ${error.message}`, 'error');
                if (actionBtn && actionBtn.parentNode) {
                  actionBtn.textContent = '失败';
                  actionBtn.style.background = '#f44336';
                  setTimeout(() => {
                    if (actionBtn && actionBtn.parentNode) {
                      actionBtn.textContent = '一键完成';
                      actionBtn.style.background = '#4CAF50';
                      actionBtn.disabled = false;
                    }
                  }, 2000);
                }
              }
          });
        }
      });

      // 一键完成所有题目按钮点击事件
      const completeAllBtn = document.getElementById('pta-complete-all-btn');
      const completeAllStatus = document.getElementById('pta-complete-all-status');
      if (completeAllBtn) {
        completeAllBtn.addEventListener('click', async function() {
          // 显示PrimeVue风格的确认对话框
          showConfirmDialog({
            message: '确定要一键完成所有题目吗？这将自动处理当前列表中的所有题目。',
            header: '确认操作',
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
              // 禁用按钮，显示加载状态
              completeAllBtn.disabled = true;
              completeAllBtn.textContent = '处理中...';
              completeAllStatus.style.display = 'block';
              completeAllStatus.className = 'processing';
              completeAllStatus.textContent = '正在处理题目...';

              try {
                const problems = allProblems;

                const examId = await getExamId(problemSetId);
                if (!examId) {
                  throw new Error('无法获取examId');
                }

                // 步骤2: 获取配置
                const config = await new Promise(resolve => {
                  getConfig(resolve);
                });

                // 获取活动的 API 配置
                const apiConfig = getActiveApiConfig(config);
                
                if (!config.aiEnabled || !apiConfig) {
                  throw new Error('AI 未启用或未配置 API 密钥');
                }

                // 初始化批次统计
                const batchStats = { AC: 0, WA: 0, PA: 0, CE: 0, SF: 0, ERROR: 0, PENDING: problems.length, SUBMITTED: 0, TIMEOUT: 0 };
                function updateBatchStatus(statusEl, status) {
                  if (status === 'SUBMITTED' || status === 'TIMEOUT') {
                    batchStats[status] = (batchStats[status] || 0) + 1;
                  } else {
                    const mapped = status === 'ACCEPTED' ? 'AC' : 
                                   status === 'PARTIAL_ACCEPTED' ? 'PA' :
                                   status === 'WRONG_ANSWER' ? 'WA' :
                                   status === 'COMPILE_ERROR' ? 'CE' :
                                   status === 'SEGMENTATION_FAULT' ? 'SF' :
                                   status === 'ERROR' ? 'ERROR' : status;
                    batchStats[mapped] = (batchStats[mapped] || 0) + 1;
                  }
                  batchStats.PENDING = Math.max(0, batchStats.PENDING - 1);

                  const parts = [];
                  if (batchStats.AC > 0) parts.push(`✅${batchStats.AC}`);
                  if (batchStats.WA > 0) parts.push(`❌${batchStats.WA}`);
                  if (batchStats.PA > 0) parts.push(`⚠️${batchStats.PA}`);
                  if (batchStats.CE > 0) parts.push(`🔧${batchStats.CE}`);
                  if (batchStats.SF > 0) parts.push(`💥${batchStats.SF}`);
                  if (batchStats.ERROR > 0) parts.push(`🚫${batchStats.ERROR}`);
                  if (batchStats.TIMEOUT > 0) parts.push(`⏰${batchStats.TIMEOUT}`);
                  if (batchStats.PENDING > 0) parts.push(`⏳${batchStats.PENDING}`);

                  if (batchStats.PENDING === 0) {
                    statusEl.className = 'success';
                  }
                  statusEl.textContent = parts.join(' ') || '处理完成';
                }
                
                const processingPromises = [];
                
                // 处理单个题目的函数
                const processProblem = async (problem, index) => {
                  const problemId = problem.id;
                  const problemTitle = problem.title;
                  
                  // 提前获取按钮引用
                  const problemItem = problemListContainer.querySelector(`.problem-item[data-id="${problemId}"]`);
                  const actionBtn = problemItem ? problemItem.querySelector('.problem-action-btn') : null;
                  
                  try {
                    //console.log(`处理题目 ${index + 1}/${problems.length}: ${problemTitle}, ID: ${problemId}`);

                    // 更新按钮：读题
                    if (actionBtn) {
                      actionBtn.textContent = '读题';
                      actionBtn.style.background = '#2196F3';
                      actionBtn.disabled = true;
                    }

                    // 步骤3: 获取题目内容
                    const problemResponse = await pintiaFetch(`https://pintia.cn/api/problem-sets/${problemSetId}/exam-problems/${problemId}`, {
                      headers: {
                        accept: 'application/json;charset=UTF-8',
                        'content-type': 'application/json;charset=UTF-8',
                        'x-lollipop': getLollipop(),
                        'x-marshmallow': ''
                      },
                      method: 'GET',
                      credentials: 'include'
                    });

                    if (!problemResponse.ok) {
                      throw new Error('获取题目内容失败');
                    }

                    const problemData = await problemResponse.json();
                    let problemContent = '';
                    if (problemData && problemData.problemSetProblem) {
                      problemContent = problemData.problemSetProblem.content || problemData.problemSetProblem.description || '';
                    }

                    if (!problemContent) {
                      throw new Error('未提取到题目内容');
                    }

                    // 更新按钮：AI生成
                    if (actionBtn) {
                      actionBtn.textContent = 'AI生成';
                      actionBtn.style.background = '#ff9800';
                    }

                    // 步骤4: 调用AI生成代码
                    const apiKey = apiConfig.key;
                    const apiUrl = apiConfig.url;
                    const model = apiConfig.model;
                    let systemPrompt = config.aiSystemPrompt;
                    const language = config.language;

                    // 替换占位符
                    systemPrompt = systemPrompt
                      .replace('{language}', language)
                      .replace('{problem content}', problemContent);

                    // 构建消息
                    let messages = [
                      {
                        role: 'system',
                        content: systemPrompt
                      },
                      {
                        role: 'user',
                        content: ''
                      }
                    ];

                    // 使用Cherry AI Core进行调用
                    let aiCode = await generateAIResponse(apiUrl, apiKey, model, messages);
                    
                    if (!aiCode) {
                      throw new Error('AI 未返回有效结果');
                    }
                    
                    // 移除代码块标记
                    aiCode = aiCode.replace(/```[\w]*\n?/g, '').trim();

                    // 提交代码
                    const submitResult = await submitCode(aiCode, problemSetId, problemId);
                    
                    if (!submitResult.success) {
                      throw new Error('提交失败: ' + submitResult.error);
                    }

                    // 更新对应题目的按钮状态：等待结果
                    let finalStatus = 'SUBMITTED';
                    if (actionBtn) {
                      if (submitResult.examId && submitResult.submissionId) {
                        finalStatus = await pollForButtonResult(actionBtn, submitResult.examId, submitResult.submissionId);
                      } else {
                        actionBtn.textContent = '完成';
                        actionBtn.style.background = '#2196F3';
                        actionBtn.disabled = false;
                      }
                    }

                    // 更新汇总状态
                    updateBatchStatus(completeAllStatus, finalStatus);

                    return finalStatus;
                  } catch (error) {
                    showToast(`处理题目 ${problemTitle} 失败: ${error.message}`, 'error');
                    if (actionBtn) {
                      actionBtn.textContent = '失败';
                      actionBtn.style.background = '#f44336';
                      setTimeout(() => {
                        actionBtn.textContent = '一键完成';
                        actionBtn.style.background = '#4CAF50';
                        actionBtn.disabled = false;
                      }, 2000);
                    }
                    updateBatchStatus(completeAllStatus, 'ERROR');
                    return 'ERROR';
                  }
                };

                // 每隔半秒启动一个新任务
                for (let i = 0; i < problems.length; i++) {
                  // 延迟启动任务
                  const delayPromise = new Promise(resolve => {
                    setTimeout(resolve, i * 500); // 每隔500毫秒启动一个新任务
                  });

                  const taskPromise = delayPromise.then(() => {
                    return processProblem(problems[i], i);
                  });

                  processingPromises.push(taskPromise);
                }

                // 等待所有任务完成
                await Promise.all(processingPromises);

                completeAllBtn.textContent = '完成所有题目';
                completeAllBtn.disabled = false;
              } catch (error) {
                showToast(`一键完成所有题目失败: ${error.message}`, 'error');
                completeAllStatus.className = 'error';
                completeAllStatus.textContent = '处理失败: ' + error.message;
                completeAllBtn.textContent = '一键完成所有题目';
                completeAllBtn.disabled = false;
              }
            },
            reject: () => {
              // 取消操作
            }
          });
          return;
        });
      }

      // 应用筛选状态
      applyProblemFilter();
    }
  } catch (error) {
    showToast(`获取题目列表出错: ${error.message}`, 'error');
    problemListContainer.innerHTML = '<div class="problem-item"><span class="problem-index">错误</span><span class="problem-title">获取题目列表出错</span></div>';
    if (statusDiv) {
      statusDiv.textContent = '获取题目列表出错';
      statusDiv.className = 'error';
    }
  }
}

// 获取选择题列表
async function fetchChoiceQuestions() {
  if (!isChoiceQuestionPage()) {
    return;
  }

  try {
    const url = window.location.href;
    const problemSetMatch = url.match(/\/problem-sets\/(\d+)/);
    if (!problemSetMatch) {
      console.log('无法从URL中提取problemSetId');
      return;
    }
    const problemSetId = problemSetMatch[1];

    const examId = await getExamId(problemSetId);
    if (!examId) {
      console.log('无法获取examId');
      return;
    }

    window.choiceExamId = examId;
    window.choiceProblemSetId = problemSetId;

    const listResponse = await pintiaFetch(
      `https://pintia.cn/api/problem-sets/${problemSetId}/exam-problems?exam_id=${examId}&problem_type=MULTIPLE_CHOICE`,
      {
        headers: {
          accept: 'application/json;charset=UTF-8',
          'content-type': 'application/json;charset=UTF-8',
          'x-lollipop': getLollipop(),
          'x-marshmallow': ''
        },
        method: 'GET',
        credentials: 'include'
      }
    );

    if (!listResponse.ok) {
      console.log('获取选择题列表失败:', listResponse.status);
      return;
    }

    const data = await listResponse.json();

    if (data.problemSetProblems) {
      const questions = data.problemSetProblems.map(p => ({
        id: p.id,
        content: p.content || p.description || '',
        choices: p.problemConfig?.multipleChoiceProblemConfig?.choices || []
      }));
      window.choiceQuestions = questions;
      console.log('选择题列表（精简）:', questions);

      const countEl = document.getElementById('pta-choice-count');
      if (countEl) {
        countEl.textContent = `共 ${questions.length} 题`;
      }
      const batchBtn = document.getElementById('pta-choice-batch-btn');
      if (batchBtn) {
        batchBtn.disabled = false;
      }

      // 渲染题目列表
      const floatWindow = document.getElementById('pta-helper-float');
      if (floatWindow) {
        renderChoiceList(floatWindow);
      }
    } else {
      console.log('选择题列表响应:', data);
    }
  } catch (error) {
    console.error('获取选择题列表出错:', error);
  }
}

// 获取题目文本
async function extractProblemText() {
  if (!isProgrammingDetailPage()) {
    return null;
  }
  
  try {
    const url = window.location.href;
    
    // 从URL中提取problemSetId和problemId
    const problemSetMatch = url.match(/\/problem-sets\/(\d+)/);
    const problemMatch = url.match(/problemSetProblemId=(\d+)/);
    
    if (!problemSetMatch || !problemMatch) {
      showToast('无法从URL中提取问题集ID或问题ID', 'error');
      return null;
    }
    
    const problemSetId = problemSetMatch[1];
    const problemId = problemMatch[1];
    
    // 构建API URL
    const apiUrl = `https://pintia.cn/api/problem-sets/${problemSetId}/exam-problems/${problemId}`;
    
    // 发送fetch请求
    const response = await fetch(apiUrl, {
      headers: {
        accept: 'application/json;charset=UTF-8',
        'accept-language': 'zh-CN',
        'content-type': 'application/json;charset=UTF-8',
        priority: 'u=1, i',
        'sec-ch-ua': `"Chromium";v="146", "Not-A.Brand";v="24", "Microsoft Edge";v="146"`,
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-lollipop': getLollipop(),
        'x-marshmallow': ''
      },
      referrer: url,
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    });
    
    if (!response.ok) {
      showToast(`API请求失败: ${response.status} ${response.statusText}`, 'error');
      return null;
    }
    
    // 获取响应数据
    const problemData = await response.json();
    
    // 提取题目内容
    let problemContent = '';
    if (problemData && problemData.problemSetProblem) {
      // 优先使用content字段
      if (problemData.problemSetProblem.content) {
        problemContent = problemData.problemSetProblem.content;
      } else if (problemData.problemSetProblem.description) {
        problemContent = problemData.problemSetProblem.description;
      }
    }
    
    // 保存当前题目文本
    currentProblemText = problemContent;
    // 清空对话历史
    aiConversationHistory = [];
    
    // 检查是否启用 AI 答题
    checkAndUseAI(currentProblemText);
    
    return problemData;
  } catch (error) {
    showToast(`获取题目数据时出错: ${error.message}`, 'error');
    return null;
  }
}

// 检查并调用 AI 答题
async function checkAndUseAI(problemText, isRetry = false, errorNote = '', attemptCount = 0) {
  getConfig(async function(config) {
    if (!config.aiEnabled) {
      //console.log('AI 答题未启用');
      return;
    }
    
    // 获取活动的 API 配置
    const apiConfig = getActiveApiConfig(config);
    
    if (!apiConfig) {
      showToast('未配置 API 密钥', 'warning');
      return;
    }
    
    const apiKey = apiConfig.key;
    const apiUrl = apiConfig.url;
    const model = apiConfig.model;
    let systemPrompt = config.aiSystemPrompt;
    const language = config.language;
    
    // 替换占位符
    systemPrompt = systemPrompt
      .replace('{language}', language)
      .replace('{problem content}', problemText);
    
    // 构建消息
    let messages = [
      {
        role: 'system',
        content: systemPrompt
      }
    ];
    
    debugLog('发给 AI 的内容', messages);
    
    // 如果有对话历史，添加历史记录
    if (aiConversationHistory.length > 0) {
      messages = messages.concat(aiConversationHistory);
    }
    
    // 构建用户消息
    let userContent = '';
    if (isRetry && errorNote) {
      userContent = `之前的代码有误，错误信息：${errorNote}\n\n请重新思考并修正代码。`;
    } else if (isRetry) {
      userContent = `之前的代码有误，请重新思考并修正代码。`;
    } else {
      userContent = '';
    }
    
    messages.push({
      role: 'user',
      content: userContent
    });
    
    try {
      // 流式输出
      let aiResponse = '';
      const codeInput = document.getElementById('pta-code-input');
      const codeHighlight = document.getElementById('pta-code-highlight');
      
      await streamAIResponse(apiUrl, apiKey, model, messages, 
        (() => {
          const grammar = Prism.languages.c;
          let lastRender = 0;
          let pending = false;
          return (chunk) => {
            aiResponse += chunk;
            if (!codeInput || !codeHighlight) return;
            const cleanCode = aiResponse.replace(/```[\w]*\n?/g, '').trim();
            codeInput.value = cleanCode;
            const now = Date.now();
            const interval = cleanCode.length > 5000 ? 500 : 300;
            if (now - lastRender >= interval) {
              codeHighlight.innerHTML = Prism.highlight(cleanCode, grammar, 'c');
              codeHighlight.classList.add('line-numbers');
              lastRender = now;
              pending = false;
            } else if (!pending) {
              pending = true;
              const delay = interval - (now - lastRender);
              setTimeout(() => {
                if (!codeHighlight || !document.contains(codeHighlight)) return;
                const c = aiResponse.replace(/```[\w]*\n?/g, '').trim();
                codeHighlight.innerHTML = Prism.highlight(c, grammar, 'c');
                codeHighlight.classList.add('line-numbers');
                lastRender = Date.now();
                pending = false;
              }, delay);
            }
          };
        })(),
        () => {
          // flush
          if (codeHighlight) {
            const cleanCode = aiResponse.replace(/```[\w]*\n?/g, '').trim();
            codeHighlight.innerHTML = Prism.highlight(cleanCode, Prism.languages.c, 'c');
            codeHighlight.classList.add('line-numbers');
          }
          // 完成时的处理
          debugLog('AI 返回的内容', aiResponse);
          // 保存对话历史
          aiConversationHistory.push({
            role: 'user',
            content: userContent
          });
          aiConversationHistory.push({
            role: 'assistant',
            content: aiResponse
          });
        },
        async (error) => {
          showToast(`AI 调用出错：${error.message}`, 'error');
          
          // 尝试使用其他模型
          if (attemptCount < 3) {
            showToast('尝试使用其他模型...', 'info');
            // 清空对话历史
            aiConversationHistory = [];
            // 延迟一秒后重试
            setTimeout(() => {
              checkAndUseAI(problemText, isRetry, errorNote, attemptCount + 1);
            }, 1000);
          } else {
            showToast('所有模型均失败，请检查 API 配置', 'error');
          }
        }
      );
      
    } catch (error) {
      showToast(`AI 调用出错：${error.message}`, 'error');
      
      // 尝试使用其他模型
      if (attemptCount < 3) {
        showToast('尝试使用其他模型...', 'info');
        // 清空对话历史
        aiConversationHistory = [];
        // 延迟一秒后重试
        setTimeout(() => {
          checkAndUseAI(problemText, isRetry, errorNote, attemptCount + 1);
        }, 1000);
      } else {
        showToast('所有模型均失败，请检查 API 配置', 'error');
      }
    }
  });
}

// HTML转义函数
function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

// 为浏览器环境添加 global 变量
if (typeof global === 'undefined') {
  window.global = window;
}

// 显示提交失败提示
function showSubmissionErrorHint() {
  // 创建提示元素
  const hintElement = document.createElement('div');
  hintElement.style.position = 'fixed';
  hintElement.style.top = '20px';
  hintElement.style.right = '20px';
  hintElement.style.padding = '12px 16px';
  hintElement.style.borderRadius = '8px';
  hintElement.style.backgroundColor = '#ff4d4f';
  hintElement.style.color = '#fff';
  hintElement.style.fontSize = '14px';
  hintElement.style.fontWeight = '500';
  hintElement.style.zIndex = '999999';
  hintElement.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
  hintElement.style.cursor = 'pointer';
  hintElement.style.transition = 'all 0.3s ease';
  hintElement.style.opacity = '0';
  hintElement.style.transform = 'translateY(-20px)';
  hintElement.textContent = '提交失败？点击查看使用PyCatch提交的方法';
  
  // 添加点击事件
  hintElement.addEventListener('click', () => {
    console.log('提示框被点击');
    // 发送消息给background script，让它打开设置页面
    chrome.runtime.sendMessage({ 
      action: 'openOptionsWithTab', 
      tab: 'subErr' 
    }, (response) => {
      console.log('消息发送结果', response);
    });
  });
  
  // 添加到页面
  document.body.appendChild(hintElement);
  
  // 显示提示
  setTimeout(() => {
    hintElement.style.opacity = '1';
    hintElement.style.transform = 'translateY(0)';
  }, 100);
  
  // 10秒后隐藏提示
  setTimeout(() => {
    hintElement.style.opacity = '0';
    hintElement.style.transform = 'translateY(-20px)';
    setTimeout(() => {
      if (hintElement.parentNode) {
        document.body.removeChild(hintElement);
      }
    }, 300);
  }, 10000);
}

// ==================== AI平台适配器 ====================

// 检测API提供商类型
function detectProvider(apiUrl, model) {
  const url = apiUrl.toLowerCase();
  const modelLower = model.toLowerCase();
  
  // 国产平台检测 - 优先检测，避免被其他规则覆盖
  if (url.includes('siliconflow') || url.includes('silicon-flow') || url.includes('api.siliconflow.cn') || modelLower.includes('siliconflow')) {
    return 'siliconflow';
  }
  if (url.includes('volcano') || url.includes('ark.cn-beijing.volces.com') || url.includes('volces.com') || modelLower.includes('volcano')) {
    return 'volcano';
  }
  if (url.includes('aliyun') || url.includes('bailian') || url.includes('dashscope') || modelLower.includes('bailian')) {
    return 'aliyun';
  }
  
  if (url.includes('anthropic') || url.includes('claude') || modelLower.includes('claude')) {
    return 'anthropic';
  }
  if (url.includes('google') || url.includes('gemini') || modelLower.includes('gemini')) {
    return 'google';
  }
  if (url.includes('azure') || url.includes('openai.azure')) {
    return 'azure';
  }
  if (url.includes('deepseek') || modelLower.includes('deepseek')) {
    return 'deepseek';
  }
  if (url.includes('openai') || modelLower.includes('gpt')) {
    return 'openai';
  }
  
  // 默认使用OpenAI兼容格式
  return 'openai-compatible';
}

// OpenAI适配器
const OpenAIAdapter = {
  name: 'OpenAI',
  
  async stream(apiUrl, apiKey, model, messages, onChunk, onComplete, onError) {
    try {
      console.log('[PTA AI] OpenAI流式调用', { apiUrl, model });
      
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          stream: true
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '未知错误' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) onChunk(content);
            } catch (e) {}
          }
        }
        buffer = lines[lines.length - 1];
      }
      onComplete();
    } catch (error) {
      onError(error);
    }
  },
  
  async generate(apiUrl, apiKey, model, messages) {
    console.log('[PTA AI] OpenAI非流式调用', { apiUrl, model });
    
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '未知错误' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
};

// Anthropic适配器
const AnthropicAdapter = {
  name: 'Anthropic',
  
  async stream(apiUrl, apiKey, model, messages, onChunk, onComplete, onError) {
    try {
      console.log('[PTA AI] Anthropic流式调用', { apiUrl, model });
      
      // 转换消息格式
      const systemMessage = messages.find(m => m.role === 'system')?.content || '';
      const userMessages = messages.filter(m => m.role !== 'system');
      
      const response = await fetch(`${apiUrl}/v1/messages`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: model,
          max_tokens: 4096,
          temperature: 0.7,
          system: systemMessage,
          messages: userMessages.map(m => ({
            role: m.role === 'assistant' ? 'assistant' : 'user',
            content: m.content
          })),
          stream: true
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '未知错误' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            try {
              const json = JSON.parse(data);
              if (json.type === 'content_block_delta' && json.delta?.text) {
                onChunk(json.delta.text);
              }
            } catch (e) {}
          }
        }
        buffer = lines[lines.length - 1];
      }
      onComplete();
    } catch (error) {
      onError(error);
    }
  },
  
  async generate(apiUrl, apiKey, model, messages) {
    console.log('[PTA AI] Anthropic非流式调用', { apiUrl, model });
    
    const systemMessage = messages.find(m => m.role === 'system')?.content || '';
    const userMessages = messages.filter(m => m.role !== 'system');
    
    const response = await fetch(`${apiUrl}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': apiKey,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: model,
        max_tokens: 4096,
        temperature: 0.7,
        system: systemMessage,
        messages: userMessages.map(m => ({
          role: m.role === 'assistant' ? 'assistant' : 'user',
          content: m.content
        }))
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '未知错误' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.content?.[0]?.text || '';
  }
};

// Google Gemini适配器
const GoogleAdapter = {
  name: 'Google',
  
  async stream(apiUrl, apiKey, model, messages, onChunk, onComplete, onError) {
    try {
      console.log('[PTA AI] Google流式调用', { apiUrl, model });
      
      // 转换消息格式为Gemini格式
      const contents = messages.map(m => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      }));
      
      const response = await fetch(`${apiUrl}/v1beta/models/${model}:streamGenerateContent?key=${apiKey}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          contents: contents,
          generationConfig: {
            temperature: 0.7,
            maxOutputTokens: 4096
          }
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '未知错误' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        try {
          // Gemini返回的是JSON行格式
          const lines = chunk.split('\n').filter(line => line.trim());
          for (const line of lines) {
            const json = JSON.parse(line);
            const text = json.candidates?.[0]?.content?.parts?.[0]?.text;
            if (text) onChunk(text);
          }
        } catch (e) {}
      }
      onComplete();
    } catch (error) {
      onError(error);
    }
  },
  
  async generate(apiUrl, apiKey, model, messages) {
    console.log('[PTA AI] Google非流式调用', { apiUrl, model });
    
    const contents = messages.map(m => ({
      role: m.role === 'user' ? 'user' : 'model',
      parts: [{ text: m.content }]
    }));
    
    const response = await fetch(`${apiUrl}/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        contents: contents,
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 4096
        }
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '未知错误' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.candidates?.[0]?.content?.parts?.[0]?.text || '';
  }
};

// Azure OpenAI适配器
const AzureAdapter = {
  name: 'Azure',
  
  async stream(apiUrl, apiKey, model, messages, onChunk, onComplete, onError) {
    try {
      console.log('[PTA AI] Azure流式调用', { apiUrl, model });
      
      const response = await fetch(`${apiUrl}/openai/deployments/${model}/chat/completions?api-version=2024-02-01`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'api-key': apiKey
        },
        body: JSON.stringify({
          messages: messages,
          temperature: 0.7,
          stream: true
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '未知错误' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) onChunk(content);
            } catch (e) {}
          }
        }
        buffer = lines[lines.length - 1];
      }
      onComplete();
    } catch (error) {
      onError(error);
    }
  },
  
  async generate(apiUrl, apiKey, model, messages) {
    console.log('[PTA AI] Azure非流式调用', { apiUrl, model });
    
    const response = await fetch(`${apiUrl}/openai/deployments/${model}/chat/completions?api-version=2024-02-01`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'api-key': apiKey
      },
      body: JSON.stringify({
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '未知错误' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
};

// DeepSeek适配器（OpenAI兼容格式）
const DeepSeekAdapter = {
  name: 'DeepSeek',
  
  async stream(apiUrl, apiKey, model, messages, onChunk, onComplete, onError) {
    try {
      console.log('[PTA AI] DeepSeek流式调用', { apiUrl, model });
      
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          stream: true
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '未知错误' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) onChunk(content);
            } catch (e) {}
          }
        }
        buffer = lines[lines.length - 1];
      }
      onComplete();
    } catch (error) {
      onError(error);
    }
  },
  
  async generate(apiUrl, apiKey, model, messages) {
    console.log('[PTA AI] DeepSeek非流式调用', { apiUrl, model });
    
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '未知错误' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
};

// 硅基流动适配器
const SiliconFlowAdapter = {
  name: 'SiliconFlow',
  
  async stream(apiUrl, apiKey, model, messages, onChunk, onComplete, onError) {
    try {
      console.log('[PTA AI] 硅基流动流式调用', { apiUrl, model });
      
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          stream: true
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '未知错误' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) onChunk(content);
            } catch (e) {}
          }
        }
        buffer = lines[lines.length - 1];
      }
      onComplete();
    } catch (error) {
      onError(error);
    }
  },
  
  async generate(apiUrl, apiKey, model, messages) {
    console.log('[PTA AI] 硅基流动非流式调用', { apiUrl, model });
    
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '未知错误' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
};

// 火山方舟适配器
const VolcanoAdapter = {
  name: 'Volcano',
  
  async stream(apiUrl, apiKey, model, messages, onChunk, onComplete, onError) {
    try {
      console.log('[PTA AI] 火山方舟流式调用', { apiUrl, model });
      
      const response = await fetch(`${apiUrl}/api/v3/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          stream: true
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '未知错误' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) onChunk(content);
            } catch (e) {}
          }
        }
        buffer = lines[lines.length - 1];
      }
      onComplete();
    } catch (error) {
      onError(error);
    }
  },
  
  async generate(apiUrl, apiKey, model, messages) {
    console.log('[PTA AI] 火山方舟非流式调用', { apiUrl, model });
    
    const response = await fetch(`${apiUrl}/api/v3/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '未知错误' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
};

// 阿里云百炼适配器
const AliyunAdapter = {
  name: 'Aliyun',
  
  async stream(apiUrl, apiKey, model, messages, onChunk, onComplete, onError) {
    try {
      console.log('[PTA AI] 阿里云百炼流式调用', { apiUrl, model });
      
      const response = await fetch(`${apiUrl}/chat/completions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${apiKey}`
        },
        body: JSON.stringify({
          model: model,
          messages: messages,
          temperature: 0.7,
          stream: true
        })
      });
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({ message: '未知错误' }));
        throw new Error(error.message || `HTTP ${response.status}`);
      }
      
      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';
      
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        
        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6);
            if (data === '[DONE]') {
              onComplete();
              return;
            }
            try {
              const json = JSON.parse(data);
              const content = json.choices?.[0]?.delta?.content;
              if (content) onChunk(content);
            } catch (e) {}
          }
        }
        buffer = lines[lines.length - 1];
      }
      onComplete();
    } catch (error) {
      onError(error);
    }
  },
  
  async generate(apiUrl, apiKey, model, messages) {
    console.log('[PTA AI] 阿里云百炼非流式调用', { apiUrl, model });
    
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        stream: false
      })
    });
    
    if (!response.ok) {
      const error = await response.json().catch(() => ({ message: '未知错误' }));
      throw new Error(error.message || `HTTP ${response.status}`);
    }
    
    const data = await response.json();
    return data.choices?.[0]?.message?.content || '';
  }
};

// 适配器工厂
const AIAdapters = {
  openai: OpenAIAdapter,
  anthropic: AnthropicAdapter,
  google: GoogleAdapter,
  azure: AzureAdapter,
  deepseek: DeepSeekAdapter,
  siliconflow: SiliconFlowAdapter,
  volcano: VolcanoAdapter,
  aliyun: AliyunAdapter,
  'openai-compatible': OpenAIAdapter
};

// 流式输出函数（使用适配器）
async function streamAIResponse(apiUrl, apiKey, model, messages, onChunk, onComplete, onError) {
  const provider = detectProvider(apiUrl, model);
  const adapter = AIAdapters[provider] || AIAdapters['openai-compatible'];
  
  console.log('[PTA AI] 使用适配器', { provider: adapter.name, apiUrl, model });
  
  await adapter.stream(apiUrl, apiKey, model, messages, onChunk, onComplete, onError);
}

// 非流式AI调用函数（使用适配器）
async function generateAIResponse(apiUrl, apiKey, model, messages) {
  const provider = detectProvider(apiUrl, model);
  const adapter = AIAdapters[provider] || AIAdapters['openai-compatible'];
  
  console.log('[PTA AI] 使用适配器', { provider: adapter.name, apiUrl, model });
  
  return await adapter.generate(apiUrl, apiKey, model, messages);
}

// 简化版流式输出函数（直接调用，速度更快）
async function simpleStreamAIResponse(apiUrl, apiKey, model, messages, onChunk, onComplete, onError) {
  try {
    const response = await fetch(`${apiUrl}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: model,
        messages: messages,
        temperature: 0.7,
        stream: true
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || '未知错误');
    }
    
    const reader = response.body.getReader();
    const decoder = new TextDecoder();
    let buffer = '';
    
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      
      buffer += decoder.decode(value, { stream: true });
      
      // 处理SSE格式的数据
      const lines = buffer.split('\n');
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            onComplete();
            return;
          }
          try {
            const json = JSON.parse(data);
            if (json.choices && json.choices[0] && json.choices[0].delta && json.choices[0].delta.content) {
              onChunk(json.choices[0].delta.content);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
      
      // 保留未处理的部分
      buffer = lines[lines.length - 1];
    }
  } catch (error) {
    onError(error);
  }
}

// 简化版非流式AI调用函数（直接调用，速度更快）
async function simpleGenerateAIResponse(apiUrl, apiKey, model, messages) {
  const aiResponse = await fetch(`${apiUrl}/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${apiKey}`
    },
    body: JSON.stringify({
      model: model,
      messages: messages,
      temperature: 0.7
    })
  });

  if (!aiResponse.ok) {
    const errorData = await aiResponse.json();
    throw new Error('AI 调用失败: ' + (errorData.message || '未知错误'));
  }

  const aiData = await aiResponse.json();
  if (!aiData.choices || aiData.choices.length === 0) {
    throw new Error('AI 未返回有效结果');
  }

  return aiData.choices[0].message.content;
}

// 将代码填充到浮动窗口
function fillCodeToFloatWindow(code) {
  const codeInput = document.getElementById('pta-code-input');
  const codeHighlight = document.getElementById('pta-code-highlight');
  if (codeInput && codeHighlight) {
    // 移除代码块标记
    const cleanCode = code.replace(/```[\w]*\n?/g, '').trim();
    codeInput.value = cleanCode;
    const grammar = Prism.languages.c;
    const html = Prism.highlight(cleanCode, grammar, 'c');
    codeHighlight.innerHTML = html;
    codeHighlight.classList.add('line-numbers');
    //console.log('已将 AI 代码填充到输入框');
  }
}

// 引入Prism.js
import Prism from 'prismjs';
import 'prismjs/themes/prism.css';
import 'prismjs/components/prism-c';
import 'prismjs/components/prism-cpp';
import 'prismjs/components/prism-java';
import 'prismjs/components/prism-python';

// 加载Prism.js和CSS
function loadPrism() {
  // Prism已通过import加载，这里可以做一些初始化操作
  //console.log('Prism.js loaded');
}

// 创建浮动窗口
function createFloatingWindow() {
  // 检查是否已经存在
  if (document.getElementById('pta-helper-float')) {
    return;
  }

  // 加载Prism.js
  loadPrism();

  // 创建浮动窗口容器
  const floatWindow = document.createElement('div');
  floatWindow.id = 'pta-helper-float';

  // 根据页面类型选择不同的内容
  if (isChoiceQuestionPage()) {
    floatWindow.innerHTML = createChoiceQuestionHTML();
  } else if (isProgrammingListPage()) {
    floatWindow.innerHTML = createProblemListHTML();
  } else {
    floatWindow.innerHTML = createCodeEditorHTML();
  }

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    #pta-helper-float {
      position: fixed;
      top: 50px;
      right: 20px;
      width: 500px;
      max-height: 80vh;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      z-index: 999999;
      font-family: Arial, sans-serif;
      overflow-y: auto;
    }
    .pta-float-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #4CAF50;
      color: white;
      border-radius: 8px 8px 0 0;
      cursor: move;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    .pta-float-header span {
      font-weight: bold;
      font-size: 16px;
    }
    .pta-float-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pta-float-close:hover {
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
    }
    .pta-float-body {
      padding: 20px;
    }
    .code-editor-container {
      position: relative;
      width: 100%;
      height: 300px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    .code-editor-container pre {
      position: absolute;
      top: 0;
      left: 0;
      margin: 0;
      padding: 12px;
      width: 100%;
      height: 100%;
      background: transparent;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
      overflow: auto;
      pointer-events: none;
      white-space: pre;
    }
    .code-editor-container code {
      font-family: 'Courier New', monospace;
    }
    #pta-code-input {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 12px;
      border: none;
      background: transparent;
      color: transparent;
      caret-color: #333;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
      resize: none;
      box-sizing: border-box;
      z-index: 1;
      white-space: pre;
      overflow: auto;
    }
    #pta-code-input:focus {
      outline: none;
    }
    .pta-buttons {
      display: flex;
      gap: 10px;
      margin-top: 15px;
    }
    #pta-submit-btn, #pta-report-error-btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }
    #pta-submit-btn {
      background: #4CAF50;
      color: white;
    }
    #pta-submit-btn:hover {
      background: #45a049;
    }
    #pta-submit-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    #pta-report-error-btn {
      background: #ff9800;
      color: white;
    }
    #pta-report-error-btn:hover {
      background: #f57c00;
    }
    .error-section {
      margin-top: 15px;
      padding: 15px;
      background: #fff3e0;
      border-radius: 4px;
      border: 1px solid #ffcc80;
    }
    #pta-error-note {
      width: 100%;
      height: 80px;
      padding: 10px;
      border: 1px solid #ddd;
      border-radius: 4px;
      resize: vertical;
      font-family: Arial, sans-serif;
      font-size: 13px;
      box-sizing: border-box;
    }
    .btn-retry {
      width: 100%;
      padding: 10px;
      margin-top: 10px;
      background: #f44336;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }
    .btn-retry:hover {
      background: #d32f2f;
    }
    #pta-status {
      margin-top: 15px;
      font-size: 13px;
      text-align: center;
      min-height: 20px;
      padding: 8px;
      border-radius: 4px;
    }
    #pta-status.success {
      color: #4CAF50;
      background: #e8f5e9;
    }
    #pta-status.error {
      color: #f44336;
      background: #ffebee;
    }
    .problem-list {
      max-height: 400px;
      overflow-y: auto;
      border: 1px solid #ddd;
      border-radius: 4px;
    }
    .problem-item {
      display: flex;
      padding: 10px 12px;
      border-bottom: 1px solid #eee;
      cursor: pointer;
    }
    .problem-item:last-child {
      border-bottom: none;
    }
    .problem-item:hover {
      background: #f5f5f5;
    }
    .problem-index {
      font-weight: bold;
      color: #4CAF50;
      margin-right: 12px;
      min-width: 60px;
    }
    .problem-title {
      color: #333;
      flex: 1;
    }
    .problem-action-btn {
      background: #4CAF50;
      color: white;
      border: none;
      border-radius: 4px;
      padding: 4px 8px;
      font-size: 12px;
      cursor: pointer;
      white-space: nowrap;
    }
    .problem-action-btn:hover {
      background: #45a049;
    }
    .problem-action-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    .btn-complete-all {
      width: 100%;
      padding: 10px;
      background: #2196F3;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
      margin-bottom: 15px;
    }
    .btn-complete-all:hover {
      background: #1976D2;
    }
    .btn-complete-all:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    #pta-problem-list-status {
      margin-top: 15px;
      font-size: 13px;
      text-align: center;
      min-height: 20px;
      padding: 8px;
      border-radius: 4px;
    }
    #pta-complete-all-status {
      margin-top: 10px;
      font-size: 13px;
      text-align: center;
      min-height: 20px;
      padding: 8px;
      border-radius: 4px;
    }
    #pta-complete-all-status.success {
      color: #4CAF50;
      background: #e8f5e9;
    }
    #pta-complete-all-status.error {
      color: #f44336;
      background: #ffebee;
    }
    #pta-complete-all-status.processing {
      color: #2196F3;
      background: #e3f2fd;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(floatWindow);

  // 关闭按钮事件
  floatWindow.querySelector('.pta-float-close').addEventListener('click', () => {
    floatWindow.remove();
  });

  // 根据页面类型初始化不同的功能
  if (isChoiceQuestionPage()) {
    initChoiceQuestionEvents(floatWindow);
  } else if (isProgrammingListPage()) {
    initProblemListEvents(floatWindow);
  } else {
    initCodeEditorEvents(floatWindow);
  }

  // 拖拽功能
  makeDraggable(floatWindow);
}

// 创建代码编辑器HTML
function createCodeEditorHTML() {
  return `
    <div class="pta-float-header">
      <span>PTA 答题辅助</span>
      <button class="pta-float-close">×</button>
    </div>
    <div class="pta-float-body">
      <div class="code-editor-container">
        <pre><code id="pta-code-highlight" class="language-c"></code></pre>
        <textarea id="pta-code-input" placeholder="请输入代码..."></textarea>
      </div>
      <div class="pta-buttons">
        <button id="pta-submit-btn">提交代码</button>
        <button id="pta-report-error-btn" class="btn-secondary">答案报错</button>
      </div>
      <div id="pta-error-section" class="error-section" style="display: none;">
        <textarea id="pta-error-note" placeholder="请输入错误备注（可选）..."></textarea>
        <button id="pta-retry-btn" class="btn-retry">重新生成</button>
      </div>
      <div id="pta-status"></div>
    </div>
  `;
}

// 初始化选择题事件
function initChoiceQuestionEvents(floatWindow) {
  const batchBtn = floatWindow.querySelector('#pta-choice-batch-btn');
  const resultsEl = floatWindow.querySelector('#pta-choice-results');

  // 三态按钮：获取答案 → 获取中 → 提交
  if (batchBtn) {
    batchBtn.addEventListener('click', () => {
      if (batchBtn.textContent === '获取答案') {
        batchProcessChoiceQuestions(floatWindow);
      } else if (batchBtn.textContent === '提交') {
        submitChoiceAnswers(floatWindow);
      }
    });
  }

  const countEl = floatWindow.querySelector('#pta-choice-count');
  if (countEl && window.choiceQuestions) {
    countEl.textContent = `共 ${window.choiceQuestions.length} 题`;
  }

  // 数据已加载则渲染题目列表
  if (window.choiceQuestions && window.choiceQuestions.length > 0) {
    renderChoiceList(floatWindow);
  }
}

// 渲染题目列表到浮窗
function renderChoiceList(floatWindow) {
  const questions = window.choiceQuestions;
  const listEl = floatWindow.querySelector('#pta-choice-list');
  if (!listEl || !questions) return;

  const choiceLetter = (i) => String.fromCharCode(65 + i);
  let html = '';
  questions.forEach((q, idx) => {
    const options = q.choices.map((c, ci) => `<span style="font-size:12px;color:#999;margin-right:6px;">${choiceLetter(ci)}. ${c}</span>`).join('');
    html += `<div class="choice-item" data-question-id="${escapeHtml(String(q.id))}" style="padding:8px 10px;border-bottom:1px solid #f5f5f5;font-size:13px;">
      <div style="display:flex;align-items:flex-start;gap:6px;">
        <span style="color:#999;flex:0 0 auto;">${idx + 1}.</span>
        <span style="flex:1;min-width:0;">${escapeHtml(q.content)}</span>
        <span class="choice-answer" style="color:#32F08C;font-weight:bold;display:none;flex:0 0 auto;margin-left:8px;"></span>
      </div>
      <div style="margin-top:4px;padding-left:16px;display:flex;flex-wrap:wrap;gap:4px;">${options}</div>
    </div>`;
  });
  listEl.innerHTML = html;

  const batchBtn = floatWindow.querySelector('#pta-choice-batch-btn');
  if (batchBtn) batchBtn.disabled = false;
}

function getChoiceItemByQuestionId(listEl, questionId) {
  if (!listEl) return null;
  return listEl.querySelector(`.choice-item[data-question-id="${CSS.escape(String(questionId))}"]`);
}

// 分批获取选择题答案（不自动提交）
async function batchProcessChoiceQuestions(floatWindow) {
  const questions = window.choiceQuestions;
  if (!questions || questions.length === 0) return;

  const batchBtn = floatWindow.querySelector('#pta-choice-batch-btn');
  const progressEl = floatWindow.querySelector('#pta-choice-progress');
  const progressText = floatWindow.querySelector('#pta-choice-progress-text');
  const progressBar = floatWindow.querySelector('#pta-choice-progress-bar');
  const resultsEl = floatWindow.querySelector('#pta-choice-results');
  const statusEl = floatWindow.querySelector('#pta-choice-status');
  const listEl = floatWindow.querySelector('#pta-choice-list');

  const config = await new Promise(resolve => { getConfig(resolve); });
  const apiConfig = getActiveApiConfig(config);
  if (!config.aiEnabled || !apiConfig) {
    statusEl.style.display = 'block';
    statusEl.style.color = '#f44336';
    statusEl.style.background = '#ffebee';
    statusEl.textContent = 'AI 未启用或未配置 API 密钥';
    return;
  }

  const BATCH_SIZE = config.choiceBatchSize || 20;
  const total = questions.length;
  let current = 0;
  const allAnswers = {};

  // 按钮：获取中
  if (batchBtn) {
    batchBtn.textContent = '获取中';
    batchBtn.disabled = true;
  }
  progressEl.style.display = 'block';

  const choiceLetter = (i) => String.fromCharCode(65 + i);
  const promptTemplate = config.choicePrompt || defaultConfig.choicePrompt;

  for (let i = 0; i < total; i += BATCH_SIZE) {
    const batch = questions.slice(i, i + BATCH_SIZE);
    const promptItems = batch.map(q =>
      `题目${q.id}: ${q.content}\n选项: ${q.choices.map((c, ci) => choiceLetter(ci) + '. ' + c).join(', ')}`
    ).join('\n\n');

    const systemPrompt = promptTemplate.replace('{problem content}', promptItems);

    try {
      const messages = [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: '' }
      ];
      const raw = await generateAIResponse(apiConfig.url, apiConfig.key, apiConfig.model, messages);
      const jsonStr = raw.replace(/```[\w]*\n?/g, '').trim();
      const answers = JSON.parse(jsonStr);

      if (Array.isArray(answers)) {
        batch.forEach((q, idx) => {
          const answer = answers[idx] || '?';
          allAnswers[q.id] = answer;
          // 更新题目列表中的答案
          const item = getChoiceItemByQuestionId(listEl, q.id);
          if (item) {
            const answerSpan = item.querySelector('.choice-answer');
            if (answerSpan) {
              answerSpan.textContent = '→ ' + answer;
              answerSpan.style.display = 'inline';
            }
          }
        });
      } else {
        throw new Error('AI 返回格式不正确');
      }

      current += batch.length;
      const pct = Math.round((current / total) * 100);
      progressText.textContent = `${current}/${total}`;
      progressBar.style.width = pct + '%';
    } catch (e) {
      batch.forEach(q => {
        const item = getChoiceItemByQuestionId(listEl, q.id);
        if (item) {
          const answerSpan = item.querySelector('.choice-answer');
          if (answerSpan) {
            answerSpan.textContent = '→ 解析失败';
            answerSpan.style.color = '#f44336';
            answerSpan.style.display = 'inline';
          }
        }
      });
      current += batch.length;
      const pct = Math.round((current / total) * 100);
      progressText.textContent = `${current}/${total}`;
      progressBar.style.width = pct + '%';
    }
  }

  // 全部获取完毕，按钮变成提交
  window.choiceAllAnswers = allAnswers;
  if (batchBtn) {
    batchBtn.textContent = '提交';
    batchBtn.disabled = false;
    batchBtn.style.background = '#32F08C';
  }
  statusEl.style.display = 'block';
  statusEl.style.color = '#2196F3';
  statusEl.style.background = '#e3f2fd';
  statusEl.textContent = `答案获取完毕，共 ${total} 题，请检查后点击提交`;
}

// 手动提交选择题答案
async function submitChoiceAnswers(floatWindow) {
  const questions = window.choiceQuestions;
  const allAnswers = window.choiceAllAnswers;
  const examId = window.choiceExamId;
  const statusEl = floatWindow.querySelector('#pta-choice-status');
  const batchBtn = floatWindow.querySelector('#pta-choice-batch-btn');

  if (!examId || !allAnswers || Object.keys(allAnswers).length === 0) {
    statusEl.style.display = 'block';
    statusEl.style.color = '#f44336';
    statusEl.style.background = '#ffebee';
    statusEl.textContent = '没有可提交的答案';
    return;
  }

  if (batchBtn) {
    batchBtn.textContent = '提交中';
    batchBtn.disabled = true;
  }
  statusEl.style.display = 'block';
  statusEl.style.color = '#2196F3';
  statusEl.style.background = '#e3f2fd';
  statusEl.textContent = '正在提交答案...';

  try {
    const details = questions
      .filter(q => allAnswers[q.id])
      .map(q => ({
        problemId: '0',
        problemSetProblemId: q.id,
        multipleChoiceSubmissionDetail: {
          answer: allAnswers[q.id]
        }
      }));

    const submitBody = {
      problemType: 'MULTIPLE_CHOICE',
      details: details
    };

    const submitResponse = await pintiaFetch(`https://pintia.cn/api/exams/${examId}/exam-submissions`, {
      headers: {
        accept: 'application/json;charset=UTF-8',
        'content-type': 'application/json;charset=UTF-8',
        'x-lollipop': getLollipop(),
        'x-marshmallow': ''
      },
      method: 'POST',
      credentials: 'include',
      body: JSON.stringify(submitBody)
    });

    if (submitResponse.ok) {
      statusEl.style.color = '#32F08C';
      statusEl.style.background = '#e8f5e9';
      statusEl.textContent = `提交成功！共 ${details.length} 题`;
      if (batchBtn) {
        batchBtn.textContent = '已完成';
        batchBtn.disabled = true;
      }
    } else {
      const errData = await submitResponse.json().catch(() => ({}));
      statusEl.style.color = '#f44336';
      statusEl.style.background = '#ffebee';
      statusEl.textContent = `提交失败: ${submitResponse.status} ${errData.error?.message || ''}`;
      if (batchBtn) {
        batchBtn.textContent = '提交';
        batchBtn.disabled = false;
      }
    }
  } catch (e) {
    statusEl.style.color = '#f44336';
    statusEl.style.background = '#ffebee';
    statusEl.textContent = '提交失败: ' + e.message;
    if (batchBtn) {
      batchBtn.textContent = '提交';
      batchBtn.disabled = false;
    }
  }
}

// 创建选择题页面HTML
function createChoiceQuestionHTML() {
  return `
    <div class="pta-float-header">
      <span>PTA 答题辅助 - 选择题</span>
      <button class="pta-float-close">×</button>
    </div>
    <div class="pta-float-body">
      <div id="pta-choice-status" style="display:none;margin-bottom:12px;padding:10px;border-radius:6px;font-size:13px;text-align:center;"></div>
      <div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px;">
        <span id="pta-choice-count" style="font-size:14px;color:#666;">加载中...</span>
        <button id="pta-choice-batch-btn" class="btn-complete-all" disabled style="width:auto;padding:8px 24px;">获取答案</button>
      </div>
      <div id="pta-choice-progress" style="display:none;margin-bottom:12px;">
        <div style="display:flex;justify-content:space-between;font-size:12px;color:#999;margin-bottom:4px;">
          <span>处理进度</span>
          <span id="pta-choice-progress-text">0/0</span>
        </div>
        <div style="width:100%;height:6px;background:#e8e8e8;border-radius:3px;overflow:hidden;">
          <div id="pta-choice-progress-bar" style="width:0%;height:100%;background:#32F08C;border-radius:3px;transition:width 0.3s;"></div>
        </div>
      </div>
      <div id="pta-choice-results" style="max-height:400px;overflow-y:auto;">
        <div id="pta-choice-list" style="text-align:center;padding:20px;color:#999;">加载中...</div>
      </div>
    </div>
  `;
}

// 创建题目列表HTML
function createProblemListHTML() {
  return `
    <div class="pta-float-header">
      <span>PTA 答题辅助 - 题目列表</span>
      <button class="pta-float-close">×</button>
    </div>
    <div class="pta-float-body">
      <div class="pta-buttons">
        <button id="pta-complete-all-btn" class="btn-complete-all">一键完成所有题目</button>
        <label id="pta-filter-toggle" style="display:flex;align-items:center;gap:6px;font-size:13px;color:#666;cursor:pointer;margin-left:8px;">
          <input type="checkbox" id="pta-filter-checkbox" style="display:none;">
          <span id="pta-filter-slider" style="width:36px;height:20px;background:#e5e5e5;border-radius:10px;position:relative;transition:background 0.2s;flex-shrink:0;"></span>
          <span style="white-space:nowrap;">未完成</span>
        </label>
      </div>
      <div id="pta-problem-list" class="problem-list">
        <div class="problem-item">
          <span class="problem-index">加载中...</span>
          <span class="problem-title">正在获取题目列表...</span>
        </div>
      </div>
      <div id="pta-problem-list-status"></div>
      <div id="pta-complete-all-status" style="display: none;"></div>
    </div>
  `;
}

// 初始化题目列表事件
function initProblemListEvents(floatWindow) {
  const checkbox = floatWindow.querySelector('#pta-filter-checkbox');
  const slider = floatWindow.querySelector('#pta-filter-slider');

  function updateSlider() {
    if (checkbox.checked) {
      slider.style.background = '#32F08C';
      slider.innerHTML = '<span style="position:absolute;top:2px;right:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:0.2s;"></span>';
    } else {
      slider.style.background = '#e5e5e5';
      slider.innerHTML = '<span style="position:absolute;top:2px;left:2px;width:16px;height:16px;background:#fff;border-radius:50%;transition:0.2s;"></span>';
    }
  }
  updateSlider();

  checkbox.addEventListener('change', () => {
    updateSlider();
    applyProblemFilter();
  });
}

function applyProblemFilter() {
  const checkbox = document.getElementById('pta-filter-checkbox');
  if (!checkbox) return;
  const onlyIncomplete = checkbox.checked;
  const items = document.querySelectorAll('#pta-problem-list .problem-item');
  let visibleCount = 0;
  items.forEach(item => {
    const badge = item.querySelector('.problem-status');
    const isAccepted = badge && badge.textContent === '已通过';
    if (onlyIncomplete && isAccepted) {
      item.style.display = 'none';
    } else {
      item.style.display = '';
      visibleCount++;
    }
  });
  const statusDiv = document.getElementById('pta-problem-list-status');
  if (statusDiv && visibleCount > 0 && onlyIncomplete) {
    statusDiv.textContent = statusDiv.textContent.replace(/，显示 \d+ 题/, '') + `，显示 ${visibleCount} 题`;
  } else if (statusDiv) {
    statusDiv.textContent = statusDiv.textContent.replace(/，显示 \d+ 题/, '');
  }
}

// 初始化代码编辑器事件
function initCodeEditorEvents(floatWindow) {
  const codeInput = floatWindow.querySelector('#pta-code-input');
  const codeHighlight = floatWindow.querySelector('#pta-code-highlight');

  function doHighlight() {
    const grammar = Prism.languages.c;
    const html = Prism.highlight(codeInput.value, grammar, 'c');
    codeHighlight.innerHTML = html;
    codeHighlight.classList.add('line-numbers');
  }

  codeInput.addEventListener('input', doHighlight);

  // 同步滚动
  codeInput.addEventListener('scroll', function() {
    codeHighlight.parentElement.scrollTop = codeInput.scrollTop;
    codeHighlight.parentElement.scrollLeft = codeInput.scrollLeft;
  });

  // 提交按钮事件
  const submitBtn = floatWindow.querySelector('#pta-submit-btn');
  const statusDiv = floatWindow.querySelector('#pta-status');

  submitBtn.addEventListener('click', async () => {
    const code = codeInput.value.trim();
    if (!code) {
      statusDiv.textContent = '请输入代码';
      statusDiv.className = 'error';
      return;
    }

    submitBtn.disabled = true;
    statusDiv.textContent = '提交中...';
    statusDiv.className = '';

    const result = await submitCode(code);

    submitBtn.disabled = false;

    if (result.success) {
      statusDiv.textContent = '提交成功！';
      statusDiv.className = 'success';

      // 轮询提交结果
      if (result.examId && result.submissionId) {
        pollSubmissionResult(statusDiv, result.examId, result.submissionId);
      }
    } else {
      statusDiv.textContent = result.error || '提交失败';
      statusDiv.className = 'error';
      
      // 显示右上角提示
      showSubmissionErrorHint();
    }
  });

  // 答案报错按钮事件
  const reportErrorBtn = floatWindow.querySelector('#pta-report-error-btn');
  const errorSection = floatWindow.querySelector('#pta-error-section');

  reportErrorBtn.addEventListener('click', () => {
    errorSection.style.display = errorSection.style.display === 'none' ? 'block' : 'none';
  });

  // 重新生成按钮事件
  const retryBtn = floatWindow.querySelector('#pta-retry-btn');
  const errorNoteInput = floatWindow.querySelector('#pta-error-note');

  retryBtn.addEventListener('click', async () => {
    const errorNote = errorNoteInput.value.trim();

    retryBtn.disabled = true;
    retryBtn.textContent = '重新生成中...';
    statusDiv.textContent = '正在重新生成代码...';
    statusDiv.className = '';

    // 调用 AI 重新生成
    await checkAndUseAI(currentProblemText, true, errorNote);

    retryBtn.disabled = false;
    retryBtn.textContent = '重新生成';
    statusDiv.textContent = '代码已重新生成！';
    statusDiv.className = 'success';

    // 隐藏错误备注区域
    errorSection.style.display = 'none';
    errorNoteInput.value = '';
  });
}

// 移除浮动窗口
function removeFloatingWindow() {
  const floatWindow = document.getElementById('pta-helper-float');
  if (floatWindow) {
    floatWindow.remove();
  }
}

// 拖拽功能
function makeDraggable(element) {
  const header = element.querySelector('.pta-float-header');
  let isDragging = false;
  let currentX;
  let currentY;
  let initialX;
  let initialY;
  let xOffset = 0;
  let yOffset = 0;

  header.addEventListener('mousedown', dragStart);
  document.addEventListener('mouseup', dragEnd);
  document.addEventListener('mousemove', drag);

  function dragStart(e) {
    initialX = e.clientX - xOffset;
    initialY = e.clientY - yOffset;
    if (e.target === header || e.target.tagName === 'SPAN') {
      isDragging = true;
    }
  }

  function dragEnd() {
    initialX = currentX;
    initialY = currentY;
    isDragging = false;
  }

  function drag(e) {
    if (isDragging) {
      e.preventDefault();
      currentX = e.clientX - initialX;
      currentY = e.clientY - initialY;
      xOffset = currentX;
      yOffset = currentY;

      element.style.transform = `translate(${currentX}px, ${currentY}px)`;
    }
  }
}

// 获取 x-lollipop token
function getLollipop() {
  let lollipop = localStorage.getItem('x-lollipop') || '';
  if (!lollipop) {
    const cookieMatch = document.cookie.match(/x-lollipop=([^;]+)/);
    if (cookieMatch) {
      lollipop = cookieMatch[1];
    }
  }
  return lollipop;
}

// 提交代码（带重试机制）
async function submitCode(code, problemSetId = null, problemSetProblemId = null, _retryDepth = 0) {
  const MAX_RETRY = 10;
  try {
    let url = window.location.href;
    let localProblemSetId = problemSetId;
    let localProblemSetProblemId = problemSetProblemId;
    
    if (!localProblemSetId || !localProblemSetProblemId) {
      // 尝试从URL中提取参数
      const problemMatch = url.match(/problemSetProblemId=(\d+)/);
      localProblemSetProblemId = problemMatch ? problemMatch[1] : null;
      
      const problemSetMatch = url.match(/\/problem-sets\/(\d+)/);
      localProblemSetId = problemSetMatch ? problemSetMatch[1] : null;
      
      // 如果URL中没有参数，尝试从提交结果页面获取
      if (!localProblemSetProblemId || !localProblemSetId) {
        // 检查是否是提交结果页面
        const submissionMatch = url.match(/\/exam\/submissions\/(\d+)/);
        if (submissionMatch && window.currentSubmissionData) {
          localProblemSetProblemId = window.currentSubmissionData.submission.problemSetProblemId;
          localProblemSetId = window.currentSubmissionData.submission.problemSetId;
        }
      }
      
      if (!localProblemSetProblemId || !localProblemSetId) {
        return { success: false, error: '无法获取页面信息' };
      }
    }
    
    // 获取 exam ID
    const examId = await getExamId(localProblemSetId);
    if (!examId) {
      return { success: false, error: '无法获取 exam ID' };
    }
    
    const submitUrl = `https://pintia.cn/api/exams/${examId}/exam-submissions`;
    
    const problemType = getProblemType();
    const detailKey = problemType === 'CODE_COMPLETION' ? 'codeCompletionSubmissionDetail' : 'programmingSubmissionDetail';
    const body = {
      problemType: problemType,
      details: [{
        problemId: '0',
        problemSetProblemId: localProblemSetProblemId,
        [detailKey]: {
          program: code,
          compiler: 'GCC'
        }
      }]
    };
    
    const response = await pintiaFetch(submitUrl, {
      headers: {
        'accept': 'application/json;charset=UTF-8',
        'accept-language': 'zh-CN',
        'content-type': 'application/json;charset=UTF-8',
        'x-lollipop': getLollipop(),
        'x-marshmallow': ''
      },
      referrer: url,
      body: JSON.stringify(body),
      method: 'POST',
      mode: 'cors',
      credentials: 'include'
    });
    
    const result = await response.json();
    
    if (response.ok) {
      const submissionId = typeof result === 'object' && result.submissionId 
        ? result.submissionId 
        : typeof result === 'string' 
          ? result 
          : null;
      return { success: true, data: result, examId: examId, submissionId: submissionId };
    } else if ((response.status === 429 || response.status >= 500) && _retryDepth < MAX_RETRY) {
      const delay = 5000 + Math.random() * 5000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return submitCode(code, localProblemSetId, localProblemSetProblemId, _retryDepth + 1);
    } else {
      return { success: false, error: result.message || '提交失败' };
    }
  } catch (error) {
    if (_retryDepth < MAX_RETRY) {
      const delay = 5000 + Math.random() * 5000;
      await new Promise(resolve => setTimeout(resolve, delay));
      return submitCode(code, localProblemSetId, localProblemSetProblemId, _retryDepth + 1);
    }
    return { success: false, error: error.message || '网络错误' };
  }
}

// 轮询提交结果（共10次，间隔5秒）
async function pollSubmissionResult(statusDiv, examId, submissionId) {
  const MAX_ATTEMPTS = 10;
  const INTERVAL_MS = 5000;

  const resultColors = {
    'ACCEPTED': '#32F08C',
    'PARTIAL_ACCEPTED': '#ff9800',
    'WRONG_ANSWER': '#f44336',
    'COMPILE_ERROR': '#f44336',
    'SEGMENTATION_FAULT': '#f44336',
    'RUNTIME_ERROR': '#f44336',
    'WAITING': '#999',
    'RUNNING': '#2196F3',
    'PRESENTATION_ERROR': '#ff9800',
    'TIME_LIMIT_EXCEEDED': '#f44336',
    'MEMORY_LIMIT_EXCEEDED': '#f44336',
    'OUTPUT_LIMIT_EXCEEDED': '#f44336'
  };

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      if (i === 0) {
        statusDiv.textContent = '正在获取结果...';
      } else {
        statusDiv.textContent = `判题中 (${i}/${MAX_ATTEMPTS - 1})...`;
        await new Promise(resolve => setTimeout(resolve, INTERVAL_MS));
      }

      const url = `https://pintia.cn/api/exams/${examId}/submissions/${submissionId}`;
      const response = await pintiaFetch(url, {
        headers: {
          accept: 'application/json;charset=UTF-8',
          'content-type': 'application/json;charset=UTF-8',
          'x-lollipop': getLollipop(),
          'x-marshmallow': ''
        },
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) {
        console.log(`轮询提交结果 [${i + 1}/${MAX_ATTEMPTS}] HTTP ${response.status}`);
        continue;
      }

      const data = await response.json();
      console.log(`提交结果 [${i + 1}/${MAX_ATTEMPTS}]:`, data);

      const sub = data?.submission;
      const status = sub?.status;
      if (!status) continue;

      // 还在等待/判题中，继续轮询
      if (status === 'WAITING' || status === 'RUNNING' || status === 'JUDGING' || status === 'PROGRAMMING_JUDGING') {
        statusDiv.textContent = status === 'WAITING' ? '排队等待中...' : '判题中...';
        statusDiv.className = '';
        continue;
      }

      // 判题结束，解析测试点结果
      const jrc = sub?.judgeResponseContents?.[0];
      const judgeResult = jrc?.programmingJudgeResponseContent || jrc?.codeCompletionJudgeResponseContent;
      const testcases = judgeResult?.testcaseJudgeResults || {};

      // 编译错误特殊处理
      if (status === 'COMPILE_ERROR') {
        const compileLog = judgeResult?.compilationResult?.log || '';
        statusDiv.innerHTML = `<span style="color:${resultColors[status]};font-weight:bold;">COMPILE_ERROR</span>`;
        if (compileLog) {
          console.log('编译错误日志:', compileLog);
        }
        statusDiv.className = 'error';
        return;
      }

      // 统计测试点
      const entries = Object.values(testcases);
      const total = entries.length;
      const passed = entries.filter(t => t.result === 'ACCEPTED').length;

      let displayStatus = status;
      if (total > 0) {
        displayStatus = `${passed}/${total} ${status}`;
      }

      statusDiv.innerHTML = `<span style="color:${resultColors[status] || '#f44336'};font-weight:bold;">${displayStatus}</span>`;
      statusDiv.className = total > 0 && passed === total ? 'success' : (status === 'PARTIAL_ACCEPTED' ? '' : 'error');
      return;
    } catch (e) {
      console.log(`轮询提交结果 [${i + 1}/${MAX_ATTEMPTS}] 出错:`, e.message);
    }
  }

  statusDiv.textContent = '提交成功（判题超时）';
  statusDiv.className = 'success';
}

// 轮询提交结果并更新按钮文字
async function pollForButtonResult(actionBtn, examId, submissionId) {
  const MAX_ATTEMPTS = 10;
  const INTERVAL_MS = 5000;

  const colors = {
    'ACCEPTED': '#32F08C',
    'PARTIAL_ACCEPTED': '#ff9800',
    'WRONG_ANSWER': '#f44336',
    'COMPILE_ERROR': '#f44336',
    'SEGMENTATION_FAULT': '#f44336'
  };

  const shortNames = {
    'ACCEPTED': 'AC',
    'PARTIAL_ACCEPTED': 'PA',
    'WRONG_ANSWER': 'WA',
    'COMPILE_ERROR': 'CE',
    'SEGMENTATION_FAULT': 'SF'
  };

  actionBtn.textContent = '等待结果';
  actionBtn.style.background = '#ff9800';
  actionBtn.disabled = true;

  for (let i = 0; i < MAX_ATTEMPTS; i++) {
    try {
      if (i > 0) {
        await new Promise(resolve => setTimeout(resolve, INTERVAL_MS));
      }

      const url = `https://pintia.cn/api/exams/${examId}/submissions/${submissionId}`;
      const response = await pintiaFetch(url, {
        headers: {
          accept: 'application/json;charset=UTF-8',
          'content-type': 'application/json;charset=UTF-8',
          'x-lollipop': getLollipop(),
          'x-marshmallow': ''
        },
        method: 'GET',
        credentials: 'include'
      });

      if (!response.ok) continue;

      const data = await response.json();
      const sub = data?.submission;
      const status = sub?.status;
      if (!status) continue;

      if (status === 'WAITING' || status === 'RUNNING' || status === 'JUDGING' || status === 'PROGRAMMING_JUDGING') {
        actionBtn.textContent = status === 'WAITING' ? '判题中' : '判题中';
        actionBtn.style.background = '#999';
        continue;
      }

      const jrc = sub?.judgeResponseContents?.[0];
      const judgeResult = jrc?.programmingJudgeResponseContent || jrc?.codeCompletionJudgeResponseContent;
      const testcases = judgeResult?.testcaseJudgeResults || {};
      const entries = Object.values(testcases);
      const total = entries.length;
      const passed = entries.filter(t => t.result === 'ACCEPTED').length;

      const short = shortNames[status] || status;
      const text = total > 0 ? `${passed}/${total} ${short}` : short;

      actionBtn.textContent = text;
  actionBtn.style.background = colors[status] || '#999';
  actionBtn.disabled = false;
  return status;
    } catch (e) {
      // 继续轮询
    }
  }

  actionBtn.textContent = '超时';
  actionBtn.style.background = '#999';
  actionBtn.disabled = false;
  return 'TIMEOUT';
}

// 监听 URL 变化
let currentUrl = window.location.href;

// 使用 setInterval 作为基础检测
setInterval(() => {
  checkUrlChange();
}, 1000);

// 监听浏览器前进/后退事件
window.addEventListener('popstate', function() {
  //console.log('=== 检测到 popstate 事件 ===');
  checkUrlChange();
});

// 监听哈希变化事件
window.addEventListener('hashchange', function() {
  //console.log('=== 检测到 hashchange 事件 ===');
  checkUrlChange();
});

// 统一的 URL 变化检查函数
function checkUrlChange() {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    debugLog('URL 变化', {
      url: currentUrl,
      isProgrammingListPage: isProgrammingListPage(),
      isProgrammingDetailPage: isProgrammingDetailPage(),
      isChoiceQuestionPage: isChoiceQuestionPage(),
      isSubmissionResultPage: isSubmissionResultPage()
    });
    // console.log('是否是提交结果页面:', isSubmissionResultPage());
    // console.log('================');
    checkAutoPopup();
    
    // 如果离开提交结果页面，关闭结果分析弹窗
    if (!isSubmissionResultPage()) {
      const resultFloatWindow = document.getElementById('pta-helper-result-float');
      if (resultFloatWindow) {
        resultFloatWindow.remove();
      }
    }
  }
}

// 页面加载完成后立即检测
window.addEventListener('load', function() {
  //console.log('=== 页面加载完成 ===');
  checkUrlChange();
});

// 初始检查
checkAutoPopup();
checkGlobalVersion();

// 检查全局版本更新（遮罩弹窗）
async function checkGlobalVersion() {
  try {
    const result = await new Promise(resolve => {
      chrome.storage.local.get(['ignoredVersion'], resolve);
    });
    const ignoredVersion = String(result.ignoredVersion || '0.0.0').trim();

    let verData = null;

    // 尝试 GitHub
    try {
      const resp = await fetch('https://raw.githubusercontent.com/lmengx/fuckpta/main/ver.json', { cache: 'no-cache' });
      if (resp.ok) verData = await resp.json();
    } catch (e) { /* fallback */ }

    // GitHub 失败则尝试 Gitee
    if (!verData) {
      try {
        const resp = await fetch('https://gitee.com/lmx12330/fuckpta/raw/main/ver.json', { cache: 'no-cache' });
        if (resp.ok) verData = await resp.json();
      } catch (e) { /* fallback */ }
    }

    if (!verData || !verData.version) return;

    const latestVersion = String(verData.version).trim();
    const currentVersion = typeof __PLUGIN_VERSION__ !== 'undefined' ? __PLUGIN_VERSION__ : '0.0.0';

    // 当前版本已经是最新，不需要弹窗
    if (currentVersion === latestVersion) return;
    if (compareVersionStr(currentVersion, latestVersion) >= 0) return;
    // 用户已忽略此版本（或更高版本）
    if (compareVersionStr(ignoredVersion, latestVersion) >= 0) return;

    showVersionOverlay(latestVersion, verData.changes || []);
  } catch (e) {
    // 静默失败
  }
}

function compareVersionStr(v1, v2) {
  const p1 = v1.split('.').map(Number);
  const p2 = v2.split('.').map(Number);
  const len = Math.max(p1.length, p2.length);
  for (let i = 0; i < len; i++) {
    const a = p1[i] || 0;
    const b = p2[i] || 0;
    if (a < b) return -1;
    if (a > b) return 1;
  }
  return 0;
}

function showVersionOverlay(latestVersion, changes) {
  const overlay = document.createElement('div');
  overlay.id = 'pta-version-overlay';
  overlay.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.6);display:flex;align-items:center;justify-content:center;z-index:9999999;backdrop-filter:blur(4px);';

  const changesHtml = changes.length
    ? '<ul style="margin-top:12px;padding-left:20px;font-size:13px;color:#888;line-height:1.8;text-align:left;">' + changes.map(c => '<li style="list-style:disc;">' + escapeHtml(c) + '</li>').join('') + '</ul>'
    : '';

  overlay.innerHTML = '<div style="background:#fff;border-radius:16px;padding:40px;width:460px;max-width:90%;box-shadow:0 8px 40px rgba(0,0,0,0.25);text-align:center;animation:fadeInUp 0.4s ease;">'
    + '<h2 style="font-size:22px;color:#1a1a1a;margin:0 0 8px;">🎉 发现新版本</h2>'
    + '<p style="font-size:32px;font-weight:700;color:#32F08C;margin:8px 0;">v' + escapeHtml(latestVersion) + '</p>'
    + changesHtml
    + '<div style="display:flex;gap:12px;margin-top:24px;justify-content:center;">'
    + '<button id="pta-ver-update-btn" style="padding:12px 32px;border:none;border-radius:8px;background:#32F08C;color:#fff;font-size:15px;font-weight:600;cursor:pointer;">前往更新</button>'
    + '<button id="pta-ver-ignore-btn" style="padding:12px 32px;border:1px solid #d9d9d9;border-radius:8px;background:#fff;color:#666;font-size:15px;cursor:pointer;">忽略此版本</button>'
    + '</div></div>';

  // 动画样式
  const style = document.createElement('style');
  style.textContent = '@keyframes fadeInUp{from{opacity:0;transform:translateY(30px);}to{opacity:1;transform:translateY(0);}}';
  overlay.appendChild(style);

  document.body.appendChild(overlay);

  overlay.querySelector('#pta-ver-update-btn').addEventListener('click', () => {
    window.open('https://gitee.com/lmx12330/fuckpta/releases/', '_blank');
  });

  overlay.querySelector('#pta-ver-ignore-btn').addEventListener('click', () => {
    chrome.storage.local.set({ ignoredVersion: latestVersion });
    overlay.remove();
  });
}

// 提取提交结果页面内容
async function extractSubmissionResult() {
  if (!isSubmissionResultPage()) {
    return null;
  }
  
  try {
    const url = window.location.href;
    
    // 从URL中提取提交ID
    const submissionMatch = url.match(/\/exam\/submissions\/(\d+)/);
    if (!submissionMatch) {
      showToast('无法从URL中提取提交ID', 'error');
      return null;
    }
    
    const submissionId = submissionMatch[1];
    
    // 构建API URL
    const apiUrl = `https://pintia.cn/api/submissions/${submissionId}?`;
    
    // 发送fetch请求
    const response = await fetch(apiUrl, {
      headers: {
        accept: 'application/json;charset=UTF-8',
        'accept-language': 'zh-CN',
        'content-type': 'application/json;charset=UTF-8',
        priority: 'u=1, i',
        'sec-ch-ua': `"Chromium";v="146", "Not-A.Brand";v="24", "Microsoft Edge";v="146"`,
        'sec-ch-ua-mobile': '?0',
        'sec-ch-ua-platform': '"Windows"',
        'sec-fetch-dest': 'empty',
        'sec-fetch-mode': 'cors',
        'sec-fetch-site': 'same-origin',
        'x-lollipop': getLollipop(),
        'x-marshmallow': ''
      },
      referrer: url,
      body: null,
      method: 'GET',
      mode: 'cors',
      credentials: 'include'
    });
    
    if (!response.ok) {
      showToast(`API请求失败: ${response.status} ${response.statusText}`, 'error');
      return null;
    }
    
    // 获取响应数据
    const submissionData = await response.json();
    
    // 保存提交结果数据
    window.currentSubmissionData = submissionData;
    
    // 在提交结果页面显示浮动窗口
    createSubmissionResultWindow();
    
    return submissionData;
  } catch (error) {
    showToast(`获取提交结果数据时出错: ${error.message}`, 'error');
    return null;
  }
}

// 创建提交结果页面的浮动窗口
function createSubmissionResultWindow() {
  // 检查是否已经存在
  if (document.getElementById('pta-helper-result-float')) {
    return;
  }

  // 加载Prism.js
  loadPrism();

  // 创建浮动窗口容器
  const floatWindow = document.createElement('div');
  floatWindow.id = 'pta-helper-result-float';
  floatWindow.innerHTML = `
    <div class="pta-float-header">
      <span>PTA 答题辅助 - 结果分析</span>
      <button class="pta-float-close">×</button>
    </div>
    <div class="pta-float-body">
      <div class="pta-result-info">
        <div id="pta-result-status"></div>
      </div>
      <div class="pta-buttons">
        <button id="pta-get-answer-btn">获取答案</button>
      </div>
      <div id="pta-ai-result" style="display: none;">
        <h4>AI 生成的答案</h4>
        <div class="code-editor-container">
          <pre><code id="pta-ai-code-highlight" class="language-c"></code></pre>
          <textarea id="pta-ai-code" placeholder="AI 生成的代码将显示在这里..." readonly></textarea>
        </div>
        <div class="pta-buttons">
          <button id="pta-copy-btn">一键复制</button>
          <button id="pta-submit-btn">一键提交</button>
        </div>
      </div>
      <div id="pta-status"></div>
    </div>
  `;

  // 添加样式
  const style = document.createElement('style');
  style.textContent = `
    #pta-helper-result-float {
      position: fixed;
      top: 50px;
      right: 20px;
      width: 500px;
      max-height: 80vh;
      background: white;
      border-radius: 8px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.15);
      z-index: 999999;
      font-family: Arial, sans-serif;
      overflow-y: auto;
    }
    .pta-float-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 12px 16px;
      background: #4CAF50;
      color: white;
      border-radius: 8px 8px 0 0;
      cursor: move;
      position: sticky;
      top: 0;
      z-index: 1;
    }
    .pta-float-header span {
      font-weight: bold;
      font-size: 16px;
    }
    .pta-float-close {
      background: none;
      border: none;
      color: white;
      font-size: 24px;
      cursor: pointer;
      padding: 0;
      width: 32px;
      height: 32px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    .pta-float-close:hover {
      background: rgba(255,255,255,0.2);
      border-radius: 4px;
    }
    .pta-float-body {
      padding: 20px;
    }
    .pta-result-info {
      margin-bottom: 20px;
    }
    #pta-result-status {
      font-size: 14px;
      line-height: 1.5;
    }
    .pta-buttons {
      display: flex;
      flex-direction: column;
      gap: 8px;
      margin-top: 15px;
    }
    #pta-get-answer-btn, #pta-copy-btn, #pta-submit-btn {
      flex: 1;
      padding: 12px;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 14px;
      font-weight: bold;
    }
    #pta-get-answer-btn {
      background: #4CAF50;
      color: white;
    }
    #pta-get-answer-btn:hover {
      background: #45a049;
    }
    #pta-get-answer-btn:disabled {
      background: #ccc;
      cursor: not-allowed;
    }
    #pta-copy-btn {
      background: #2196F3;
      color: white;
    }
    #pta-copy-btn:hover {
      background: #1976D2;
    }
    #pta-submit-btn {
      background: #ff9800;
      color: white;
    }
    #pta-submit-btn:hover {
      background: #f57c00;
    }
    #pta-ai-result {
      margin-top: 20px;
    }
    #pta-ai-result h4 {
      margin-top: 0;
      margin-bottom: 10px;
      color: #333;
    }
    .code-editor-container {
      position: relative;
      width: 100%;
      height: 300px;
      border: 1px solid #ddd;
      border-radius: 4px;
      overflow: hidden;
    }
    .code-editor-container pre {
      position: absolute;
      top: 0;
      left: 0;
      margin: 0;
      padding: 12px;
      width: 100%;
      height: 100%;
      background: transparent;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
      overflow: auto;
      pointer-events: none;
      white-space: pre;
    }
    .code-editor-container code {
      font-family: 'Courier New', monospace;
    }
    #pta-ai-code {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      padding: 12px;
      border: none;
      background: transparent;
      color: transparent;
      font-family: 'Courier New', monospace;
      font-size: 14px;
      line-height: 1.5;
      resize: none;
      box-sizing: border-box;
      z-index: 1;
      white-space: pre;
      overflow: auto;
    }
    #pta-status {
      margin-top: 15px;
      font-size: 13px;
      text-align: center;
      min-height: 20px;
      padding: 8px;
      border-radius: 4px;
    }
    #pta-status.success {
      color: #4CAF50;
      background: #e8f5e9;
    }
    #pta-status.error {
      color: #f44336;
      background: #ffebee;
    }
  `;
  document.head.appendChild(style);
  document.body.appendChild(floatWindow);

  // 添加代码高亮功能
  const aiCodeInput = floatWindow.querySelector('#pta-ai-code');
  const aiCodeHighlight = floatWindow.querySelector('#pta-ai-code-highlight');

  // 同步滚动
  aiCodeInput.addEventListener('scroll', function() {
    aiCodeHighlight.parentElement.scrollTop = aiCodeInput.scrollTop;
    aiCodeHighlight.parentElement.scrollLeft = aiCodeInput.scrollLeft;
  });

  // 关闭按钮事件
  floatWindow.querySelector('.pta-float-close').addEventListener('click', () => {
    floatWindow.remove();
  });

  // 获取答案按钮事件
  const getAnswerBtn = floatWindow.querySelector('#pta-get-answer-btn');
  const aiResultSection = floatWindow.querySelector('#pta-ai-result');
  const statusDiv = floatWindow.querySelector('#pta-status');

  getAnswerBtn.addEventListener('click', async () => {
    if (!window.currentSubmissionData) {
      statusDiv.textContent = '未找到提交结果数据';
      statusDiv.className = 'error';
      return;
    }

    getAnswerBtn.disabled = true;
    getAnswerBtn.textContent = '获取中...';
    statusDiv.textContent = '正在获取答案...';
    statusDiv.className = '';

    try {
      // 提取必要信息
      let resCode = '';
      let errorType = '';
      let compilerMsg = '';
      let dataTip = '';
      
      // 提取源码
      if (window.currentSubmissionData && window.currentSubmissionData.submission && window.currentSubmissionData.submission.submissionDetails && window.currentSubmissionData.submission.submissionDetails.length > 0) {
        const detail = window.currentSubmissionData.submission.submissionDetails[0];
        if (detail.programmingSubmissionDetail && detail.programmingSubmissionDetail.program) {
          resCode = detail.programmingSubmissionDetail.program;
        } else if (detail.codeCompletionSubmissionDetail && detail.codeCompletionSubmissionDetail.program) {
          resCode = detail.codeCompletionSubmissionDetail.program;
        }
      }
      
      // 提取错误类型
      if (window.currentSubmissionData && window.currentSubmissionData.submission && window.currentSubmissionData.submission.status) {
        errorType = window.currentSubmissionData.submission.status;
      }
      
      // 提取错误信息
      if (window.currentSubmissionData && window.currentSubmissionData.submission && window.currentSubmissionData.submission.judgeResponseContents && window.currentSubmissionData.submission.judgeResponseContents.length > 0) {
        const judgeResponse = window.currentSubmissionData.submission.judgeResponseContents[0];
        const judgeContent = judgeResponse.programmingJudgeResponseContent || judgeResponse.codeCompletionJudgeResponseContent;
        if (judgeContent && judgeContent.compilationResult) {
          compilerMsg = judgeContent.compilationResult.log || '';
        }
      }
      
      // 提取测试点情况
      if (window.currentSubmissionData && window.currentSubmissionData.submission) {
        const hints = window.currentSubmissionData.submission.hints || {};
        const judgeResponse = window.currentSubmissionData.submission.judgeResponseContents && window.currentSubmissionData.submission.judgeResponseContents.length > 0 ? 
          window.currentSubmissionData.submission.judgeResponseContents[0] : null;
        const judgeContent = judgeResponse ? (judgeResponse.programmingJudgeResponseContent || judgeResponse.codeCompletionJudgeResponseContent) : null;
        const testcaseResults = judgeContent ? (judgeContent.testcaseJudgeResults || {}) : {};
        
        const testcaseInfo = [];
        
        // 遍历所有测试点
        for (const key in hints) {
          if (hints.hasOwnProperty(key)) {
            const testcase = {
              "序号": key,
              "提示": hints[key],
              "结果": testcaseResults[key] ? testcaseResults[key].result : "未知"
            };
            testcaseInfo.push(testcase);
          }
        }
        
        dataTip = JSON.stringify(testcaseInfo, null, 2);
      }

      // 获取题目信息
      const problemSetProblemId = window.currentSubmissionData.submission.problemSetProblemId;
      const problemSetId = window.currentSubmissionData.submission.problemSetId;
      
      if (!problemSetProblemId || !problemSetId) {
        statusDiv.textContent = '无法获取题目信息';
        statusDiv.className = 'error';
        getAnswerBtn.disabled = false;
        getAnswerBtn.textContent = '获取答案';
        return;
      }

      // 构建API URL获取题目信息
      const problemApiUrl = `https://pintia.cn/api/problem-sets/${problemSetId}/exam-problems/${problemSetProblemId}`;
      const problemResponse = await fetch(problemApiUrl, {
        headers: {
          accept: 'application/json;charset=UTF-8',
          'accept-language': 'zh-CN',
          'content-type': 'application/json;charset=UTF-8',
          'x-lollipop': getLollipop(),
          'x-marshmallow': ''
        },
        method: 'GET',
        credentials: 'include'
      });

      if (!problemResponse.ok) {
        statusDiv.textContent = '获取题目信息失败';
        statusDiv.className = 'error';
        getAnswerBtn.disabled = false;
        getAnswerBtn.textContent = '获取答案';
        return;
      }

      const problemData = await problemResponse.json();
      let problemContent = '';
      if (problemData && problemData.problemSetProblem) {
        problemContent = problemData.problemSetProblem.content || problemData.problemSetProblem.description || '';
      }

      // 获取配置
      getConfig(async function(config) {
        // 获取活动的 API 配置
        const apiConfig = getActiveApiConfig(config);
        
        if (!config.aiEnabled || !apiConfig) {
          statusDiv.textContent = 'AI 未启用或未配置 API 密钥';
          statusDiv.className = 'error';
          getAnswerBtn.disabled = false;
          getAnswerBtn.textContent = '获取答案';
          return;
        }

        // 构建错误提示词
        let errorPrompt = config.aiErrorPrompt || `你是专业的编程题 AC 生成器。
语言：{language}
错误类型：{error_type}
编译器提示：{compiler_msg}
测试点提示：{data_tip}

请直接输出**能 AC 的完整代码**，不要解释、不要说明、不要多余内容。
严格遵守格式：换行、空格、缩进必须完全符合题目要求。
题目如下：
{problem content}
错误源码如下：
{res_code}`;

        // 替换占位符
        const aiContent = errorPrompt
          .replace('{language}', config.language)
          .replace('{error_type}', errorType)
          .replace('{compiler_msg}', compilerMsg)
          .replace('{data_tip}', dataTip)
          .replace('{problem content}', problemContent)
          .replace('{res_code}', resCode);

        // 构建消息
        let messages = [
          {
            role: 'system',
            content: aiContent
          }
        ];
        
        debugLog('发给 AI 的内容（纠错功能）', messages);

        // 流式输出
        let aiResponse = '';
        aiResultSection.style.display = 'block';

        await streamAIResponse(apiConfig.url, apiConfig.key, apiConfig.model, messages, 
          (() => {
            const grammar = Prism.languages.c;
            let lastRender = 0;
            let pending = false;
            return (chunk) => {
              aiResponse += chunk;
              if (!aiCodeInput || !aiCodeHighlight) return;
              const cleanCode = aiResponse.replace(/```[\w]*\n?/g, '').trim();
              aiCodeInput.value = cleanCode;
              const now = Date.now();
              const interval = cleanCode.length > 5000 ? 500 : 300;
              if (now - lastRender >= interval) {
                aiCodeHighlight.innerHTML = Prism.highlight(cleanCode, grammar, 'c');
                aiCodeHighlight.classList.add('line-numbers');
                lastRender = now;
                pending = false;
              } else if (!pending) {
                pending = true;
                const delay = interval - (now - lastRender);
                setTimeout(() => {
                  if (!aiCodeHighlight || !document.contains(aiCodeHighlight)) return;
                  const c = aiResponse.replace(/```[\w]*\n?/g, '').trim();
                  aiCodeHighlight.innerHTML = Prism.highlight(c, grammar, 'c');
                  aiCodeHighlight.classList.add('line-numbers');
                  lastRender = Date.now();
                  pending = false;
                }, delay);
              }
            };
          })(),
          () => {
            // flush
            if (aiCodeHighlight) {
              const cleanCode = aiResponse.replace(/```[\w]*\n?/g, '').trim();
              aiCodeHighlight.innerHTML = Prism.highlight(cleanCode, Prism.languages.c, 'c');
              aiCodeHighlight.classList.add('line-numbers');
            }
            // 完成时的处理
            debugLog('AI 返回的内容（纠错功能）', aiResponse);
            statusDiv.textContent = '答案获取成功！';
            statusDiv.className = 'success';
            getAnswerBtn.disabled = false;
            getAnswerBtn.textContent = '获取答案';
          },
          (error) => {
            statusDiv.textContent = 'AI 调用失败: ' + (error.message || '未知错误');
            statusDiv.className = 'error';
            getAnswerBtn.disabled = false;
            getAnswerBtn.textContent = '获取答案';
          }
        );

        if (!aiResponse) {
          statusDiv.textContent = 'AI 未返回有效结果';
          statusDiv.className = 'error';
          getAnswerBtn.disabled = false;
          getAnswerBtn.textContent = '获取答案';
        }
      });
    } catch (error) {
      statusDiv.textContent = '获取答案时出错: ' + error.message;
      statusDiv.className = 'error';
      getAnswerBtn.disabled = false;
      getAnswerBtn.textContent = '获取答案';
    }
  });

  // 一键复制按钮事件
  const copyBtn = floatWindow.querySelector('#pta-copy-btn');
  copyBtn.addEventListener('click', () => {
    const code = aiCodeInput.value;
    if (!code) {
      statusDiv.textContent = '没有可复制的代码';
      statusDiv.className = 'error';
      return;
    }

    navigator.clipboard.writeText(code)
      .then(() => {
        statusDiv.textContent = '代码已复制到剪贴板！';
        statusDiv.className = 'success';
      })
      .catch(err => {
        statusDiv.textContent = '复制失败: ' + err.message;
        statusDiv.className = 'error';
      });
  });

  // 一键提交按钮事件
  const submitBtn = floatWindow.querySelector('#pta-submit-btn');
  submitBtn.addEventListener('click', async () => {
    const code = aiCodeInput.value;
    if (!code) {
      statusDiv.textContent = '没有可提交的代码';
      statusDiv.className = 'error';
      return;
    }

    statusDiv.textContent = '正在提交代码...';
    statusDiv.className = 'info';

    try {
      // 打印当前URL以便调试
      console.log('当前URL:', window.location.href);
      
      const result = await submitCode(code);
      if (result.success) {
        statusDiv.textContent = '代码提交成功！';
        statusDiv.className = 'success';
        if (result.examId && result.submissionId) {
          pollSubmissionResult(statusDiv, result.examId, result.submissionId);
        }
      } else {
        statusDiv.textContent = '提交失败: ' + result.error;
        statusDiv.className = 'error';
      }
    } catch (error) {
      statusDiv.textContent = '提交出错: ' + error.message;
      statusDiv.className = 'error';
    }
  });

  // 拖拽功能
  makeDraggable(floatWindow);
}

// 监听来自 popup 的消息（保留原有功能）
try {
  chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    try {
      if (request.action === 'submitCode') {
        submitCode(request.code).then(result => {
          try {
            sendResponse(result);
          } catch (error) {
            console.warn('发送响应时出错:', error);
          }
        });
        return true;
      } else if (request.action === 'extractProblem') {
        // 提取题目内容
        extractProblemText().then(() => {
          try {
            sendResponse({ success: true });
          } catch (error) {
            console.warn('发送响应时出错:', error);
          }
        }).catch(error => {
          try {
            sendResponse({ success: false, error: error.message });
          } catch (err) {
            console.warn('发送响应时出错:', err);
          }
        });
        return true;
      } else if (request.action === 'generateCode') {
        // 调用AI生成代码
        if (currentProblemText) {
          checkAndUseAI(currentProblemText).then(() => {
            try {
              sendResponse({ success: true });
            } catch (error) {
              console.warn('发送响应时出错:', error);
            }
          }).catch(error => {
            try {
              sendResponse({ success: false, error: error.message });
            } catch (err) {
              console.warn('发送响应时出错:', err);
            }
          });
        } else {
          try {
            sendResponse({ success: false, error: '未提取到题目内容' });
          } catch (error) {
            console.warn('发送响应时出错:', error);
          }
        }
        return true;
      } else if (request.action === 'autoSubmit') {
        // 自动提交代码
        const codeInput = document.getElementById('pta-code-input');
        if (codeInput) {
          const code = codeInput.value.trim();
          if (code) {
            submitCode(code).then(result => {
              try {
                sendResponse(result);
              } catch (error) {
                console.warn('发送响应时出错:', error);
              }
            });
          } else {
            try {
              sendResponse({ success: false, error: '代码为空' });
            } catch (error) {
              console.warn('发送响应时出错:', error);
            }
          }
        } else {
          try {
            sendResponse({ success: false, error: '未找到代码输入框' });
          } catch (error) {
            console.warn('发送响应时出错:', error);
          }
        }
        return true;
      }
    } catch (error) {
      console.warn('处理消息时出错:', error);
      try {
        sendResponse({ success: false, error: error.message });
      } catch (err) {
        console.warn('发送响应时出错:', err);
      }
      return true;
    }
  });
} catch (error) {
  console.warn('注册消息监听器时出错:', error);
}
