const manifestUrl = './downloads/xiaobai-mobile/release-manifest.json'

const state = {
  version: '0.1.7',
  apkName: 'Xiaobai-Tianshu-0.1.7.apk',
  apkUrl: '../downloads/xiaobai-mobile/Xiaobai-Tianshu-0.1.7.apk',
}

function render() {
  document.querySelector('#app').innerHTML = `
    <main class="download-shell">
      <section class="hero">
        <img src="./icons/icon-192.png" alt="小白天枢" />
        <span>原生 Android App</span>
        <h1>小白天枢</h1>
        <p>手机端主界面已经改成原生应用：先登录，默认进入普通问答；只有点 Xiaobai Nexus 才连接电脑端 Agent。</p>
        <a class="primary" href="${state.apkUrl}">下载 APK</a>
      </section>

      <section class="checks">
        <div>
          <strong>界面简洁</strong>
          <p>只保留普通问答、Xiaobai Nexus、我的。没有真实功能的按钮不再出现。</p>
        </div>
        <div>
          <strong>功能真实</strong>
          <p>登录走网站账号接口，聊天走手机问答接口，Nexus 控制走电脑端远程任务接口。</p>
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
