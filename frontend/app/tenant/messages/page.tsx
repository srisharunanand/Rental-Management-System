"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { messageAPI } from "@/app/services/api";

const NAV_ITEMS = [
  { icon:"⚡", label:"Dashboard",   href:"/tenant/dashboard",   active:false },
  { icon:"💳", label:"Payments",    href:"/tenant/payments",    active:false },
  { icon:"🔧", label:"Maintenance", href:"/tenant/complaints",  active:false },

  { icon:"📋", label:"My Lease",    href:"/tenant/lease",       active:false },
  { icon:"💬", label:"Messages",    href:"/tenant/messages",    active:true },
  { icon:"⚙️", label:"Settings",   href:"/tenant/settings",    active:false },
];

const TENANT = { name:"Rahul Krishnan", initials:"RK", unit:"Unit 4B", property:"Greenview Apartments", address:"12, Anna Nagar, Chennai – 600 040" };

const THREADS = [
  { id:"1", name:"Arjun Kumar",     initials:"AK", role:"Owner",     grad:"linear-gradient(135deg,#06b6d4,#8b5cf6)", lastMsg:"Plumber will visit March 6.", time:"10:45 AM", unread:1, online:true },
  { id:"2", name:"RentManager",     initials:"RM", role:"Support",   grad:"linear-gradient(135deg,#22c55e,#06b6d4)", lastMsg:"Your receipt has been generated.", time:"Mar 3", unread:0, online:true },
  { id:"3", name:"Society Manager", initials:"SM", role:"Manager",   grad:"linear-gradient(135deg,#8b5cf6,#6366f1)", lastMsg:"Water supply will be interrupted.", time:"Mar 1", unread:0, online:false },
];

const CHAT_DATA: Record<string,{from:"me"|"them";text:string;time:string}[]> = {
  "1":[
    {from:"them",text:"Hi Rahul, I've received your complaint about the leaking tap.",time:"10:30 AM"},
    {from:"me",  text:"Yes, it's been dripping since yesterday. Can you fix it soon?",time:"10:32 AM"},
    {from:"them",text:"Of course! I'm arranging a plumber right now.",time:"10:38 AM"},
    {from:"me",  text:"Thank you! When will they come?",time:"10:40 AM"},
    {from:"them",text:"Plumber will visit March 6.",time:"10:45 AM"},
  ],
  "2":[
    {from:"them",text:"Hi Rahul! Your February rent payment of ₹18,000 has been confirmed.",time:"Mar 3 9:00 AM"},
    {from:"me",  text:"Thanks for confirming!",time:"Mar 3 9:05 AM"},
    {from:"them",text:"Your receipt has been generated.",time:"Mar 3 9:05 AM"},
  ],
  "3":[
    {from:"them",text:"Dear residents, water supply will be interrupted on March 14 from 8 AM to 4 PM.",time:"Mar 1 11:00 AM"},
    {from:"me",  text:"Noted, thank you for informing us in advance.",time:"Mar 1 11:30 AM"},
  ],
};

export default function TenantMessagesPage() {
  const router = useRouter();
  const [mobileOpen,   setMobileOpen]   = useState(false);
  const [activeThread, setActiveThread] = useState("0");
  const [message,      setMessage]      = useState("");
  const [conversations, setConversations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const fetchConversations = async () => {
      try {
        setLoading(true);
        const response = await messageAPI.getAll();
        setConversations(response.data || []);
        setError(null);
        if (response.data && response.data.length > 0) {
          setActiveThread(String(response.data[0].id));
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch messages');
        setConversations([]);
      } finally {
        setLoading(false);
      }
    };
    fetchConversations();
  }, []);

  const formatConversation = (convo: any) => {
    const otherUser = convo.user1_id !== (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('rentmanager_user') || '{}').id : 0) ? convo.user1 : convo.user2;
    const initials = otherUser?.name?.split(' ').map((n: string) => n[0]).join('') || 'UN';
    const gradients = ['linear-gradient(135deg,#06b6d4,#8b5cf6)', 'linear-gradient(135deg,#f59e0b,#ef4444)', 
      'linear-gradient(135deg,#ef4444,#ec4899)', 'linear-gradient(135deg,#22c55e,#06b6d4)', 
      'linear-gradient(135deg,#8b5cf6,#6366f1)', 'linear-gradient(135deg,#06b6d4,#22c55e)'];
    
    return {
      id: String(convo.id),
      name: otherUser?.name || 'Unknown',
      initials,
      grad: gradients[convo.id % gradients.length],
      role: otherUser?.role || 'User',
      lastMsg: 'New conversation',
      time: new Date().toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
      unread: 0,
      online: false,
    };
  };

  const displayThreads = conversations.map(formatConversation);
  const thread = displayThreads.find(t => t.id === activeThread);
  const messages = chats[activeThread] || [];

  const sendMessage = () => {
    if (!message.trim() || !thread) return;
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
        .thread-item{display:flex;align-items:center;gap:12px;padding:14px 16px;cursor:pointer;transition:background .15s;border-bottom:1px solid rgba(30,45,71,0.5)}
        .thread-item:hover{background:rgba(255,255,255,0.03)}
        .thread-item.active{background:rgba(6,182,212,0.07);border-right:2px solid #06b6d4}
        .bubble{max-width:72%;padding:10px 14px;border-radius:13px;font-size:13px;line-height:1.55;word-break:break-word}
        .bubble.me{background:linear-gradient(135deg,#06b6d4,#0891b2);color:white;border-bottom-right-radius:4px;align-self:flex-end}
        .bubble.them{background:#111d33;border:1px solid #1e2d47;color:#e2e8f0;border-bottom-left-radius:4px;align-self:flex-start}
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
          .mob-overlay.open{display:block}
          .navbar{left:0;padding:0 16px}.page-main{left:0}
          .mob-burger{display:grid !important}
          .thread-panel{width:100% !important}
        }
      `}</style>

      <div className={`mob-overlay${mobileOpen?" open":""}`} onClick={()=>setMobileOpen(false)}/>

      {/* Sidebar */}
      <aside className={`sidebar${mobileOpen?" open":""}`}>
        <div style={{height:62,display:"flex",alignItems:"center",gap:12,padding:"0 20px",borderBottom:"1px solid #1e2d47",flexShrink:0}}>
          <div style={{position:"relative",width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:16,flexShrink:0}}>
            🏠<div style={{position:"absolute",inset:-3,borderRadius:12,border:"1.5px solid rgba(6,182,212,0.35)",animation:"pulse-ring 2s ease-out infinite",pointerEvents:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>RentManager</div>
            <div style={{fontSize:9,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em"}}>Tenant Portal</div>
          </div>
        </div>
        <div style={{margin:"14px 12px",background:"rgba(6,182,212,0.06)",border:"1px solid rgba(6,182,212,0.15)",borderRadius:12,padding:"14px"}}>
          <div style={{display:"flex",alignItems:"center",gap:10}}>
            <div style={{width:38,height:38,borderRadius:"50%",background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:14,fontWeight:700,flexShrink:0}}>{TENANT.initials}</div>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{TENANT.name}</div>
              <div style={{fontSize:11,color:"#06b6d4"}}>{TENANT.unit} · {TENANT.property.split(" ")[0]}</div>
              <div style={{fontSize:10,color:"#4a6080",marginTop:2}}>{TENANT.address}</div>
            </div>
          </div>
        </div>
        <nav style={{flex:1,padding:"4px 12px",overflowY:"auto"}}>
          {NAV_ITEMS.map(item=>(
            <Link key={item.href} href={item.href} className={`sb-link${item.active?" active":""}`} onClick={()=>setMobileOpen(false)}>
              <span style={{fontSize:15,width:18,textAlign:"center",flexShrink:0}}>{item.icon}</span>
              <span style={{flex:1}}>{item.label}</span>
              {"badge" in item&&item.badge&&<span style={{fontSize:10,fontWeight:700,padding:"2px 7px",borderRadius:10,background:item.active?"rgba(6,182,212,0.15)":"rgba(255,255,255,0.05)",color:item.active?"#06b6d4":"#4a6080"}}>{item.badge}</span>}
            </Link>
          ))}
        </nav>
        <div style={{padding:"13px 12px",borderTop:"1px solid #1e2d47",flexShrink:0}}>
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
            <div style={{fontSize:11,color:"#4a6080"}}>Chat with owner and support</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
 <Link href="/tenant/dashboard" className="nav-ico" style={{textDecoration:"none"}}>🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></Link>
        <Link href="/tenant/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none",flexShrink:0}}>RK</Link>
        </div>
      </header>

      <main className="page-main">
        {/* Thread list */}
        <div className="thread-panel" style={{width:280,borderRight:"1px solid #1e2d47",background:"#0d1526",display:"flex",flexDirection:"column",flexShrink:0}}>
          <div style={{padding:"14px 16px",borderBottom:"1px solid #1e2d47"}}>
            <div style={{display:"flex",alignItems:"center",gap:8,background:"#111d33",border:"1px solid #1e2d47",borderRadius:8,padding:"8px 12px"}}>
              <span style={{color:"#4a6080"}}>🔍</span>
              <input placeholder="Search…" style={{background:"none",border:"none",outline:"none",fontSize:13,color:"#e2e8f0",fontFamily:"inherit",width:"100%"}}/>
            </div>
          </div>
          <div style={{flex:1,overflowY:"auto"}}>
            {displayThreads.map(t=>(
              <div key={t.id} className={`thread-item${activeThread===t.id?" active":""}`} onClick={()=>setActiveThread(t.id)}>
                <div style={{position:"relative",flexShrink:0}}>
                  <div style={{width:42,height:42,borderRadius:12,background:t.grad,display:"grid",placeItems:"center",color:"white",fontSize:14,fontWeight:700}}>{t.initials}</div>
                  {t.online&&<div style={{position:"absolute",bottom:1,right:1,width:9,height:9,borderRadius:"50%",background:"#22c55e",border:"2px solid #0d1526"}}/>}
                </div>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{display:"flex",justifyContent:"space-between",marginBottom:2}}>
                    <span style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{t.name}</span>
                    <span style={{fontSize:10,color:"#4a6080",flexShrink:0}}>{t.time}</span>
                  </div>
                  <div style={{fontSize:11,color:"#4a6080",marginBottom:2}}>{t.role}</div>
                  <div style={{fontSize:11,color:"#4a6080",whiteSpace:"nowrap",overflow:"hidden",textOverflow:"ellipsis"}}>{t.lastMsg}</div>
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
              <div style={{fontSize:11,color:"#4a6080"}}>{thread.role} · {thread.online?"Online":"Offline"}</div>
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