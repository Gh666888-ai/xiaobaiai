import { MathRain } from "@/components/MathRain"
import { NavBar } from "@/components/NavBar"

export default function NewsLoading() {
  return (
    <div style={{background:'#000',minHeight:'100vh',fontFamily:"'Noto Sans SC', sans-serif"}}>
      <MathRain /><NavBar />
      <div style={{maxWidth:900,margin:'0 auto',padding:'60px 60px',position:'relative',zIndex:10,background:'rgba(0,0,0,0.85)'}} className="max-sm:px-4">
        <p style={{fontFamily:"'JetBrains Mono',monospace",fontSize:10,letterSpacing:'0.4em',color:'#7a6230',marginBottom:10,fontWeight:700}}>News Feed</p>
        <h1 style={{fontSize:36,fontWeight:900,color:'#fff',marginBottom:8}}>AI 资讯</h1>
        <p style={{fontSize:14,color:'#ccc',marginBottom:32}}>正在加载...</p>
        <div style={{display:'flex',flexDirection:'column',gap:10}}>
          {[1,2,3,4,5,6].map(i=>(
            <div key={i} style={{background:'rgba(255,255,255,0.02)',border:'1px solid #1a1a1a',borderRadius:16,padding:'24px'}}>
              <div style={{display:'flex',gap:8,marginBottom:12}}>
                <div style={{width:50,height:20,borderRadius:4,background:'rgba(255,255,255,0.04)'}}/>
                <div style={{width:80,height:20,borderRadius:4,background:'rgba(255,255,255,0.02)'}}/>
              </div>
              <div style={{height:22,width:'80%',borderRadius:4,background:'rgba(255,255,255,0.04)',marginBottom:8}}/>
              <div style={{height:16,width:'100%',borderRadius:4,background:'rgba(255,255,255,0.02)',marginBottom:4}}/>
              <div style={{height:16,width:'60%',borderRadius:4,background:'rgba(255,255,255,0.02)'}}/>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
