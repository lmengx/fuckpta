// 插件配置信息
export const PLUGIN_CONFIG = {
  // 当前版本号
  version: '1.0.0',
  
  // GitHub仓库地址
  githubRepo: 'https://github.com/lmengx/fuckpta',
  
  // GitHub版本文件地址
  githubVersionUrl: 'https://raw.githubusercontent.com/lmengx/fuckpta/main/ver.txt',
  
  // Gitee仓库地址
  giteeRepo: 'https://gitee.com/lmx12330/fuckpta',
  
  // Gitee版本文件地址
  giteeVersionUrl: 'https://gitee.com/lmx12330/fuckpta/raw/main/ver.txt'
};

// 比较版本号
// 返回值: -1表示v1<v2, 0表示v1=v2, 1表示v1>v2
export function compareVersion(v1, v2) {
  const parts1 = v1.split('.').map(Number);
  const parts2 = v2.split('.').map(Number);
  
  const maxLength = Math.max(parts1.length, parts2.length);
  
  for (let i = 0; i < maxLength; i++) {
    const num1 = parts1[i] || 0;
    const num2 = parts2[i] || 0;
    
    if (num1 < num2) return -1;
    if (num1 > num2) return 1;
  }
  
  return 0;
}

// 检查是否有新版本
export async function checkForUpdates() {
  try {
    // 首先尝试从GitHub获取最新版本
    let response = await fetch(PLUGIN_CONFIG.githubVersionUrl, {
      method: 'GET',
      cache: 'no-cache'
    });
    
    if (!response.ok) {
      throw new Error('GitHub请求失败');
    }
    
    const latestVersion = (await response.text()).trim();
    
    // 比较版本号
    const comparison = compareVersion(PLUGIN_CONFIG.version, latestVersion);
    
    return {
      hasUpdate: comparison < 0,
      currentVersion: PLUGIN_CONFIG.version,
      latestVersion: latestVersion,
      source: 'github',
      githubUrl: PLUGIN_CONFIG.githubRepo,
      giteeUrl: PLUGIN_CONFIG.giteeRepo
    };
  } catch (error) {
    console.log('GitHub检查更新失败，尝试Gitee:', error);
    
    try {
      // 尝试从Gitee获取最新版本
      const response = await fetch(PLUGIN_CONFIG.giteeVersionUrl, {
        method: 'GET',
        cache: 'no-cache'
      });
      
      if (!response.ok) {
        throw new Error('Gitee请求失败');
      }
      
      const latestVersion = (await response.text()).trim();
      
      // 比较版本号
      const comparison = compareVersion(PLUGIN_CONFIG.version, latestVersion);
      
      return {
        hasUpdate: comparison < 0,
        currentVersion: PLUGIN_CONFIG.version,
        latestVersion: latestVersion,
        source: 'gitee',
        githubUrl: PLUGIN_CONFIG.githubRepo,
        giteeUrl: PLUGIN_CONFIG.giteeRepo
      };
    } catch (giteeError) {
      console.error('Gitee检查更新也失败:', giteeError);
      
      return {
        hasUpdate: false,
        currentVersion: PLUGIN_CONFIG.version,
        latestVersion: null,
        source: null,
        error: '无法连接到更新服务器',
        githubUrl: PLUGIN_CONFIG.githubRepo,
        giteeUrl: PLUGIN_CONFIG.giteeRepo
      };
    }
  }
}
