"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NAV_SECTIONS = [
  { label:"Main", items:[
    { icon:"⚡", label:"Dashboard", href:"/owner/dashboard", active:false },
    { icon:"🏠", label:"Houses",   href:"/owner/houses",    active:false },
    { icon:"👥", label:"Tenants",  href:"/owner/tenants",   active:false, badge:"12" },
    { icon:"📋", label:"Leases",   href:"/owner/leases",    active:false },
  ]},
  { label:"Finance", items:[
    { icon:"💳", label:"Payments",  href:"/owner/payments",  active:false, badge:"3" },
    { icon:"📈", label:"Analytics", href:"/owner/analytics", active:false },
    { icon:"🧾", label:"Invoices",  href:"/owner/invoices",  active:false },
  ]},
  { label:"Tools", items:[
    { icon:"🔧", label:"Maintenance", href:"/owner/complaints", active:false, badge:"5" },
    { icon:"💬", label:"Messages",   href:"/owner/messages",   active:true },
    { icon:"⚙️", label:"Settings",  href:"/owner/settings",   active:false },
  ]},
];

const THREADS = [
  { id:"1", name:"Rahul Krishnan", initials:"RK", grad:"linear-gradient(135deg,#06b6d4,#8b5cf6)", unit:"Unit 4B", lastMsg:"When will the plumber come?", time:"10:42 AM", unread:2, online:true },
  { id:"2", name:"Priya Mehta",    initials:"PM", grad:"linear-gradient(135deg,#f59e0b,#ef4444)", unit:"Unit 2A", lastMsg:"Thank you for fixing the AC.",  time:"Yesterday",unread:0, online:false },
  { id:"3", name:"Suresh Sharma",  initials:"SS", grad:"linear-gradient(135deg,#ef4444,#ec4899)", unit:"Unit 1C", lastMsg:"Rent paid. Please confirm.",   time:"Mon",      unread:1, online:false },
  { id:"4", name:"Anjali Nair",    initials:"AN", grad:"linear-gradient(135deg,#22c55e,#06b6d4)", unit:"Unit 3D", lastMsg:"Is parking available?",         time:"Sun",      unread:0, online:true },
  { id:"5", name:"Divya Varma",    initials:"DV", grad:"linear-gradient(135deg,#8b5cf6,#6366f1)", unit:"Unit 5A", lastMsg:"Invoice received, thanks.",     time:"Mar 5",    unread:0, online:false },
  { id:"6", name:"Karthik Raj",    initials:"KR", grad:"linear-gradient(135deg,#06b6d4,#22c55e)", unit:"Unit 6B", lastMsg:"Can I extend my lease?",        time:"Mar 2",    unread:0, online:false },
];

const CHAT_DATA: Record<string, {from:"me"|"them"; text:string; time:string}[]> = {
  "1": [
    {from:"them",text:"Hi, I wanted to ask about the leaking tap in the kitchen.",time:"10:30 AM"},
    {from:"me",  text:"Hi Rahul! Yes, I've noted the complaint. We're arranging a plumber.",time:"10:33 AM"},
    {from:"them",text:"When will the plumber come?",time:"10:42 AM"},
  ],
  "2": [
    {from:"them",text:"The AC was fixed perfectly, works great now!",time:"Yesterday 3:00 PM"},
    {from:"me",  text:"Glad to hear that! Let me know if anything else comes up.",time:"Yesterday 3:10 PM"},
    {from:"them",text:"Thank you for fixing the AC.",time:"Yesterday 4:00 PM"},
  ],
  "3": [
    {from:"them",text:"I have paid this month's rent via UPI.",time:"Mon 9:00 AM"},
    {from:"me",  text:"Confirmed, received ₹15,000. Thank you!",time:"Mon 9:15 AM"},
    {from:"them",text:"Rent paid. Please confirm.",time:"Mon 11:00 AM"},
  ],
  "4":[{from:"them",text:"Is parking available?",time:"Sun 6:00 PM"}],
  "5":[{from:"them",text:"Invoice received, thanks.",time:"Mar 5 2:00 PM"}],
  "6":[{from:"them",text:"Can I extend my lease?",time:"Mar 2 10:00 AM"}],
};

export default function MessagesPage() {
  const router = useRouter();
  const [mobileOpen,    setMobileOpen]    = useState(false);
  const [activeThread,  setActiveThread]  = useState("1");
  const [message,       setMessage]       = useState("");
  const [chats,         setChats]         = useState(CHAT_DATA);

  const thread = THREADS.find(t=>t.id===activeThread)!;
  const messages = chats[activeThread] || [];

  const sendMessage = ()=>{
    if(!message.trim()) return;
    setChats(prev=>({...prev,[activeThread]:[...(prev[activeThread]||[]),{from:"me",text:message.trim(),time:"Now"}]}));
    setMessage("");
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#1e2d47;border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.6);opacity:0}}
        .a1{animation:fadeUp .4s ease both .05s}
        .sb-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;font-size:13px;font-weight:500;color:#94a3b8;cursor:pointer;transition:all .15s;text-decoration:none;margin-bottom:2px;border:1px solid transparent}
        .sb-link:hover{background:rgba(255,255,255,0.04);color:#e2e8f0}
        .sb-link.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.15)}
        .sidebar{position:fixed;top:0;left:0;bottom:0;width:250px;background:#0d1526;border-right:1px solid #1e2d47;display:flex;flex-direction:column;z-index:300;transition:transform .3s ease}
        .navbar{position:fixed;top:0;left:250px;right:0;height:62px;background:#0d1526;border-bottom:1px solid #1e2d47;display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:200}
        .page-main{position:fixed;top:62px;left:250px;right:0;bottom:0;display:flex;overflow:hidden}
        .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:250;backdrop-filter:blur(2px)}
        .nav-ico{width:36px;height:36px;border-radius:8px;background:#111d33;border:1px solid #1e2d47;display:grid;place-items:center;cursor:pointer;font-size:15px;position:relative;transition:border-color .2s;flex-shrink:0}
        .thread-item{display:flex;align-items:center;gap:12px;padding:13px 16px;cursor:pointer;transition:background .15s;border-bottom:1px solid rgba(30,45,71,0.5)}
        .thread-item:hover{background:rgba(255,255,255,0.03)}
        .thread-item.active{background:rgba(6,182,212,0.07);border-right:2px solid #06b6d4}
        .bubble{max-width:72%;padding:10px 13px;border-radius:12px;font-size:13px;line-height:1.5;word-break:break-word}
        .bubble.me{background:linear-gradient(135deg,#06b6d4,#0891b2);color:white;border-bottom-right-radius:4px;align-self:flex-end}
        .bubble.them{background:#111d33;border:1px solid #1e2d47;color:#e2e8f0;border-bottom-left-radius:4px;align-self:flex-start}
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
          .mob-overlay.open{display:block}
          .navbar{left:0;padding:0 16px}.page-main{left:0}
          .mob-burger{display:grid !important}
          .thread-list{width:100% !important}
        }
      `}</style>

      <div className={`mob-overlay${mobileOpen?" open":""}`} onClick={()=>setMobileOpen(false)}/>

      <aside className={`sidebar${mobileOpen?" open":""}`}>
        <div style={{height:62,display:"flex",alignItems:"center",gap:12,padding:"0 20px",borderBottom:"1px solid #1e2d47",flexShrink:0}}>
          <div style={{position:"relative",width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:16,flexShrink:0}}>🏠
            <div style={{position:"absolute",inset:-3,borderRadius:12,border:"1.5px solid rgba(6,182,212,0.35)",animation:"pulse-ring 2s ease-out infinite",pointerEvents:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>RentManager</div>
            <div style={{fontSize:9,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em"}}>Property OS</div>
          </div>
        </div>
        <nav style={{flex:1,padding:"16px 12px",overflowY:"auto"}}>
          {NAV_SECTIONS.map(s=>(
            <div key={s.label}>
              <div style={{fontSize:9,fontWeight:700,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.14em",padding:"0 8px",margin:"16px 0 6px"}}>{s.label}</div>
              {s.items.map(item=>(
                <Link key={item.href} href={item.href} className={`sb-link${item.active?" active":""}`} onClick={()=>setMobileOpen(false)}>
                  <span style={{fontSize:15,width:18,textAlign:"center",flexShrink:0}}>{item.icon}</span>
                  <span style={{flex:1}}>{item.label}</span>
                  {"badge" in item&&item.badge&&<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,background:item.active?"rgba(6,182,212,0.15)":"rgba(255,255,255,0.05)",color:item.active?"#06b6d4":"#4a6080"}}>{item.badge}</span>}
                </Link>
              ))}
            </div>
          ))}
        </nav>
        <div style={{padding:"14px 12px",borderTop:"1px solid #1e2d47"}}>
          <button onClick={()=>{localStorage.removeItem("rentmanager_user");document.cookie="role=; path=/; max-age=0";router.push("/login");}}
            style={{display:"flex",alignItems:"center",gap:10,padding:9,borderRadius:9,cursor:"pointer",background:"transparent",border:"1px solid transparent",color:"#f43f5e",fontSize:13,fontWeight:500,fontFamily:"inherit",width:"100%",transition:"all .15s"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(244,63,94,0.07)";(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(244,63,94,0.2)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="transparent";(e.currentTarget as HTMLButtonElement).style.borderColor="transparent"}}>
            <span>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      <header className="navbar">
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button className="mob-burger" onClick={()=>setMobileOpen(true)} style={{display:"none",background:"none",border:"1px solid #1e2d47",borderRadius:7,padding:"6px 8px",cursor:"pointer",color:"#94a3b8",fontSize:16,fontFamily:"inherit"}}>☰</button>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>Messages</div>
            <div style={{fontSize:11,color:"#4a6080"}}>{THREADS.filter(t=>t.unread>0).length} unread conversations</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Link href="/owner/complaints" className="nav-ico" style={{textDecoration:"none"}}>🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></Link>
          <Link href="/owner/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none",flexShrink:0}}>AK</Link>
        </div>
      </header>

      <main className="page-main">
        {/* Thread list */}
        <div className="thread-list" style={{width:300,borderRight:"1px solid #1e2d47",background:"#0d1526",display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"14px 16px",borderBottom:"1px solid #1e2d47"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#111d33",border:"1px solid #1e2d47",borderRadius:8,padding:"8px 12px"}}>
              <span style={{color:"#4a6080"}}>🔍</span>
              <input placeholder="Search…" style={{background:"none",border:"none",outline:"none",fontSize:13,color:"#e2e8f0",fontFamily:"inherit",width:"100%"}}/>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto"}}>
            {THREADS.map(t=>(
              <div key={t.id} className={`thread-item${activeThread===t.id?" active":""}`} onClick={()=>setActiveThread(t.id)}>
                <div style={{position:"relative",flexShrink:0}}>
                  <div style={{width:40,height:40,borderRadius:11,background:t.grad,display:"grid",placeItems:"center",color:"white",fontSize:14,fontWeight:700}}>{t.initials}</div>
                  {t.online&&<div style={{position:"absolute",bottom:1,right:1,width:9,height:9,borderRadius:"50%",background:"#22c55e",border:"2px solid #0d1526"}}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{t.name}</span>
                    <span style={{fontSize:10,color:"#4a6080",flexShrink:0}}>{t.time}</span>
                  </div>
                  <div style={{fontSize:12,color:"#4a6080",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.lastMsg}</div>
                </div>
                {t.unread>0&&<div style={{width:18,height:18,borderRadius:"50%",background:"#06b6d4",color:"white",fontSize:10,fontWeight:700,display:"grid",placeItems:"center",flexShrink:0}}>{t.unread}</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Chat pane */}
        <div style={{flex:1,display:"flex",flexDirection:"column",background:"#080e1a"}}>
          {/* Chat header */}
          <div style={{height:62,borderBottom:"1px solid #1e2d47",display:"flex",alignItems:"center",gap:12,padding:"0 20px",flexShrink:0,background:"#0d1526"}}>
            <div style={{position:"relative"}}>
              <div style={{width:38,height:38,borderRadius:10,background:thread.grad,display:"grid",placeItems:"center",color:"white",fontSize:14,fontWeight:700}}>{thread.initials}</div>
              {thread.online&&<div style={{position:"absolute",bottom:1,right:1,width:9,height:9,borderRadius:"50%",background:"#22c55e",border:"2px solid #0d1526"}}/>}
            </div>
            <div>
              <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{thread.name}</div>
              <div style={{fontSize:11,color:"#4a6080"}}>{thread.unit} · {thread.online?"Online":"Offline"}</div>
            </div>
          </div>

          {/* Messages */}
          <div style={{flex:1,padding:"20px",overflowY:"auto",display:"flex",flexDirection:"column",gap:12}}>
            {messages.map((m,i)=>(
              <div key={i} style={{display:"flex",flexDirection:"column",alignItems:m.from==="me"?"flex-end":"flex-start",gap:4}}>
                <div className={`bubble ${m.from}`}>{m.text}</div>
                <div style={{fontSize:10,color:"#2d4060"}}>{m.time}</div>
              </div>
            ))}
          </div>

          {/* Input */}
          <div style={{padding:"14px 20px",borderTop:"1px solid #1e2d47",display:"flex",gap:10,alignItems:"center",background:"#0d1526"}}>
            <input
              value={message}
              onChange={e=>setMessage(e.target.value)}
              onKeyDown={e=>e.key==="Enter"&&sendMessage()}
              placeholder={`Message ${thread.name}…`}
              style={{flex:1,padding:"11px 14px",background:"#111d33",border:"1px solid #1e2d47",borderRadius:10,color:"#e2e8f0",fontSize:13,fontFamily:"inherit",outline:"none"}}
            />
            <button onClick={sendMessage} style={{width:42,height:42,borderRadius:10,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",border:"none",color:"white",fontSize:18,cursor:"pointer",display:"grid",placeItems:"center",flexShrink:0}}>
              ➤
            </button>
          </div>
        </div>
      </main>
    </>
  );
}