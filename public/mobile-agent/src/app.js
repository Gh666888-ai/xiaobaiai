const manifestUrl = './downloads/xiaobai-mobile/release-manifest.json'

const state = {
  version: '0.1.6',
  apkName: 'Xiaobai-Nexus-0.1.6.apk',
  apkUrl: '../downloads/xiaobai-mobile/Xiaobai-Nexus-0.1.6.apk',
}

function render() {
  document.querySelector('#app').innerHTML = `
    <main class="download-shell">
      <section class="hero">
        <img src="./icons/icon-192.png" alt="Xiaobai Nexus" />
        <span>原生 Android App</span>
        <h1>小白 Agent 手机工作室</h1>
        <p>手机端主界面已经改为原生 App。网页这里只保留下载入口，避免把旧 Web 壳当成正式 App。</p>
        <a class="primary" href="${state.apkUrl}">下载 APK</a>
      </section>

      <section class="checks">
        <div>
          <strong>界面简洁</strong>
          <p>对话、任务、工作室、我的四个入口，不再堆一屏按钮。</p>
        </div>
        <div>
          <strong>功能真实</strong>
          <p>登录走网站账号接口，聊天走手机问答接口，连接电脑走设备接口。</p>
        </div>
        <div>
          <strong>不再是壳</strong>
          <p>APK 首页由 Android 原生界面渲染，不再 WebView 加载网页。</p>
        </div>
      </section>
    </main>
  `
}

render()
