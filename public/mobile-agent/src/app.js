const state = {
  version: '0.1.11',
  apkName: 'Xiaobai-Tianshu-0.1.11.apk',
  apkUrl: '../downloads/xiaobai-mobile/Xiaobai-Tianshu-0.1.11.apk',
}

function render() {
  document.querySelector('#app').innerHTML = `
    <main class="download-shell">
      <section class="hero">
        <img src="./icons/icon-192.png" alt="小白天枢" />
        <span>Android / HarmonyOS</span>
        <h1>小白天枢</h1>
        <a class="primary" href="${state.apkUrl}">下载 APK</a>
      </section>
    </main>
  `
}

render()
