// 默认配置
const defaultConfig = {
  autoPopup: true,
  extractDelay: 2000,
  language: 'c',
  aiEnabled: false,
  aiApiKey: '',
  aiApiUrl: 'https://api.openai.com/v1',
  aiModel: 'gpt-3.5-turbo',
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
{res_code}`
};

// 存储当前题目文本、提交结果数据和 AI 对话历史
let currentProblemText = '';
let currentSubmissionData = null;
let aiConversationHistory = [];

// 获取配置（合并默认配置和用户配置）
function getConfig(callback) {
  chrome.storage.local.get(Object.keys(defaultConfig), function(result) {
    const config = { ...defaultConfig, ...result };
    callback(config);
  });
}

// 检查是否需要自动弹出浮动窗口
function checkAutoPopup() {
  getConfig(function(config) {
    if (config.autoPopup) {
      // 检查当前页面类型
      const isProblem = isProblemPage() || isProblemListPage();
      const isSubmission = isSubmissionResultPage();
      
      if (isProblem) {
        // 移除旧的浮动窗口（如果存在）
        removeFloatingWindow();
        // 创建新的浮动窗口
        createFloatingWindow();
        // 延迟调用，确保DOM已经创建
        setTimeout(() => {
          // 根据页面类型执行不同的操作
          if (isSpecificProblemPage()) {
            extractProblemTextWithDelay();
          } else if (isProblemListPage()) {
            fetchProblemList();
          }
        }, 100);
      } else if (isSubmission) {
        // 提交结果页面处理
        extractSubmissionResultWithDelay();
      } else {
        // 其他页面，移除浮动窗口
        removeFloatingWindow();
      }
    } else {
      removeFloatingWindow();
    }
  });
}

// 延迟提取题目文本
function extractProblemTextWithDelay() {
  getConfig(function(config) {
    setTimeout(async () => {
      await extractProblemText();
    }, config.extractDelay);
  });
}

// 延迟提取提交结果页面内容
function extractSubmissionResultWithDelay() {
  getConfig(function(config) {
    setTimeout(async () => {
      await extractSubmissionResult();
    }, config.extractDelay);
  });
}

// 检查当前页面是否是 PTA 答题页面
function isProblemPage() {
  const url = window.location.href;
  return /\/problem-sets\/.+\/exam\/problems\/.+/.test(url);
}

// 检查是否是具体题目页面（包含 problemSetProblemId）
function isSpecificProblemPage() {
  const url = window.location.href;
  return /problemSetProblemId=\d+/.test(url);
}

// 检查是否是提交结果页面
function isSubmissionResultPage() {
  const url = window.location.href;
  // 检查URL是否包含提交结果页面的特征
  return url.includes('/problem-sets/') && url.includes('/exam/submissions/');
}

// 检查是否是题目列表页面
function isProblemListPage() {
  const url = window.location.href;
  // 匹配题目列表页面，不包含problemSetProblemId参数
  return /\/problem-sets\/.+\/exam\/problems\/type\/\d+/.test(url) && 
         !/problemSetProblemId=\d+/.test(url);
}

// 获取题目列表
async function fetchProblemList() {
  if (!isProblemListPage()) {
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
      console.error('无法从URL中提取problemSetId');
      problemListContainer.innerHTML = '<div class="problem-item"><span class="problem-index">错误</span><span class="problem-title">无法获取题目列表</span></div>';
      return;
    }
    const problemSetId = problemSetMatch[1];

    // 获取examId（需要先调用API获取）
    const examResponse = await fetch(`https://pintia.cn/api/problem-sets/${problemSetId}/exams`, {
      headers: {
        accept: 'application/json;charset=UTF-8',
        'content-type': 'application/json;charset=UTF-8',
        'x-lollipop': getLollipop(),
        'x-marshmallow': ''
      },
      method: 'GET',
      credentials: 'include'
    });

    if (!examResponse.ok) {
      console.error('获取examId失败:', examResponse.status);
      problemListContainer.innerHTML = '<div class="problem-item"><span class="problem-index">错误</span><span class="problem-title">无法获取examId</span></div>';
      return;
    }

    const examData = await examResponse.json();
    const examId = examData.exam?.id;
    if (!examId) {
      console.error('无法获取examId');
      problemListContainer.innerHTML = '<div class="problem-item"><span class="problem-index">错误</span><span class="problem-title">无法获取examId</span></div>';
      return;
    }

    // 获取题目列表
    const listResponse = await fetch(
      `https://pintia.cn/api/problem-sets/${problemSetId}/exam-problem-list?exam_id=${examId}&problem_type=PROGRAMMING&page=0&limit=100`,
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
      console.error('获取题目列表失败:', listResponse.status);
      problemListContainer.innerHTML = '<div class="problem-item"><span class="problem-index">错误</span><span class="problem-title">获取题目列表失败</span></div>';
      return;
    }

    const problemListData = await listResponse.json();

    // 获取题目序号映射
    const examLabelMap = problemListData.examLabelByProblemSetProblemId || {};

    // 提取题目ID和名字并输出到console，同时渲染到浮动窗口
    if (problemListData.problemSetProblems) {
      console.log('=== 题目列表 ===');
      let html = '';
      problemListData.problemSetProblems.forEach((problem, index) => {
        const label = examLabelMap[problem.id] || `${index + 1}`;
        console.log(`题目${label}: ID=${problem.id}, 名称=${problem.title}`);
        html += `<div class="problem-item" data-id="${problem.id}">
          <span class="problem-index">${label}</span>
          <span class="problem-title">${problem.title}</span>
          <button class="problem-action-btn">一键完成</button>
        </div>`;
      });
      console.log(`共 ${problemListData.problemSetProblems.length} 道题目`);

      problemListContainer.innerHTML = html;
      if (statusDiv) {
        statusDiv.textContent = `共 ${problemListData.problemSetProblems.length} 道题目`;
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
          console.log(`点击了题目: ${problemTitle}, ID: ${problemId}`);
          // 跳转到题目页面
          window.open(`https://pintia.cn/problem-sets/${problemSetId}/exam/problems/type/7?problemSetProblemId=${problemId}`, '_blank');
        });

        // 一键完成按钮点击事件
        const actionBtn = item.querySelector('.problem-action-btn');
        if (actionBtn) {
          actionBtn.addEventListener('click', async function() {
            const problemId = item.getAttribute('data-id');
            const problemTitle = item.querySelector('.problem-title').textContent;
            console.log(`一键完成题目: ${problemTitle}, ID: ${problemId}`);

            // 禁用按钮，显示加载状态
            actionBtn.disabled = true;
            actionBtn.textContent = '处理中...';

            try {
              // 步骤1: 获取examId
              const examResponse = await fetch(`https://pintia.cn/api/problem-sets/${problemSetId}/exams`, {
                headers: {
                  accept: 'application/json;charset=UTF-8',
                  'content-type': 'application/json;charset=UTF-8',
                  'x-lollipop': getLollipop(),
                  'x-marshmallow': ''
                },
                method: 'GET',
                credentials: 'include'
              });

              if (!examResponse.ok) {
                throw new Error('获取examId失败');
              }

              const examData = await examResponse.json();
              const examId = examData.exam?.id;
              if (!examId) {
                throw new Error('无法获取examId');
              }

              // 步骤2: 获取题目内容
              const problemResponse = await fetch(`https://pintia.cn/api/problem-sets/${problemSetId}/exam-problems/${problemId}`, {
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

              // 步骤3: 调用AI生成代码
              const config = await new Promise(resolve => {
                getConfig(resolve);
              });

              if (!config.aiEnabled || !config.aiApiKey) {
                throw new Error('AI 未启用或未配置 API 密钥');
              }

              const apiKey = config.aiApiKey;
              const apiUrl = config.aiApiUrl;
              const model = config.aiModel;
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

              const aiCode = aiData.choices[0].message.content;
              // 清理代码，去除可能的 markdown 代码块标记
              let cleanCode = aiCode.replace(/```[\w]*\n?/g, '').trim();

              // 步骤4: 提交代码
              const submitUrl = `https://pintia.cn/api/exams/${examId}/exam-submissions`;
              const submitBody = {
                problemType: 'PROGRAMMING',
                details: [{
                  problemId: '0',
                  problemSetProblemId: problemId,
                  programmingSubmissionDetail: {
                    program: cleanCode,
                    compiler: 'GCC'
                  }
                }]
              };

              const submitResponse = await fetch(submitUrl, {
                headers: {
                  'accept': 'application/json;charset=UTF-8',
                  'content-type': 'application/json;charset=UTF-8',
                  'x-lollipop': getLollipop(),
                  'x-marshmallow': ''
                },
                body: JSON.stringify(submitBody),
                method: 'POST',
                credentials: 'include'
              });

              if (!submitResponse.ok) {
                const errorData = await submitResponse.json();
                throw new Error('提交失败: ' + (errorData.message || '未知错误'));
              }

              actionBtn.textContent = '完成';
              actionBtn.style.background = '#2196F3';
              actionBtn.disabled = false;
            } catch (error) {
              console.error('一键完成失败:', error);
              actionBtn.textContent = '失败';
              actionBtn.style.background = '#f44336';
              setTimeout(() => {
                actionBtn.textContent = '一键完成';
                actionBtn.style.background = '#4CAF50';
                actionBtn.disabled = false;
              }, 2000);
            }
          });
        }
      });

      // 一键完成所有题目按钮点击事件
      const completeAllBtn = document.getElementById('pta-complete-all-btn');
      const completeAllStatus = document.getElementById('pta-complete-all-status');
      if (completeAllBtn) {
        completeAllBtn.addEventListener('click', async function() {
          // 显示确认对话框
          if (!confirm('确定要一键完成所有题目吗？这将自动处理当前列表中的所有题目。')) {
            return;
          }

          // 禁用按钮，显示加载状态
          completeAllBtn.disabled = true;
          completeAllBtn.textContent = '处理中...';
          completeAllStatus.style.display = 'block';
          completeAllStatus.className = 'processing';
          completeAllStatus.textContent = '正在处理题目...';

          try {
            const problems = problemListData.problemSetProblems;
            let successCount = 0;
            let failureCount = 0;

            // 步骤1: 获取examId
            const examResponse = await fetch(`https://pintia.cn/api/problem-sets/${problemSetId}/exams`, {
              headers: {
                accept: 'application/json;charset=UTF-8',
                'content-type': 'application/json;charset=UTF-8',
                'x-lollipop': getLollipop(),
                'x-marshmallow': ''
              },
              method: 'GET',
              credentials: 'include'
            });

            if (!examResponse.ok) {
              throw new Error('获取examId失败');
            }

            const examData = await examResponse.json();
            const examId = examData.exam?.id;
            if (!examId) {
              throw new Error('无法获取examId');
            }

            // 步骤2: 获取配置
            const config = await new Promise(resolve => {
              getConfig(resolve);
            });

            if (!config.aiEnabled || !config.aiApiKey) {
              throw new Error('AI 未启用或未配置 API 密钥');
            }

            // 分批处理所有题目，每隔半秒启动一个新任务
            completeAllStatus.textContent = `正在处理 ${problems.length} 道题目...`;
            
            const results = [];
            const processingPromises = [];
            
            // 处理单个题目的函数
            const processProblem = async (problem, index) => {
              const problemId = problem.id;
              const problemTitle = problem.title;
              
              try {
                console.log(`处理题目 ${index + 1}/${problems.length}: ${problemTitle}, ID: ${problemId}`);

                // 步骤3: 获取题目内容
                const problemResponse = await fetch(`https://pintia.cn/api/problem-sets/${problemSetId}/exam-problems/${problemId}`, {
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

                // 步骤4: 调用AI生成代码
                const apiKey = config.aiApiKey;
                const apiUrl = config.aiApiUrl;
                const model = config.aiModel;
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

                const aiCode = aiData.choices[0].message.content;
                // 清理代码，去除可能的 markdown 代码块标记
                let cleanCode = aiCode.replace(/```[\w]*\n?/g, '').trim();

                // 步骤5: 提交代码
                const submitUrl = `https://pintia.cn/api/exams/${examId}/exam-submissions`;
                const submitBody = {
                  problemType: 'PROGRAMMING',
                  details: [{
                    problemId: '0',
                    problemSetProblemId: problemId,
                    programmingSubmissionDetail: {
                      program: cleanCode,
                      compiler: 'GCC'
                    }
                  }]
                };

                const submitResponse = await fetch(submitUrl, {
                  headers: {
                    'accept': 'application/json;charset=UTF-8',
                    'content-type': 'application/json;charset=UTF-8',
                    'x-lollipop': getLollipop(),
                    'x-marshmallow': ''
                  },
                  body: JSON.stringify(submitBody),
                  method: 'POST',
                  credentials: 'include'
                });

                if (!submitResponse.ok) {
                  const errorData = await submitResponse.json();
                  throw new Error('提交失败: ' + (errorData.message || '未知错误'));
                }

                // 更新对应题目的按钮状态
                const problemItem = problemListContainer.querySelector(`.problem-item[data-id="${problemId}"]`);
                if (problemItem) {
                  const actionBtn = problemItem.querySelector('.problem-action-btn');
                  if (actionBtn) {
                    actionBtn.textContent = '完成';
                    actionBtn.style.background = '#2196F3';
                    actionBtn.disabled = false;
                  }
                }

                return true;
              } catch (error) {
                console.error(`处理题目 ${problemTitle} 失败:`, error);
                // 更新对应题目的按钮状态
                const problemItem = problemListContainer.querySelector(`.problem-item[data-id="${problemId}"]`);
                if (problemItem) {
                  const actionBtn = problemItem.querySelector('.problem-action-btn');
                  if (actionBtn) {
                    actionBtn.textContent = '失败';
                    actionBtn.style.background = '#f44336';
                    setTimeout(() => {
                      actionBtn.textContent = '一键完成';
                      actionBtn.style.background = '#4CAF50';
                      actionBtn.disabled = false;
                    }, 2000);
                  }
                }
                return false;
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
            const taskResults = await Promise.all(processingPromises);
            successCount = taskResults.filter(result => result).length;
            failureCount = taskResults.filter(result => !result).length;

            // 完成所有题目后显示结果
            completeAllStatus.className = 'success';
            completeAllStatus.textContent = `处理完成！成功: ${successCount}, 失败: ${failureCount}`;
            completeAllBtn.textContent = '完成所有题目';
            completeAllBtn.disabled = false;
          } catch (error) {
            console.error('一键完成所有题目失败:', error);
            completeAllStatus.className = 'error';
            completeAllStatus.textContent = '处理失败: ' + error.message;
            completeAllBtn.textContent = '一键完成所有题目';
            completeAllBtn.disabled = false;
          }
        });
      }
    }
  } catch (error) {
    console.error('获取题目列表出错:', error);
    problemListContainer.innerHTML = '<div class="problem-item"><span class="problem-index">错误</span><span class="problem-title">获取题目列表出错</span></div>';
    if (statusDiv) {
      statusDiv.textContent = '获取题目列表出错';
      statusDiv.className = 'error';
    }
  }
}

// 获取题目文本
async function extractProblemText() {
  if (!isSpecificProblemPage()) {
    return null;
  }
  
  try {
    const url = window.location.href;
    
    // 从URL中提取problemSetId和problemId
    const problemSetMatch = url.match(/\/problem-sets\/(\d+)/);
    const problemMatch = url.match(/problemSetProblemId=(\d+)/);
    
    if (!problemSetMatch || !problemMatch) {
      console.error('无法从URL中提取问题集ID或问题ID');
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
      console.error('API请求失败:', response.status, response.statusText);
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
    console.error('获取题目数据时出错:', error);
    return null;
  }
}

// 检查并调用 AI 答题
async function checkAndUseAI(problemText, isRetry = false, errorNote = '') {
  getConfig(async function(config) {
    if (!config.aiEnabled) {
      console.log('AI 答题未启用');
      return;
    }
    
    const apiKey = config.aiApiKey;
    const apiUrl = config.aiApiUrl;
    const model = config.aiModel;
    let systemPrompt = config.aiSystemPrompt;
    const language = config.language;
    
    if (!apiKey) {
      console.log('未配置 API 密钥');
      return;
    }
    
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
    
    console.log('发给 AI 的内容：', messages);
    
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
      const response = await fetch(`${apiUrl}/chat/completions`, {
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
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('AI 调用失败：', errorData);
        return;
      }
      
      const data = await response.json();
      const aiResponse = data.choices[0].message.content;
      
      console.log('AI 返回的代码：', aiResponse);
      
      // 保存对话历史
      aiConversationHistory.push({
        role: 'user',
        content: userContent
      });
      aiConversationHistory.push({
        role: 'assistant',
        content: aiResponse
      });
      
      // 将 AI 返回的代码填充到浮动窗口的输入框中
      fillCodeToFloatWindow(aiResponse);
      
    } catch (error) {
      console.error('AI 调用出错：', error);
    }
  });
}

// 将代码填充到浮动窗口
function fillCodeToFloatWindow(code) {
  const codeInput = document.getElementById('pta-code-input');
  const codeHighlight = document.getElementById('pta-code-highlight');
  if (codeInput && codeHighlight) {
    // 清理代码，去除可能的 markdown 代码块标记
    let cleanCode = code.replace(/```[\w]*\n?/g, '').trim();
    codeInput.value = cleanCode;
    codeHighlight.textContent = cleanCode;
    // 应用高亮
    Prism.highlightElement(codeHighlight);
    console.log('已将 AI 代码填充到输入框');
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
  console.log('Prism.js loaded');
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
  if (isProblemListPage()) {
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
      overflow: hidden;
      pointer-events: none;
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
  if (isProblemListPage()) {
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
  // 题目列表点击事件会在fetchProblemList中绑定
}

// 初始化代码编辑器事件
function initCodeEditorEvents(floatWindow) {
  const codeInput = floatWindow.querySelector('#pta-code-input');
  const codeHighlight = floatWindow.querySelector('#pta-code-highlight');

  // 同步输入和高亮
  codeInput.addEventListener('input', function() {
    codeHighlight.textContent = codeInput.value;
    Prism.highlightElement(codeHighlight);
  });

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
    } else {
      statusDiv.textContent = result.error || '提交失败';
      statusDiv.className = 'error';
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

// 提交代码
async function submitCode(code) {
  try {
    const url = window.location.href;
    
    const problemMatch = url.match(/problemSetProblemId=(\d+)/);
    const problemSetProblemId = problemMatch ? problemMatch[1] : null;
    
    const problemSetMatch = url.match(/\/problem-sets\/(\d+)/);
    const problemSetId = problemSetMatch ? problemSetMatch[1] : null;
    
    if (!problemSetProblemId || !problemSetId) {
      return { success: false, error: '无法获取页面信息' };
    }
    
    // 获取 exam ID
    let examId = null;
    const examsResponse = await fetch(`https://pintia.cn/api/problem-sets/${problemSetId}/exams`, {
      headers: {
        'accept': 'application/json;charset=UTF-8',
        'content-type': 'application/json;charset=UTF-8',
        'x-lollipop': getLollipop(),
        'x-marshmallow': ''
      },
      method: 'GET',
      credentials: 'include'
    });
    
    if (examsResponse.ok) {
      const examsData = await examsResponse.json();
      if (examsData && examsData.exam && examsData.exam.id) {
        examId = examsData.exam.id;
      }
    }
    
    if (!examId) {
      return { success: false, error: '无法获取 exam ID' };
    }
    
    const submitUrl = `https://pintia.cn/api/exams/${examId}/exam-submissions`;
    
    const body = {
      problemType: 'PROGRAMMING',
      details: [{
        problemId: '0',
        problemSetProblemId: problemSetProblemId,
        programmingSubmissionDetail: {
          program: code,
          compiler: 'GCC'
        }
      }]
    };
    
    const response = await fetch(submitUrl, {
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
      return { success: true, data: result };
    } else {
      return { success: false, error: result.message || '提交失败' };
    }
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// 监听 URL 变化
let currentUrl = window.location.href;

// 使用 setInterval 作为基础检测
setInterval(() => {
  checkUrlChange();
}, 1000);

// 监听浏览器前进/后退事件
window.addEventListener('popstate', function() {
  console.log('=== 检测到 popstate 事件 ===');
  checkUrlChange();
});

// 监听哈希变化事件
window.addEventListener('hashchange', function() {
  console.log('=== 检测到 hashchange 事件 ===');
  checkUrlChange();
});

// 统一的 URL 变化检查函数
function checkUrlChange() {
  if (window.location.href !== currentUrl) {
    currentUrl = window.location.href;
    // console.log('=== URL 变化 ===');
    // console.log('新URL:', currentUrl);
    // console.log('是否是题目页面:', isProblemPage());
    // console.log('是否是具体题目页面:', isSpecificProblemPage());
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
  console.log('=== 页面加载完成 ===');
  checkUrlChange();
});

// 初始检查
checkAutoPopup();

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
      console.error('无法从URL中提取提交ID');
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
      console.error('API请求失败:', response.status, response.statusText);
      return null;
    }
    
    // 获取响应数据
    const submissionData = await response.json();
    
    // 保存提交结果数据
    currentSubmissionData = submissionData;
    
    // 在提交结果页面显示浮动窗口
    createSubmissionResultWindow();
    
    return submissionData;
  } catch (error) {
    console.error('获取提交结果数据时出错:', error);
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
      gap: 10px;
      margin-top: 15px;
    }
    #pta-get-answer-btn, #pta-copy-btn {
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
    if (!currentSubmissionData) {
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
      if (currentSubmissionData && currentSubmissionData.submission && currentSubmissionData.submission.submissionDetails && currentSubmissionData.submission.submissionDetails.length > 0) {
        const detail = currentSubmissionData.submission.submissionDetails[0];
        if (detail.programmingSubmissionDetail && detail.programmingSubmissionDetail.program) {
          resCode = detail.programmingSubmissionDetail.program;
        }
      }
      
      // 提取错误类型
      if (currentSubmissionData && currentSubmissionData.submission && currentSubmissionData.submission.status) {
        errorType = currentSubmissionData.submission.status;
      }
      
      // 提取编译器提示
      if (currentSubmissionData && currentSubmissionData.submission && currentSubmissionData.submission.judgeResponseContents && currentSubmissionData.submission.judgeResponseContents.length > 0) {
        const judgeResponse = currentSubmissionData.submission.judgeResponseContents[0];
        if (judgeResponse.programmingJudgeResponseContent && judgeResponse.programmingJudgeResponseContent.compilationResult) {
          compilerMsg = judgeResponse.programmingJudgeResponseContent.compilationResult.log || '';
        }
      }
      
      // 提取测试点情况
      if (currentSubmissionData && currentSubmissionData.submission) {
        const hints = currentSubmissionData.submission.hints || {};
        const testcaseResults = currentSubmissionData.submission.judgeResponseContents && currentSubmissionData.submission.judgeResponseContents.length > 0 ? 
          currentSubmissionData.submission.judgeResponseContents[0].programmingJudgeResponseContent.testcaseJudgeResults || {} : {};
        
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
      const problemSetProblemId = currentSubmissionData.submission.problemSetProblemId;
      const problemSetId = currentSubmissionData.submission.problemSetId;
      
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
        if (!config.aiEnabled || !config.aiApiKey) {
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

        // 发送请求给AI
        const response = await fetch(`${config.aiApiUrl}/chat/completions`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${config.aiApiKey}`
          },
          body: JSON.stringify({
            model: config.aiModel,
            messages: messages,
            temperature: 0.7
          })
        });

        if (!response.ok) {
          const errorData = await response.json();
          statusDiv.textContent = 'AI 调用失败: ' + (errorData.message || '未知错误');
          statusDiv.className = 'error';
          getAnswerBtn.disabled = false;
          getAnswerBtn.textContent = '获取答案';
          return;
        }

        const data = await response.json();
        if (data.choices && data.choices.length > 0) {
          const aiResponse = data.choices[0].message.content;
          // 清理代码，去除可能的 markdown 代码块标记
          let cleanCode = aiResponse.replace(/```[\w]*\n?/g, '').trim();
          aiCodeInput.value = cleanCode;
          aiCodeHighlight.textContent = cleanCode;
          // 应用高亮
          Prism.highlightElement(aiCodeHighlight);
          aiResultSection.style.display = 'block';
          statusDiv.textContent = '答案获取成功！';
          statusDiv.className = 'success';
        } else {
          statusDiv.textContent = 'AI 未返回有效结果';
          statusDiv.className = 'error';
        }

        getAnswerBtn.disabled = false;
        getAnswerBtn.textContent = '获取答案';
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

  // 拖拽功能
  makeDraggable(floatWindow);
}

// 监听来自 popup 的消息（保留原有功能）
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
  if (request.action === 'submitCode') {
    submitCode(request.code).then(result => {
      sendResponse(result);
    });
    return true;
  } else if (request.action === 'extractProblem') {
    // 提取题目内容
    extractProblemText().then(() => {
      sendResponse({ success: true });
    }).catch(error => {
      sendResponse({ success: false, error: error.message });
    });
    return true;
  } else if (request.action === 'generateCode') {
    // 调用AI生成代码
    if (currentProblemText) {
      checkAndUseAI(currentProblemText).then(() => {
        sendResponse({ success: true });
      }).catch(error => {
        sendResponse({ success: false, error: error.message });
      });
    } else {
      sendResponse({ success: false, error: '未提取到题目内容' });
    }
    return true;
  } else if (request.action === 'autoSubmit') {
    // 自动提交代码
    const codeInput = document.getElementById('pta-code-input');
    if (codeInput) {
      const code = codeInput.value.trim();
      if (code) {
        submitCode(code).then(result => {
          sendResponse(result);
        });
      } else {
        sendResponse({ success: false, error: '代码为空' });
      }
    } else {
      sendResponse({ success: false, error: '未找到代码输入框' });
    }
    return true;
  }
});