"use client"

import { useMemo, useState } from "react"
import Link from "next/link"
import { CheckCircle2, KeyRound } from "lucide-react"
import type { AgentApiConnection, AgentInstallGuide } from "@/data/agent-install-guides"
import styles from "@/components/learning/SupportPage.module.css"

function CodeBlock({ code }: { code: string }) {
  return (
    <pre style={{ margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", border: "1px solid #dfe7ee", background: "#f7fbfd", borderRadius: 12, padding: 16, color: "#17202a", fontSize: 13, lineHeight: 1.85, fontFamily: "'JetBrains Mono', monospace" }}>
      {code}
    </pre>
  )
}

function apiButtonLabel(apiName: string) {
  if (/MiniMax/i.test(apiName)) return "MiniMax"
  if (/DeepSeek|Claude Code/i.test(apiName)) return "DeepSeek"
  if (/Kimi/i.test(apiName)) return "Kimi"
  if (/OpenAI|Codex/i.test(apiName)) return "OpenAI"
  if (/Local|LM Studio/i.test(apiName)) return "本地模型"
  return apiName.replace(/^接入\s*/, "")
}

function buildApiSetupSteps(apiName: string) {
  if (/Local|LM Studio/i.test(apiName)) {
    return [
      "先打开 LM Studio 或 Ollama，下载一个电脑能跑得动的模型。",
      "启动本地服务，回到 Agent 或桌面客户端。",
      "Provider 选择 OpenAI Compatible / Custom。",
      "按下方字段填写 Base URL、API Key、Model。",
      "保存后发一句测试消息，能回复就算接通。",
    ]
  }

  return [
    "打开 Agent 或桌面客户端的 Settings / Models / API 设置。",
    "Provider 选择 OpenAI Compatible / Custom；官方 OpenAI 就选 OpenAI。",
    "按下方字段填写 Base URL、API Key、Model。",
    "点击 Save / Enable / Test。",
    "新建一次对话，发一句测试消息，能回复就算接通。",
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
    <section id="api" className={styles.panel}>
      <div className={styles.panelHead}>
        <div>
          <h2 className={styles.panelTitle}><KeyRound size={22} color="#256d85" /> 先选模型 API 或本地模型</h2>
          <p className={styles.panelDesc}>
            Agent 本体只是执行工具，模型才是大脑。正式接入前，先看 <Link href="/models" style={{ color: "#256d85", fontWeight: 950 }}>模型排行和价格快照</Link>。
          </p>
        </div>
      </div>

      <div className={styles.grid} style={{ marginBottom: 16 }}>
        <div className={styles.card} style={{ minHeight: 116 }}>
          <h3 className={styles.cardTitle}>模型 = Agent 的大脑</h3>
          <p className={styles.cardText}>负责理解、推理、写内容和决定下一步。</p>
        </div>
        <div className={styles.card} style={{ minHeight: 116 }}>
          <h3 className={styles.cardTitle}>Agent = 模型的手脚</h3>
          <p className={styles.cardText}>负责打开工具、读文件、改代码、跑命令和执行任务。</p>
        </div>
      </div>

      <div role="tablist" aria-label="选择模型接入方式" className={styles.pillRow} style={{ marginBottom: 14 }}>
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
                border: `1px solid ${active ? "#256d85" : "#cfd9e3"}`,
                background: active ? "#dff0f4" : "#fff",
                color: active ? "#1d5f76" : "#536170",
                borderRadius: 999,
                minHeight: 40,
                padding: "8px 13px",
                fontSize: 14,
                fontWeight: 950,
              }}
            >
              {apiButtonLabel(api.name)}
            </button>
          )
        })}
      </div>

      <article role="tabpanel" className={styles.details}>
        <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: 12, flexWrap: "wrap", marginBottom: 12 }}>
          <div>
            <h3 className={styles.cardTitle}>{activeApi.name}</h3>
            <p className={styles.panelDesc}>{activeApi.description}</p>
          </div>
          <span className={styles.tag}>{activeApi.badge}</span>
        </div>

        <div style={{ border: "1px solid #dfe7ee", background: "#f7fbfd", borderRadius: 12, padding: "15px 16px", marginBottom: 14 }}>
          <p style={{ color: "#256d85", fontSize: 14, fontWeight: 950, marginBottom: 9 }}>照着做</p>
          <div style={{ display: "grid", gap: 7 }}>
            {setupSteps.map((step, stepIndex) => (
              <p key={step} style={{ color: "#536170", fontSize: 13, lineHeight: 1.75, display: "grid", gridTemplateColumns: "24px 1fr", gap: 8 }}>
                <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 20, height: 20, borderRadius: 999, background: "#dff0f4", color: "#256d85", fontSize: 11, fontWeight: 950, marginTop: 2 }}>{stepIndex + 1}</span>
                <span>{step}</span>
              </p>
            ))}
          </div>
        </div>

        <div className={styles.grid} style={{ marginBottom: activeApi.windowsCommand || activeApi.macCommand ? 14 : 12 }}>
          {activeApi.fields.map((field) => (
            <div key={`${activeApi.name}-${field.label}`} className={styles.card} style={{ minHeight: 94, padding: 14 }}>
              <p style={{ color: "#667586", fontSize: 11, fontWeight: 900, marginBottom: 5 }}>{field.label}</p>
              <p style={{ color: "#17202a", fontSize: 13, fontWeight: 950, lineHeight: 1.45, wordBreak: "break-word" }}>{field.value}</p>
            </div>
          ))}
        </div>

        {(activeApi.windowsCommand || activeApi.macCommand) && (
          <div className={styles.grid} style={{ marginBottom: 12 }}>
            {activeApi.windowsCommand && (
              <div>
                <p style={{ color: "#256d85", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>Windows PowerShell 复制</p>
                <CodeBlock code={activeApi.windowsCommand} />
              </div>
            )}
            {activeApi.macCommand && (
              <div>
                <p style={{ color: "#256d85", fontSize: 13, fontWeight: 950, marginBottom: 8 }}>Mac / Linux / WSL 复制</p>
                <CodeBlock code={activeApi.macCommand} />
              </div>
            )}
          </div>
        )}

        <div style={{ display: "grid", gap: 7 }}>
          {activeApi.notes.map((note) => (
            <p key={note} style={{ color: "#667586", fontSize: 12, lineHeight: 1.7, display: "grid", gridTemplateColumns: "16px 1fr", gap: 7 }}>
              <CheckCircle2 size={13} style={{ color: "#2f7d4d", marginTop: 4 }} />
              <span>{note}</span>
            </p>
          ))}
        </div>
      </article>
    </section>
  )
}
