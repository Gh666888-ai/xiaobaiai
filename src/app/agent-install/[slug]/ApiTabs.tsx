"use client"

import { useMemo, useState } from "react"
import { CheckCircle2, KeyRound } from "lucide-react"
import Link from "next/link"
import type { AgentApiConnection, AgentInstallGuide } from "@/data/agent-install-guides"

function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid #252525", background: "rgba(0,0,0,0.54)", borderRadius: 10, padding: 16, color: "#f4f4f4", fontSize: 13, lineHeight: 1.85, fontFamily: "'JetBrains Mono', monospace" }}>
      {code}
    </pre>
  )
}

function apiButtonLabel(apiName: string) {
  if (/MiniMax/i.test(apiName)) return "MiniMax"
  if (/DeepSeek|Claude Code 接入/i.test(apiName)) return "DeepSeek"
  if (/Kimi/i.test(apiName)) return "Kimi"
  if (/OpenAI/i.test(apiName) || /Codex 官方/i.test(apiName)) return "OpenAI"
  if (/本地|Local|LM Studio/i.test(apiName)) return "本地模型"
  if (/账号登录/i.test(apiName)) return "官方账号"
  return apiName.replace(/^接入\s*/, "")
}

function buildApiSetupSteps(apiName: string) {
  if (/账号登录/i.test(apiName)) {
    return [
      "打开这个桌面应用。",
      "选择官方账号登录，不要找 API Key 输入框。",
      "登录成功后，先发一句“你好”，能正常回复就算跑通。",
      "如果你要用 DeepSeek / Kimi / MiniMax API，换支持自定义 Provider 的工具，比如 Cherry Studio、Chatbox、Cline 或 OpenClaw。",
    ]
  }

  if (/本地|Local|LM Studio/i.test(apiName)) {
    return [
      "先打开 LM Studio 或 Ollama，下载一个电脑能跑得动的模型。",
      "在 LM Studio 里点击 Local Server；Ollama 就先确认模型已经 run 起来。",
      "回到 Agent 或桌面客户端，Provider 选 OpenAI Compatible / Custom。",
      "按下面字段填写 Base URL、API Key、Model。",
      "保存后发一句“你好，请用一句话介绍你自己”，能回复就算接通。",
    ]
  }

  if (/Claude Code 接入/i.test(apiName)) {
    return [
      "先去 DeepSeek 平台拿 API Key。",
      "Windows 复制 PowerShell 配置；Mac / Linux / WSL 复制 export 配置。",
      "把 sk-你的DeepSeek_API_Key 换成自己的 Key。",
      "复制整段到终端回车，最后一行 claude 会直接启动。",
      "启动后问一句“请告诉我当前项目是什么”，能回答就算接通。",
    ]
  }

  return [
    "打开 Agent 或桌面客户端的 Settings / Models / API 设置。",
    "Provider 选择 OpenAI Compatible / Custom；如果是官方 OpenAI，就选 OpenAI。",
    "按下面字段填写 Base URL、API Key、Model。",
    "点击 Save / Enable / Test。",
    "新建一次对话，发“你好，请用一句话介绍你自己”，能回复就算接通。",
  ]
}

function uniqueApis(apis: AgentApiConnection[]) {
  return apis.filter((api, index, list) => (
    list.findIndex((item) => apiButtonLabel(item.name) === apiButtonLabel(api.name)) === index
  ))
}

export function ApiTabs({ guide }: { guide: AgentInstallGuide }) {
  const apiOptions = useMemo(() => uniqueApis(guide.apiConnections), [guide.apiConnections])
  const [activeName, setActiveName] = useState(apiOptions[0]?.name || guide.apiConnections[0]?.name || "")
  const activeApi = guide.apiConnections.find((api) => api.name === activeName) || guide.apiConnections[0]
  const setupSteps = activeApi ? buildApiSetupSteps(activeApi.name) : []

  if (!activeApi) return null

  return (
    <section id="api" style={{ marginBottom: 42 }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 10 }}>
        <KeyRound size={18} style={{ color: "#e8c96a" }} />
        <h2 style={{ color: "#fff", fontSize: 25, fontWeight: 950 }}>先选模型 API 或本地模型</h2>
      </div>
      <p style={{ color: "#aaa", fontSize: 14, lineHeight: 1.85, marginBottom: 16 }}>
        Agent 本体只是执行工具，模型才是“大脑”。先选一个能跑通的模型，再安装和启动 Agent，别一次把所有配置都看完。
      </p>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(2,minmax(0,1fr))", gap: 10, marginBottom: 16 }} className="agent-run-grid">
        <div style={{ border: "1px solid rgba(232,201,106,0.18)", background: "rgba(201,168,76,0.045)", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>模型 = Agent 的大脑</p>
          <p style={{ color: "#cfcfcf", fontSize: 12, lineHeight: 1.7 }}>负责理解、推理、写内容、决定下一步。</p>
        </div>
        <div style={{ border: "1px solid rgba(82,148,139,0.22)", background: "rgba(82,148,139,0.045)", borderRadius: 10, padding: "14px 16px" }}>
          <p style={{ color: "#9ee5d9", fontSize: 13, fontWeight: 950, marginBottom: 6 }}>Agent = 模型的手脚</p>
          <p style={{ color: "#cfcfcf", fontSize: 12, lineHeight: 1.7 }}>负责打开工具、读文件、改代码、跑命令、执行任务。</p>
        </div>
      </div>

      <p style={{ color: "#b9d8d2", fontSize: 13, lineHeight: 1.75, marginBottom: 14 }}>
        小白AI会持续记录各个模型 API 的能力评分和价格变化。正式接入前，先看 <Link href="/models" style={{ color: "#e8c96a", fontWeight: 950 }}>模型排行和价格快照</Link>。
      </p>

      <div role="tablist" aria-label="选择模型接入方式" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(112px,1fr))", gap: 8, marginBottom: 14 }}>
        {apiOptions.map((api) => {
          const active = api.name === activeApi.name
          return (
            <button
              key={api.name}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setActiveName(api.name)}
              style={{
                cursor: "pointer",
                border: `1px solid ${active ? "rgba(232,201,106,0.64)" : "rgba(255,255,255,0.10)"}`,
                background: active ? "linear-gradient(135deg,rgba(201,168,76,0.18),rgba(255,255,255,0.045))" : "rgba(255,255,255,0.035)",
                color: active ? "#f1d878" : "#d8d8d8",
                borderRadius: 9,
                minHeight: 46,
                padding: "10px 12px",
                fontSize: 14,
                fontWeight: 950,
                textAlign: "left",
              }}
            >
              {apiButtonLabel(api.name)}
            </button>
          )
        })}
      </div>

      <article role="tabpanel" style={{ border: "1px solid rgba(255,255,255,0.10)", background: "rgba(255,255,255,0.035)", borderRadius: 12, padding: "22px 24px" }}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <div>
            <h3 style={{ color: "#fff", fontSize: 24, fontWeight: 950, lineHeight: 1.3, marginBottom: 8 }}>{activeApi.name}</h3>
            <p style={{ color: "#bbb", fontSize: 14, lineHeight: 1.8 }}>{activeApi.description}</p>
          </div>
          <span className="tag tag-gold" style={{ color: "#e8c96a", fontSize: 12, fontWeight: 950 }}>{activeApi.badge}</span>
        </div>

        <div style={{ border: "1px solid rgba(82,148,139,0.20)", background: "rgba(82,148,139,0.035)", borderRadius: 10, padding: "15px 16px", marginBottom: 14 }}>
          <p style={{ color: "#9ee5d9", fontSize: 14, fontWeight: 950, marginBottom: 9 }}>小白照着做</p>
          <div style={{ display: "grid", gap: 7 }}>
            {setupSteps.map((step, stepIndex) => (
              <p key={step} style={{ color: "#cfe6e1", fontSize: 13, lineHeight: 1.75, display: "grid", gridTemplateColumns: "24px 1fr", gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 999, background: "rgba(82,148,139,0.15)", color: "#9ee5d9", fontSize: 11, fontWeight: 950, marginTop: 2 }}>{stepIndex + 1}</span>
                <span>{step}</span>
              </p>
            ))}
          </div>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,220px),1fr))", gap: 8, marginBottom: activeApi.windowsCommand || activeApi.macCommand ? 14 : 12 }}>
          {activeApi.fields.map((field) => (
            <div key={`${activeApi.name}-${field.label}`} style={{ border: "1px solid #222", background: "rgba(0,0,0,0.24)", borderRadius: 9, padding: "11px 12px" }}>
              <p style={{ color: "#888", fontSize: 11, fontWeight: 900, marginBottom: 5 }}>{field.label}</p>
              <p style={{ color: "#f0d77a", fontSize: 13, fontWeight: 950, lineHeight: 1.45, wordBreak: "break-word" }}>{field.value}</p>
            </div>
          ))}
        </div>

        {(activeApi.windowsCommand || activeApi.macCommand) && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit,minmax(min(100%,300px),1fr))", gap: 12, marginBottom: 12 }}>
            {activeApi.windowsCommand && (
              <div>
                <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>Windows PowerShell 复制</p>
                <CodeBlock code={activeApi.windowsCommand} />
              </div>
            )}
            {activeApi.macCommand && (
              <div>
                <p style={{ color: "#e8c96a", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>Mac / Linux / WSL 复制</p>
                <CodeBlock code={activeApi.macCommand} />
              </div>
            )}
          </div>
        )}

        <div style={{ display: "grid", gap: 7 }}>
          {activeApi.notes.map((note) => (
            <p key={note} style={{ color: "#aaa", fontSize: 12, lineHeight: 1.7, display: "grid", gridTemplateColumns: "16px 1fr", gap: 7 }}>
              <CheckCircle2 size={13} style={{ color: "#3DA563", marginTop: 4 }} />
              <span>{note}</span>
            </p>
          ))}
        </div>
      </article>
    </section>
  )
}
