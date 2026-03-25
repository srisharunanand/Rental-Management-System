"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { maintenanceAPI } from "@/app/services/api";

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
    { icon:"🔧", label:"Maintenance", href:"/owner/complaints", active:true, badge:"5" },
    { icon:"💬", label:"Messages",   href:"/owner/messages",   active:false },
    { icon:"⚙️", label:"Settings",  href:"/owner/settings",   active:false },
  ]},
];

type CompStatus = "open"|"in-progress"|"resolved"|"assigned"|"cancelled"|"completed";
type Priority   = "high"|"medium"|"low"|"urgent";

// Format maintenance request for display
const formatMaintenance = (req: any) => {
  const initials = req.tenant?.name?.split(' ').map((n: string) => n[0]).join('') || 'UN';
  const gradients = ['linear-gradient(135deg,#06b6d4,#8b5cf6)', 'linear-gradient(135deg,#f59e0b,#ef4444)', 
    'linear-gradient(135deg,#ef4444,#ec4899)', 'linear-gradient(135deg,#22c55e,#06b6d4)', 
    'linear-gradient(135deg,#8b5cf6,#6366f1)', 'linear-gradient(135deg,#06b6d4,#22c55e)'];
  
  const statusMap: Record<string, CompStatus> = {
    'in_progress': 'in-progress',
    'completed': 'resolved',
    'assigned': 'assigned'
  };
  
  return {
    id: `MR-${String(req.id).padStart(3, '0')}`,
    title: req.title || 'Unknown',
    tenant: req.tenant?.name || 'Unknown',
    initials,
    unit: req.unit?.unit_number || 'N/A',
    property: req.unit?.property?.name || 'N/A',
    category: req.category || 'other',
    status: (statusMap[req.status] || req.status || 'open') as CompStatus,
    priority: (req.priority || 'medium') as Priority,
    date: new Date(req.created_at).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    note: req.notes || 'No notes',
    grad: gradients[req.id % gradients.length],
  };
};

const STATUS_MAP: Record<CompStatus,{bg:string;any|null>(null);
  const [requests,   setRequests]   = useState<any[]>([]);
  const [loading,    setLoading]    = useState(true);
  const [error,      setError]      = useState<string|null>(null);

  useEffect(() => {
    const fetchRequests = async () => {
      try {
        setLoading(true);
        const response = await maintenanceAPI.getAll();
        setRequests(response.data || []);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch maintenance requests');
        setRequests([]);
      } finally {
        setLoading(false);
      }
    };displayRequests
    fetchRequests();
  }, []);

  const displayRequests = requests.map(formatMaintenance
  "open":        {bg:"rgba(244,63,94,0.1)",  color:"#f43f5e", label:"🔴 Open"},
  "in-progress": {bg:"rgba(245,158,11,0.1)", color:"#f59e0b", label:"🟡 In Progress"},
  "resolved":    {bg:"rgba(34,197,94,0.1)",  color:"#22c55e", label:"🟢 Resolved"},
};
const PRI_MAP: Record<Priority,{color:string;label:string}> = {
  high:   {color:"#f43f5e", label:"🔴 High"},
  medium: {color:"#f59e0b", label:"🟡 Medium"},
  low:    {color:"#06b6d4", label:"🔵 Low"},
};

export default function ComplaintsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter,     setFilter]     = useState<CompStatus|"all">("all");
  const [search,     setSearch]     = useState("");
  const [selected,   setSelected]   = useState<typeof COMPLAINTS[0]|null>(null);

  const filtered = COMPLAINTS.filter(c=>
    (filter==="all"||c.status===filter)&&
    (c.title.toLowerCase().includes(search.toLowerCase())||
     c.tenant.toLowerCase().includes(search.toLowerCase())||
     c.property.toLowerCase().includes(search.toLowerCase()))
  );

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#1e2d47;border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.6);opacity:0}}
        .a1{animation:fadeUp .4s ease both .05s}.a2{animation:fadeUp .4s ease both .10s}
        .a3{animation:fadeUp .4s ease both .15s}.a4{animation:fadeUp .4s ease both .20s}
        .sb-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;font-size:13px;font-weight:500;color:#94a3b8;cursor:pointer;transition:all .15s;text-decoration:none;margin-bottom:2px;border:1px solid transparent}
        .sb-link:hover{background:rgba(255,255,255,0.04);color:#e2e8f0}
        .sb-link.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.15)}
        .sidebar{position:fixed;top:0;left:0;bottom:0;width:250px;background:#0d1526;border-right:1px solid #1e2d47;display:flex;flex-direction:column;z-index:300;transition:transform .3s ease}
        .navbar{position:fixed;top:0;left:250px;right:0;height:62px;background:#0d1526;border-bottom:1px solid #1e2d47;display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:200}
        .page-main{margin-left:250px;margin-top:62px;padding:26px;min-height:calc(100vh - 62px)}
        .glass-card{background:#111d33;border:1px solid #1e2d47;border-radius:14px;padding:20px;position:relative;overflow:hidden}
        .glass-card::after{content:'';position:absolute;bottom:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.25),transparent)}
        .comp-card{background:#0d1526;border:1px solid #1e2d47;border-radius:12px;padding:16px;margin-bottom:10px;cursor:pointer;transition:border-color .15s,transform .15s}
        .comp-card:hover{border-color:rgba(6,182,212,0.4);transform:translateX(3px)}
        .comp-card:last-child{margin-bottom:0}
        .filter-btn{padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #1e2d47;background:#111d33;color:#94a3b8;transition:all .15s;font-family:inherit}
        .filter-btn.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.3)}
        .filter-btn:hover{border-color:#06b6d4;color:#06b6d4}
        .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:250;backdrop-filter:blur(2px)}
        .nav-ico{width:36px;height:36px;border-radius:8px;background:#111d33;border:1px solid #1e2d47;display:grid;place-items:center;cursor:pointer;font-size:15px;position:relative;transition:border-color .2s;flex-shrink:0}
        .nav-ico:hover{border-color:#06b6d4}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px}
        .modal-card{background:#0d1526;border:1px solid #1e2d47;border-radius:18px;padding:28px;width:100%;max-width:500px;position:relative;max-height:90vh;overflow-y:auto}
        .comp-grid{display:grid;grid-template-columns:1fr 1fr;gap:16px}
        @media(max-width:900px){.comp-grid{grid-template-columns:1fr}}
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
          .mob-overlay.open{display:block}
          .navbar{left:0;padding:0 16px}.page-main{margin-left:0;padding:16px}
          .mob-burger{display:grid !important}.nav-search-wrap{display:none}
        }
      `}</style>

      <div className={`mob-overlay${mobileOpen?" open":""}`} onClick={()=>setMobileOpen(false)}/>

      {/* Detail Modal */}
      {selected&&(
        <div className="modal-bg" onClick={()=>setSelected(null)}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setSelected(null)} style={{position:"absolute",top:16,right:16,background:"none",border:"1px solid #1e2d47",borderRadius:8,width:30,height:30,display:"grid",placeItems:"center",cursor:"pointer",color:"#94a3b8",fontSize:14,fontFamily:"inherit"}}>✕</button>
            <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:20}}>
              <div style={{width:42,height:42,borderRadius:11,background:"rgba(6,182,212,0.1)",border:"1px solid rgba(6,182,212,0.2)",display:"grid",placeItems:"center",fontSize:20}}>🔧</div>
              <div>
                <div style={{fontSize:16,fontWeight:800,color:"#e2e8f0"}}>{selected.title}</div>
                <div style={{fontSize:12,color:"#4a6080"}}>{selected.id} · {selected.category}</div>
              </div>
            </div>
            {[
              ["👤 Tenant",    selected.tenant],
              ["🏠 Unit",      `${selected.unit} · ${selected.property}`],
              ["📅 Raised On", selected.date],
              ["🔴 Priority",  PRI_MAP[selected.priority].label],
              ["📝 Note",      selected.note],
            ].map(([k,v])=>(
              <div key={k as string} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid #1e2d47",fontSize:13,gap:12}}>
                <span style={{color:"#4a6080",flexShrink:0}}>{k}</span>
                <span style={{color:"#e2e8f0",fontWeight:500,textAlign:"right"}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:16,marginBottom:16,display:"flex",gap:8}}>
              {(["open","in-progress","resolved"] as CompStatus[]).map(s=>(
                <button key={s} style={{flex:1,padding:"9px 6px",borderRadius:9,border:`1px solid ${selected.status===s?STATUS_MAP[s].color:"#1e2d47"}`,background:selected.status===s?STATUS_MAP[s].bg:"transparent",color:selected.status===s?STATUS_MAP[s].color:"#4a6080",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                  {STATUS_MAP[s].label}
                </button>
              ))}
            </div>
            <div style={{background:"rgba(255,255,255,0.03)",border:"1px solid #1e2d47",borderRadius:10,padding:14}}>
              <div style={{fontSize:11,fontWeight:600,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:8}}>Add Note</div>
              <textarea placeholder="Type update or response…" style={{width:"100%",background:"none",border:"none",outline:"none",color:"#e2e8f0",fontSize:13,fontFamily:"inherit",resize:"none",height:70}}/>
            </div>
            <button style={{marginTop:14,width:"100%",padding:"11px",background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",border:"none",borderRadius:10,color:"white",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
              Update Status →
            </button>
          </div>
        </div>
      )}

      {/* Sidebar */}
      <aside className={`sidebar${mobileOpen?" open":""}`}>
        <div style={{height:62,display:"flex",alignItems:"center",gap:12,padding:"0 20px",borderBottom:"1px solid #1e2d47",flexShrink:0}}>
          <div style={{position:"relative",width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:16,flexShrink:0,boxShadow:"0 0 16px rgba(6,182,212,0.3)"}}>
            🏠<div style={{position:"absolute",inset:-3,borderRadius:12,border:"1.5px solid rgba(6,182,212,0.35)",animation:"pulse-ring 2s ease-out infinite",pointerEvents:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",letterSpacing:"-0.02em"}}>RentManager</div>
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
        <div style={{padding:"14px 12px",borderTop:"1px solid #1e2d47",flexShrink:0}}>
          <button onClick={()=>{localStorage.removeItem("rentmanager_user");document.cookie="role=; path=/; max-age=0";router.push("/login");}}
            style={{display:"flex",alignItems:"center",gap:10,padding:9,borderRadius:9,cursor:"pointer",background:"transparent",border:"1px solid transparent",color:"#f43f5e",fontSize:13,fontWeight:500,fontFamily:"inherit",width:"100%",transition:"all .15s"}}
            onMouseEnter={e=>{(e.currentTarget as HTMLButtonElement).style.background="rgba(244,63,94,0.07)";(e.currentTarget as HTMLButtonElement).style.borderColor="rgba(244,63,94,0.2)"}}
            onMouseLeave={e=>{(e.currentTarget as HTMLButtonElement).style.background="transparent";(e.currentTarget as HTMLButtonElement).style.borderColor="transparent"}}>
            <span style={{fontSize:15,width:18,textAlign:"center"}}>🚪</span><span>Logout</span>
          </button>
        </div>
      </aside>

      <header className="navbar">
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button className="mob-burger" onClick={()=>setMobileOpen(true)} style={{display:"none",background:"none",border:"1px solid #1e2d47",borderRadius:7,padding:"6px 8px",cursor:"pointer",color:"#94a3b8",fontSize:16,fontFamily:"inherit"}}>☰</button>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>Complaints</div>
            <div style={{fontSize:11,color:"#4a6080"}}>Home → Complaints</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="nav-search-wrap" style={{display:"flex",alignItems:"center",gap:8,background:"#111d33",border:"1px solid #1e2d47",borderRadius:8,padding:"7px 12px",width:220}}>
            <span style={{color:"#4a6080",fontSize:13}}>🔍</span>
            <input type="text" placeholder="Search complaints…" value={search} onChange={e=>setSearch(e.target.value)} style={{background:"none",border:"none",outline:"none",fontSize:13,color:"#e2e8f0",fontFamily:"inherit",width:"100%"}}/>
          </div>
          <Link href="/owner/complaints" className="nav-ico" style={{textDecoration:"none"}}>🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></Link>
          <Link href="/owner/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none"}}>AK</Link>
        </div>
      </header>

      <main className="page-main">
        <div className="a1" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14,marginBottom:22}}>
          <div>
            <div style={{fontSize:"clamp(18px,2.5vw,24px)",fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em"}}>Complaints & Maintenance</div>
            <div style={{fontSize:13,color:"#94a3b8",marginTop:3}}>{COMPLAINTS.filter(c=>c.status!=="resolved").length} open · {COMPLAINTS.filter(c=>c.status==="resolved").length} resolved</div>
          </div>
        </div>

        {/* Stats */}
        <div className="a2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:20}}>
          {[
            {icon:"🔴",label:"Open",        value:COMPLAINTS.filter(c=>c.status==="open").length,        color:"#f43f5e",bg:"rgba(244,63,94,0.1)"},
            {icon:"🟡",label:"In Progress", value:COMPLAINTS.filter(c=>c.status==="in-progress").length, color:"#f59e0b",bg:"rgba(245,158,11,0.1)"},
            {icon:"🟢",label:"Resolved",    value:COMPLAINTS.filter(c=>c.status==="resolved").length,    color:"#22c55e",bg:"rgba(34,197,94,0.1)"},
            {icon:"🔥",label:"High Priority",value:COMPLAINTS.filter(c=>c.priority==="high").length,     color:"#f43f5e",bg:"rgba(244,63,94,0.1)"},
          ].map(s=>(
            <div key={s.label} style={{background:"#111d33",border:"1px solid #1e2d47",borderRadius:12,padding:"16px",display:"flex",alignItems:"center",gap:12}}>
              <div style={{width:36,height:36,borderRadius:9,background:s.bg,display:"grid",placeItems:"center",fontSize:16,flexShrink:0}}>{s.icon}</div>
              <div>
                <div style={{fontSize:22,fontWeight:800,color:s.color,letterSpacing:"-0.02em"}}>{s.value}</div>
                <div style={{fontSize:11,color:"#4a6080"}}>{s.label}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="a3" style={{display:"flex",gap:8,flexWrap:"wrap",marginBottom:16}}>
          {(["all","open","in-progress","resolved"] as const).map(f=>(
            <button key={f} className={`filter-btn${filter===f?" active":""}`} onClick={()=>setFilter(f as CompStatus|"all")}>
              {f==="all"?"All":f==="open"?"🔴 Open":f==="in-progress"?"🟡 In Progress":"🟢 Resolved"}
            </button>
          ))}
        </div>

        {/* Complaints grid */}
        <div className="comp-grid a4">
          {/* Left: open + in-progress */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>
              Active — {filtered.filter(c=>c.status!=="resolved").length}
            </div>
            {filtered.filter(c=>filter==="all"?c.status!=="resolved":true).map(c=>(
              <div key={c.id} className="comp-card" onClick={()=>setSelected(c)}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:10}}>
                  <div style={{display:"flex",alignItems:"center",gap:10}}>
                    <div style={{width:4,height:36,borderRadius:2,background:PRI_MAP[c.priority].color,flexShrink:0}}/>
                    <div>
                      <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0",lineHeight:1.3}}>{c.title}</div>
                      <div style={{fontSize:11,color:"#4a6080"}}>{c.id} · {c.category}</div>
                    </div>
                  </div>
                  <span style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:20,background:STATUS_MAP[c.status].bg,color:STATUS_MAP[c.status].color,whiteSpace:"nowrap",flexShrink:0}}>{STATUS_MAP[c.status].label}</span>
                </div>
                <div style={{display:"flex",alignItems:"center",gap:8,marginBottom:8}}>
                  <div style={{width:24,height:24,borderRadius:6,background:c.grad,display:"grid",placeItems:"center",color:"white",fontSize:10,fontWeight:700,flexShrink:0}}>{c.initials}</div>
                  <span style={{fontSize:12,color:"#94a3b8"}}>{c.tenant} · {c.unit} · {c.property}</span>
                </div>
                <div style={{fontSize:11,color:"#4a6080",display:"flex",justifyContent:"space-between"}}>
                  <span>📅 {c.date}</span>
                  <span style={{color:PRI_MAP[c.priority].color,fontWeight:600}}>{PRI_MAP[c.priority].label}</span>
                </div>
                {c.note&&<div style={{marginTop:8,fontSize:11,color:"#64748b",background:"rgba(255,255,255,0.03)",borderRadius:7,padding:"7px 10px"}}>💬 {c.note}</div>}
              </div>
            ))}
            {filtered.filter(c=>filter==="all"?c.status!=="resolved":true).length===0&&(
              <div style={{textAlign:"center",padding:"40px 20px",color:"#4a6080"}}>
                <div style={{fontSize:32,marginBottom:8}}>✅</div>
                <div style={{fontSize:14,color:"#94a3b8"}}>No active complaints</div>
              </div>
            )}
          </div>

          {/* Right: resolved */}
          <div>
            <div style={{fontSize:12,fontWeight:700,color:"#4a6080",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:12}}>
              Resolved — {filtered.filter(c=>c.status==="resolved").length}
            </div>
            {filtered.filter(c=>c.status==="resolved").map(c=>(
              <div key={c.id} className="comp-card" onClick={()=>setSelected(c)} style={{opacity:0.7}}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:8}}>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0",lineHeight:1.3}}>{c.title}</div>
                    <div style={{fontSize:11,color:"#4a6080"}}>{c.id} · {c.category}</div>
                  </div>
                  <span style={{fontSize:10,fontWeight:600,padding:"3px 8px",borderRadius:20,background:STATUS_MAP[c.status].bg,color:STATUS_MAP[c.status].color,whiteSpace:"nowrap",flexShrink:0}}>{STATUS_MAP[c.status].label}</span>
                </div>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:6}}>{c.tenant} · {c.unit}</div>
                <div style={{fontSize:11,color:"#4a6080"}}>📅 {c.date} &nbsp;·&nbsp; ✅ {c.note}</div>
              </div>
            ))}
            {filtered.filter(c=>c.status==="resolved").length===0&&(
              <div style={{textAlign:"center",padding:"40px 20px",color:"#4a6080"}}>
                <div style={{fontSize:32,marginBottom:8}}>🔧</div>
                <div style={{fontSize:14,color:"#94a3b8"}}>No resolved complaints yet</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}