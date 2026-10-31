"use client";
import { useMemo, useState } from "react";

type Mode = "recap" | "subtitle";
type Provider = "gemini" | "groq" | "openrouter";
const defaults = {
  gemini: { model: "gemini-3.8-flash", label: "Google Gemini", key: "" },
  groq: { model: "whisper-large-v3", label: "Groq", key: "" },
  openrouter: { model: "google/gemini-2.5-flash", label: "OpenRouter", key: "" }
};
export default function Home() {
  const [mode,setMode]=useState<Mode>("recap");
  const [file,setFile]=useState<File|null>(null);
  const [title,setTitle]=useState("");
  const [language,setLanguage]=useState("မြန်မာ");
  const [selected,setSelected]=useState<Provider[]>(["gemini","groq","openrouter"]);
  const [keys,setKeys]=useState<Record<Provider,string>>({gemini:"",groq:"",openrouter:""});
  const [models,setModels]=useState<Record<Provider,string>>({gemini:defaults.gemini.model,groq:defaults.groq.model,openrouter:defaults.openrouter.model});
  const [result,setResult]=useState("");
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState("");
  const [stage,setStage]=useState("Ready");
  const canRun=!!file && selected.length>=2 && !busy;
  const providerNames=useMemo(()=>selected.map(x=>defaults[x].label).join(" + "),[selected]);
  function toggle(p:Provider){setSelected(old=>old.includes(p)?old.filter(x=>x!==p):[...old,p]);}
  async function run(){
    if(!file)return;
    setBusy(true);setError("");setResult("");setStage("Uploading video and preparing audio…");
    try{
      const fd=new FormData();
      fd.append("video",file);fd.append("mode",mode);fd.append("title",title);fd.append("language",language);
      fd.append("providers",JSON.stringify(selected));fd.append("keys",JSON.stringify(keys));fd.append("models",JSON.stringify(models));
      const res=await fetch("/api/process",{method:"POST",body:fd});
      const data=await res.json();
      if(!res.ok)throw new Error(data.error||"Processing failed");
      setResult(data.result||"No result returned.");setStage("Completed");
    }catch(e){setError(e instanceof Error?e.message:"Unknown error");setStage("Failed");}
    finally{setBusy(false);}
  }
  return <main className="shell">
    <header className="top"><div className="brand"><div className="logo">✦</div><div><div className="eyebrow">MULTI-AI WORKSPACE</div><h1>AI Movie Studio</h1></div></div><div className="status">● Hybrid Engine</div></header>
    <section className="hero"><div className="eyebrow">THREE MODELS. ONE WORKFLOW.</div><h2>Movie Recap & Subtitle,<br/>powered by multiple AI.</h2><p>Video တစ်ပုဒ်ကို AI ၃ ခုနဲ့ အလုပ်ခွဲလုပ်စေပြီး Parallel + Teamwork နည်းလမ်းနဲ့ Final Result တစ်ခုအဖြစ် ပေါင်းစပ်ပေးမယ်။</p></section>
    <div className="grid">
      <section className="panel">
        <h3>① Create a project</h3><p className="sub">Movie file တင်ပြီး လုပ်ဆောင်မယ့်အလုပ်ကို ရွေးပါ။</p>
        <div className="tabs"><button className={"tab "+(mode==="recap"?"active":"")} onClick={()=>setMode("recap")}>🎬 Movie Recap</button><button className={"tab "+(mode==="subtitle"?"active":"")} onClick={()=>setMode("subtitle")}>文 Subtitle</button></div>
        <label className="drop"><div style={{fontSize:28}}>⬆</div><strong>{file?file.name:"Drop your movie video here"}</strong><small>{file?`${(file.size/1024/1024).toFixed(1)} MB · ${file.type||"video"}`:"or tap to browse · MP4, MOV, WEBM, AVI"}</small><input type="file" accept="video/*" onChange={e=>setFile(e.target.files?.[0]||null)}/></label>
        <div className="field"><label>Movie title (optional)</label><input value={title} onChange={e=>setTitle(e.target.value)} placeholder="Enter movie name"/></div>
        <div className="row"><div className="field"><label>Output language</label><select value={language} onChange={e=>setLanguage(e.target.value)}><option>မြန်မာ</option><option>English</option><option>ไทย</option><option>中文</option></select></div><div className="field"><label>Workflow</label><input value="Hybrid · Parallel + Review" readOnly/></div></div>
        <button className="primary" disabled={!canRun} onClick={run}>{busy?"Processing…":`Run ${selected.length} AI models →`}</button>
        <p className="notice">သင်ပိုင်ဆိုင်ခွင့်ရှိသော သို့မဟုတ် အသုံးပြုခွင့်ရထားသော Video များကိုသာ တင်ပါ။ Video အရှည်/ဖိုင်အရွယ်အစားအလိုက် API ကန့်သတ်ချက်နှင့် ကုန်ကျစရိတ် ရှိနိုင်သည်။</p>
      </section>
      <section className="panel">
        <h3>② Multi-AI control center</h3><p className="sub">AI တစ်ခုချင်းစီကို ဖွင့်/ပိတ်၊ Model နဲ့ API Key ကို ပြောင်းနိုင်ပါတယ်။ အနည်းဆုံး ၂ ခု ရွေးပါ။</p>
        <div className="providers">
          {(["gemini","groq","openrouter"] as Provider[]).map((p,i)=><div className="provider" key={p}><input type="checkbox" checked={selected.includes(p)} onChange={()=>toggle(p)}/><div className="picon">{["G","Gr","O"][i]}</div><div className="grow"><b>{defaults[p].label}</b><small>{["Video understanding + scene analysis","Speech-to-text + timestamp segments","Myanmar translation + final quality review"][i]}</small></div><span style={{fontSize:11,color:selected.includes(p)?"#9ee7c0":"#778198"}}>{selected.includes(p)?"ON":"OFF"}</span></div>)}
        </div>
        {(["gemini","groq","openrouter"] as Provider[]).map(p=><div className="field" key={p}><label>{defaults[p].label} · API Key</label><input type="password" value={keys[p]} onChange={e=>setKeys(v=>({...v,[p]:e.target.value}))} placeholder="Optional if configured on server"/><label>Model ID</label><input value={models[p]} onChange={e=>setModels(v=>({...v,[p]:e.target.value}))}/></div>)}
        <p className="notice">API Key များကို ဒီ Browser ထဲမှာ မသိမ်းပါ။ Run လုပ်ချိန်တွင် Server သို့ တစ်ကြိမ်ပို့ပြီး Processing ပြီးလျှင် ဖယ်ရှားပါမည်။ Production အသုံးပြုရာတွင် Login, encrypted key vault နှင့် rate limits ထည့်သင့်သည်။</p>
      </section>
    </div>
    <section className="panel" style={{marginTop:18}}>
      <h3>③ Processing monitor</h3><p className="sub">Hybrid workflow status နဲ့ AI output ကို ဒီနေရာမှာကြည့်နိုင်ပါတယ်။</p>
      <div className="steps"><div className="step"><span className={"dot "+(busy?"run":stage==="Completed"?"done":"")}></span>Parallel: Gemini scene analysis + Groq transcription</div><div className="step"><span className={"dot "+(stage==="Completed"?"done":busy?"run":"")}></span>Teamwork: OpenRouter merges and reviews results</div><div className="step"><span className={"dot "+(stage==="Completed"?"done":"")}></span>Final {mode==="recap"?"movie recap":"subtitle output"}</div></div>
      <p className="notice">Status: <b>{stage}</b> · Providers: {providerNames}</p>
      {error&&<div className="error">{error}</div>}
      {result&&<><div style={{display:"flex",justifyContent:"space-between",alignItems:"center",margin:"15px 0 9px"}}><b>Final output</b><button className="secondary" onClick={()=>navigator.clipboard.writeText(result)}>Copy result</button></div><pre className="result">{result}</pre><button className="secondary" style={{marginTop:10}} onClick={()=>{const a=document.createElement("a");a.href=URL.createObjectURL(new Blob([result],{type:"text/plain;charset=utf-8"}));a.download=mode==="subtitle"?"subtitle.srt":"movie-recap.txt";a.click();URL.revokeObjectURL(a.href);}}>Download {mode==="subtitle"?"SRT":"TXT"}</button></>}
    </section>
    <div className="footer">AI Movie Studio · Multi-provider orchestration · API keys stay server-side during processing</div>
  </main>;
}