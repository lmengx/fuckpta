// 检查是否是首次加载插件
chrome.runtime.onInstalled.addListener((details) => {
  if (details.reason === 'install') {
    // 首次安装，打开配置页面
    chrome.runtime.openOptionsPage();
  }
});

// 监听来自popup的消息
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'openOptions') {
    chrome.runtime.openOptionsPage();
    sendResponse({ success: true });
  }
});
