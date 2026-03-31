// 检查是否是首次加载插件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 首次安装，打开配置页面
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html')
    });
  }
});

// 监听来自popup和content script的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openOptions') {
    chrome.tabs.create({
      url: chrome.runtime.getURL('options.html')
    });
    sendResponse({ success: true });
  } else if (message.action === 'openOptionsWithTab') {
    // 打开带有tab参数的选项页面
    const tabParam = message.tab || '';
    chrome.tabs.create({
      url: chrome.runtime.getURL(`options.html?tab=${tabParam}`)
    });
    sendResponse({ success: true });
  }
});
