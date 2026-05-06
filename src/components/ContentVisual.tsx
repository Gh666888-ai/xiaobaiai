type VisualKind = "news" | "community" | "learn" | "code" | "data" | "agent" | "creative"

type ContentVisualProps = {
  kind?: VisualKind
  title: string
  label?: string
  meta?: string
  compact?: boolean
}

const palettes: Record<VisualKind, { accent: string; soft: string; deep: string; grid: string }> = {
  news: { accent: "#e8c96a", soft: "rgba(232,201,106,0.12)", deep: "rgba(122,98,48,0.22)", grid: "rgba(232,201,106,0.16)" },
  community: { accent: "#5fe0a3", soft: "rgba(95,224,163,0.11)", deep: "rgba(31,107,78,0.22)", grid: "rgba(95,224,163,0.14)" },
  learn: { accent: "#64b5f6", soft: "rgba(100,181,246,0.12)", deep: "rgba(28,84,135,0.24)", grid: "rgba(100,181,246,0.14)" },
  code: { accent: "#83e377", soft: "rgba(131,227,119,0.1)", deep: "rgba(45,105,56,0.22)", grid: "rgba(131,227,119,0.13)" },
  data: { accent: "#f1c15f", soft: "rgba(241,193,95,0.11)", deep: "rgba(122,82,24,0.24)", grid: "rgba(241,193,95,0.14)" },
  agent: { accent: "#7ee7d7", soft: "rgba(126,231,215,0.11)", deep: "rgba(32,103,96,0.24)", grid: "rgba(126,231,215,0.14)" },
  creative: { accent: "#ff8f70", soft: "rgba(255,143,112,0.11)", deep: "rgba(126,54,40,0.24)", grid: "rgba(255,143,112,0.14)" },
}

function visualKind(input: string, fallback: VisualKind = "news"): VisualKind {
  const text = input.toLowerCase()
  if (/code|codex|claude|cursor|github|编程|代码|安装|部署|openclaw|hermes|ollama|api|deepseek/.test(text)) return "code"
  if (/数据|模型|排行|价格|报表|金融|算力|评测|对比|分析/.test(text)) return "data"
  if (/agent|自动|工作流|客服|dify|coze|qclaw|飞书|微信/.test(text)) return "agent"
  if (/绘图|视频|音乐|动漫|设计|创作|ppt|配音|漫剧/.test(text)) return "creative"
  return fallback
}

function trimTitle(title: string, max = 18) {
  return title.length > max ? `${title.slice(0, max)}...` : title
}

function hashText(text: string) {
  let hash = 0
  for (let i = 0; i < text.length; i++) hash = (hash * 31 + text.charCodeAt(i)) >>> 0
  return hash
}

function DashboardVisual({ accent, compact }: { accent: string; compact?: boolean }) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1.1fr 0.9fr",gap:10,height:"100%"}}>
      <div style={{display:"flex",flexDirection:"column",gap:8}}>
        {[74, 46, 88].map((w, i) => (
          <div key={i} style={{height:compact?8:10,borderRadius:99,background:"rgba(255,255,255,0.12)",overflow:"hidden"}}>
            <div style={{width:`${w}%`,height:"100%",background:i===1?"rgba(255,255,255,0.38)":accent,borderRadius:99}} />
          </div>
        ))}
        <div style={{display:"grid",gridTemplateColumns:"repeat(3,1fr)",gap:7,marginTop:4}}>
          {[0,1,2].map(i => <div key={i} style={{height:compact?28:40,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.045)",borderRadius:6}} />)}
        </div>
      </div>
      <div style={{display:"flex",alignItems:"end",gap:6,paddingTop:8}}>
        {[58, 74, 46, 86, 66].map((h, i) => (
          <div key={i} style={{flex:1,height:`${h}%`,borderRadius:"6px 6px 2px 2px",background:i===3?accent:"rgba(255,255,255,0.15)"}} />
        ))}
      </div>
    </div>
  )
}

function WorkflowVisual({ accent, compact }: { accent: string; compact?: boolean }) {
  const nodes = compact ? ["采集", "AI", "推送"] : ["输入", "检索", "推理", "执行"]
  return (
    <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",gap:8,height:"100%"}}>
      {nodes.map((node, i) => (
        <div key={node} style={{display:"flex",alignItems:"center",gap:8,flex:1}}>
          <div style={{height:compact?54:70,flex:1,minWidth:0,border:`1px solid ${i===1?accent:"rgba(255,255,255,0.12)"}`,background:i===1?"rgba(255,255,255,0.07)":"rgba(255,255,255,0.035)",borderRadius:8,display:"flex",alignItems:"center",justifyContent:"center",color:i===1?accent:"#ddd",fontSize:11,fontWeight:900}}>
            {node}
          </div>
          {i < nodes.length - 1 && <span style={{color:accent,fontSize:16,fontFamily:"JetBrains Mono, monospace"}}>›</span>}
        </div>
      ))}
    </div>
  )
}

function CodeVisual({ accent, compact }: { accent: string; compact?: boolean }) {
  const lines = compact ? [60, 38, 78, 52] : [42, 76, 58, 86, 64]
  return (
    <div style={{fontFamily:"JetBrains Mono, monospace",fontSize:10,height:"100%",display:"flex",flexDirection:"column",gap:7}}>
      <div style={{display:"flex",gap:6,marginBottom:2}}>
        <span style={{width:7,height:7,borderRadius:"50%",background:"#d94841"}} />
        <span style={{width:7,height:7,borderRadius:"50%",background:"#e8c96a"}} />
        <span style={{width:7,height:7,borderRadius:"50%",background:"#5fe0a3"}} />
      </div>
      {lines.map((w, i) => (
        <div key={i} style={{display:"flex",alignItems:"center",gap:8}}>
          <span style={{color:"rgba(255,255,255,0.28)",width:12}}>{i + 1}</span>
          <span style={{height:compact?7:8,width:`${w}%`,background:i===1?accent:"rgba(255,255,255,0.16)",borderRadius:99}} />
        </div>
      ))}
      <div style={{marginTop:"auto",height:compact?20:26,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(0,0,0,0.24)",borderRadius:6,display:"flex",alignItems:"center",padding:"0 10px",color:accent,fontSize:10}}>ready</div>
    </div>
  )
}

function CreativeVisual({ accent, compact }: { accent: string; compact?: boolean }) {
  return (
    <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:8,height:"100%"}}>
      <div style={{borderRadius:8,border:"1px solid rgba(255,255,255,0.12)",background:`linear-gradient(135deg, ${accent}22, rgba(255,255,255,0.04))`,position:"relative",overflow:"hidden"}}>
        <div style={{position:"absolute",left:"18%",top:"18%",width:"34%",aspectRatio:"1",borderRadius:"50%",border:`2px solid ${accent}`}} />
        <div style={{position:"absolute",right:"12%",bottom:"16%",width:"48%",height:"28%",borderRadius:8,background:"rgba(0,0,0,0.26)"}} />
      </div>
      <div style={{display:"grid",gridTemplateRows:"1fr 1fr",gap:8}}>
        <div style={{borderRadius:8,border:"1px solid rgba(255,255,255,0.1)",background:"rgba(255,255,255,0.05)"}} />
        <div style={{borderRadius:8,border:`1px solid ${accent}`,background:"rgba(255,255,255,0.035)",display:"flex",alignItems:"end",gap:4,padding:8}}>
          {[35, 58, 80, 52].map((h,i)=><span key={i} style={{height:`${h}%`,flex:1,background:i===2?accent:"rgba(255,255,255,0.18)",borderRadius:3}} />)}
        </div>
      </div>
    </div>
  )
}

function InnerVisual({ kind, accent, compact }: { kind: VisualKind; accent: string; compact?: boolean }) {
  if (kind === "code") return <CodeVisual accent={accent} compact={compact} />
  if (kind === "data" || kind === "news") return <DashboardVisual accent={accent} compact={compact} />
  if (kind === "creative") return <CreativeVisual accent={accent} compact={compact} />
  return <WorkflowVisual accent={accent} compact={compact} />
}

export function inferContentVisualKind(title: string, fallback: VisualKind = "news") {
  return visualKind(title, fallback)
}

export function ContentVisual({ kind = "news", title, label, meta, compact }: ContentVisualProps) {
  const finalKind = kind === "news" ? visualKind(title, "news") : kind
  const palette = palettes[finalKind]
  const variant = hashText(`${finalKind}-${title}`) % 4
  const height = compact ? 126 : 240
  const pattern =
    variant === 0
      ? `linear-gradient(90deg, transparent 0 23px, ${palette.grid} 24px), linear-gradient(0deg, transparent 0 23px, ${palette.grid} 24px)`
      : variant === 1
        ? `radial-gradient(circle at 18% 24%, ${palette.grid} 0 2px, transparent 3px), radial-gradient(circle at 78% 64%, ${palette.grid} 0 2px, transparent 3px)`
        : variant === 2
          ? `linear-gradient(135deg, transparent 0 18px, ${palette.grid} 19px, transparent 21px)`
          : `radial-gradient(circle at 50% 50%, ${palette.grid} 0 1px, transparent 2px), linear-gradient(90deg, transparent 0 31px, rgba(255,255,255,0.06) 32px)`
  const patternSize = variant === 0 ? "24px 24px, 24px 24px" : variant === 1 ? "32px 32px, 46px 46px" : variant === 2 ? "34px 34px" : "18px 18px, 32px 32px"

  return (
    <div
      aria-hidden="true"
      style={{
        height,
        minHeight: height,
        borderRadius: 8,
        overflow: "hidden",
        border: "1px solid rgba(255,255,255,0.1)",
        background:
          `linear-gradient(135deg, ${palette.deep}, rgba(255,255,255,0.035)), ` +
          pattern,
        backgroundSize: `auto, ${patternSize}`,
        position: "relative",
        boxShadow: `inset 0 0 0 1px rgba(255,255,255,0.03), 0 18px 50px rgba(0,0,0,0.34)`,
      }}
    >
      <div style={{height:compact?26:34,display:"flex",alignItems:"center",justifyContent:"space-between",padding:compact?"0 10px":"0 14px",borderBottom:"1px solid rgba(255,255,255,0.09)",background:"rgba(0,0,0,0.28)"}}>
        <div style={{display:"flex",alignItems:"center",gap:6}}>
          <span style={{width:compact?5:7,height:compact?5:7,borderRadius:"50%",background:"#d94841"}} />
          <span style={{width:compact?5:7,height:compact?5:7,borderRadius:"50%",background:"#e8c96a"}} />
          <span style={{width:compact?5:7,height:compact?5:7,borderRadius:"50%",background:"#5fe0a3"}} />
        </div>
        <span style={{fontFamily:"JetBrains Mono, monospace",fontSize:compact?8:9,fontWeight:800,letterSpacing:"0.12em",color:palette.accent}}>{label || finalKind.toUpperCase()}</span>
      </div>
      <div style={{position:"absolute",left:compact?10:16,right:compact?10:16,top:compact?40:54,bottom:compact?12:18}}>
        <div style={{display:"flex",alignItems:"flex-start",justifyContent:"space-between",gap:12,marginBottom:compact?10:16}}>
          <div style={{minWidth:0}}>
            <p style={{fontSize:compact?12:16,fontWeight:900,color:"#fff",lineHeight:1.35,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis",maxWidth:"100%"}}>{trimTitle(title, compact ? 14 : 24)}</p>
            {meta && <p style={{fontFamily:"JetBrains Mono, monospace",fontSize:compact?8:10,color:"rgba(255,255,255,0.46)",marginTop:3,whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{meta}</p>}
          </div>
          <span style={{width:compact?30:40,height:compact?30:40,borderRadius:8,border:`1px solid ${palette.accent}`,background:palette.soft,boxShadow:`0 0 24px ${palette.soft}`,flexShrink:0,display:"flex",alignItems:"center",justifyContent:"center",fontFamily:"JetBrains Mono, monospace",fontSize:compact?11:14,fontWeight:900,color:palette.accent}}>
            AI
          </span>
        </div>
        <InnerVisual kind={finalKind} accent={palette.accent} compact={compact} />
      </div>
    </div>
  )
}
