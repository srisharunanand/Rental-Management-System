"use client";
import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

const NAV_SECTIONS = [
  { label: "Main", items: [
    { icon:"⚡", label:"Dashboard", href:"/owner/dashboard", active:false },
    { icon:"🏠", label:"Houses",   href:"/owner/houses",    active:false },
    { icon:"👥", label:"Tenants",  href:"/owner/tenants",   active:true, badge:"12" },
    { icon:"📋", label:"Leases",   href:"/owner/leases",    active:false },
  ]},
  { label:"Finance", items:[
    { icon:"💳", label:"Payments",  href:"/owner/payments",  active:false, badge:"3" },
    { icon:"📈", label:"Analytics", href:"/owner/analytics", active:false },
    { icon:"🧾", label:"Invoices",  href:"/owner/invoices",  active:false },
  ]},
  { label:"Tools", items:[
    { icon:"🔧", label:"Maintenance", href:"/owner/complaints", active:false, badge:"5" },
    { icon:"💬", label:"Messages",   href:"/owner/messages",   active:false },
    { icon:"⚙️", label:"Settings",  href:"/owner/settings",   active:false },
  ]},
];

type PayStatus = "paid" | "pending" | "overdue";

const TENANTS: {
  id:string; initials:string; name:string; phone:string; email:string;
  unit:string; property:string; rent:string; status:PayStatus;
  since:string; leaseEnd:string; grad:string;
}[] = [
  { id:"T001", initials:"RK", name:"Rahul Krishnan", phone:"+91 98400 11111", email:"rahul@email.com", unit:"Unit 4B", property:"Greenview Apt",  rent:"₹18,000", status:"paid",    since:"Jan 2024", leaseEnd:"Dec 2026", grad:"linear-gradient(135deg,#06b6d4,#8b5cf6)" },
  { id:"T002", initials:"PM", name:"Priya Mehta",    phone:"+91 98400 22222", email:"priya@email.com", unit:"Unit 2A", property:"Sunrise Villas", rent:"₹22,000", status:"pending", since:"Mar 2023", leaseEnd:"Feb 2025", grad:"linear-gradient(135deg,#f59e0b,#ef4444)" },
  { id:"T003", initials:"SS", name:"Suresh Sharma",  phone:"+91 98400 33333", email:"suresh@email.com",unit:"Unit 1C", property:"Palm Heights",   rent:"₹15,000", status:"overdue", since:"Jun 2022", leaseEnd:"May 2024", grad:"linear-gradient(135deg,#ef4444,#ec4899)" },
  { id:"T004", initials:"AN", name:"Anjali Nair",    phone:"+91 98400 44444", email:"anjali@email.com",unit:"Unit 3D", property:"Greenview Apt",  rent:"₹20,000", status:"paid",    since:"Nov 2023", leaseEnd:"Oct 2025", grad:"linear-gradient(135deg,#22c55e,#06b6d4)" },
  { id:"T005", initials:"DV", name:"Divya Varma",    phone:"+91 98400 55555", email:"divya@email.com", unit:"Unit 5A", property:"Palm Heights",   rent:"₹17,500", status:"paid",    since:"Feb 2024", leaseEnd:"Jan 2027", grad:"linear-gradient(135deg,#8b5cf6,#6366f1)" },
  { id:"T006", initials:"KR", name:"Karthik Raj",    phone:"+91 98400 66666", email:"karthik@email.com",unit:"Unit 6B",property:"Royal Enclave",   rent:"₹30,000", status:"pending", since:"Apr 2023", leaseEnd:"Mar 2025", grad:"linear-gradient(135deg,#06b6d4,#22c55e)" },
];

const PAY_MAP: Record<PayStatus,{bg:string;color:string;label:string}> = {
  paid:    {bg:"rgba(34,197,94,0.1)",  color:"#22c55e",label:"✓ Paid"},
  pending: {bg:"rgba(245,158,11,0.1)", color:"#f59e0b",label:"⏳ Pending"},
  overdue: {bg:"rgba(244,63,94,0.1)",  color:"#f43f5e",label:"✗ Overdue"},
};

export default function TenantsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [search,     setSearch]     = useState("");
  const [filter,     setFilter]     = useState<PayStatus|"all">("all");
  const [showModal,  setShowModal]  = useState(false);
  const [selected,   setSelected]   = useState<typeof TENANTS[0]|null>(null);

  const filtered = TENANTS.filter(t=>
    (filter==="all"||t.status===filter)&&
    (t.name.toLowerCase().includes(search.toLowerCase())||
     t.property.toLowerCase().includes(search.toLowerCase()))
  );

  return(
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        ::-webkit-scrollbar{width:4px;height:4px}
        ::-webkit-scrollbar-thumb{background:#1e2d47;border-radius:4px}
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
        .tenant-row{display:grid;grid-template-columns:2fr 1.2fr 1fr 1fr 1fr auto;align-items:center;gap:12px;padding:14px 16px;border-radius:11px;border:1px solid #1e2d47;background:#0d1526;margin-bottom:8px;transition:border-color .15s;cursor:pointer}
        .tenant-row:hover{border-color:rgba(6,182,212,0.35)}
        .tenant-row:last-child{margin-bottom:0}
        .filter-btn{padding:7px 14px;border-radius:8px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #1e2d47;background:#111d33;color:#94a3b8;transition:all .15s;font-family:inherit}
        .filter-btn.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.3)}
        .filter-btn:hover{border-color:#06b6d4;color:#06b6d4}
        .add-btn{background:linear-gradient(135deg,#06b6d4,#8b5cf6);border:none;border-radius:10px;padding:10px 18px;font-size:13px;font-weight:700;color:white;cursor:pointer;font-family:inherit;transition:transform .15s,box-shadow .15s;white-space:nowrap}
        .add-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(6,182,212,0.35)}
        .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:250;backdrop-filter:blur(2px)}
        .nav-ico{width:36px;height:36px;border-radius:8px;background:#111d33;border:1px solid #1e2d47;display:grid;place-items:center;cursor:pointer;font-size:15px;position:relative;transition:border-color .2s;flex-shrink:0}
        .nav-ico:hover{border-color:#06b6d4}
        .modal-bg{position:fixed;inset:0;background:rgba(0,0,0,0.7);backdrop-filter:blur(4px);z-index:500;display:flex;align-items:center;justify-content:center;padding:16px}
        .modal-card{background:#0d1526;border:1px solid #1e2d47;border-radius:18px;padding:28px;width:100%;max-width:480px;position:relative;max-height:90vh;overflow-y:auto}
        .inp{width:100%;padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid #1e2d47;border-radius:9px;color:#e2e8f0;font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}
        .inp:focus{border-color:rgba(6,182,212,0.5)}
        .inp::placeholder{color:#334155}
        .table-wrap{overflow-x:auto}
        .tenant-row-header{display:grid;grid-template-columns:2fr 1.2fr 1fr 1fr 1fr auto;gap:12px;padding:0 16px 10px;font-size:10px;font-weight:700;color:#4a6080;text-transform:uppercase;letter-spacing:.1em}
        @media(max-width:900px){
          .tenant-row,.tenant-row-header{grid-template-columns:2fr 1fr 1fr auto}
          .hide-md{display:none}
        }
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%)}
          .sidebar.open{transform:translateX(0)}
          .mob-overlay.open{display:block}
          .navbar{left:0;padding:0 16px}
          .page-main{margin-left:0;padding:16px}
          .mob-burger{display:grid !important}
          .nav-search-wrap{display:none}
          .tenant-row,.tenant-row-header{grid-template-columns:1fr 1fr auto}
          .hide-sm{display:none}
        }
      `}</style>

      <div className={`mob-overlay${mobileOpen?" open":""}`} onClick={()=>setMobileOpen(false)}/>

      {/* Add Tenant Modal */}
      {showModal&&(
        <div className="modal-bg" onClick={()=>setShowModal(false)}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setShowModal(false)} style={{position:"absolute",top:16,right:16,background:"none",border:"1px solid #1e2d47",borderRadius:8,width:30,height:30,display:"grid",placeItems:"center",cursor:"pointer",color:"#94a3b8",fontSize:14,fontFamily:"inherit"}}>✕</button>
            <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0",marginBottom:4}}>Add New Tenant</div>
            <div style={{fontSize:12,color:"#4a6080",marginBottom:22}}>Fill in tenant details below</div>
            <div style={{display:"flex",flexDirection:"column",gap:14}}>
              {[
                {label:"Full Name",       placeholder:"e.g. Rahul Krishnan"},
                {label:"Phone Number",    placeholder:"+91 98400 XXXXX"},
                {label:"Email Address",   placeholder:"tenant@email.com"},
                {label:"Assign Unit",     placeholder:"e.g. Unit 4B"},
                {label:"Property",        placeholder:"Select property"},
                {label:"Monthly Rent (₹)",placeholder:"e.g. 18000"},
                {label:"Lease Start",     placeholder:"DD/MM/YYYY"},
                {label:"Lease End",       placeholder:"DD/MM/YYYY"},
              ].map(f=>(
                <div key={f.label}>
                  <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{f.label}</div>
                  <input className="inp" placeholder={f.placeholder}/>
                </div>
              ))}
              <button className="add-btn" style={{marginTop:6,width:"100%",padding:"12px"}}>Save Tenant →</button>
            </div>
          </div>
        </div>
      )}

      {/* Tenant Detail Modal */}
      {selected&&(
        <div className="modal-bg" onClick={()=>setSelected(null)}>
          <div className="modal-card" onClick={e=>e.stopPropagation()}>
            <button onClick={()=>setSelected(null)} style={{position:"absolute",top:16,right:16,background:"none",border:"1px solid #1e2d47",borderRadius:8,width:30,height:30,display:"grid",placeItems:"center",cursor:"pointer",color:"#94a3b8",fontSize:14,fontFamily:"inherit"}}>✕</button>
            <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:22}}>
              <div style={{width:52,height:52,borderRadius:14,background:selected.grad,display:"grid",placeItems:"center",color:"white",fontSize:18,fontWeight:700,flexShrink:0}}>{selected.initials}</div>
              <div>
                <div style={{fontSize:18,fontWeight:800,color:"#e2e8f0"}}>{selected.name}</div>
                <div style={{fontSize:12,color:"#4a6080"}}>{selected.unit} · {selected.property}</div>
              </div>
            </div>
            {[
              ["📞 Phone",    selected.phone],
              ["📧 Email",    selected.email],
              ["💳 Rent",     selected.rent+"/mo"],
              ["📅 Since",    selected.since],
              ["📋 Lease End",selected.leaseEnd],
              ["🆔 Tenant ID",selected.id],
            ].map(([k,v])=>(
              <div key={k as string} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid #1e2d47",fontSize:13}}>
                <span style={{color:"#4a6080"}}>{k}</span>
                <span style={{color:"#e2e8f0",fontWeight:600}}>{v}</span>
              </div>
            ))}
            <div style={{marginTop:16,padding:"10px 14px",borderRadius:10,background:PAY_MAP[selected.status].bg,display:"flex",justifyContent:"space-between",alignItems:"center"}}>
              <span style={{fontSize:13,color:"#94a3b8"}}>Payment Status</span>
              <span style={{fontSize:13,fontWeight:700,color:PAY_MAP[selected.status].color}}>{PAY_MAP[selected.status].label}</span>
            </div>
            <div style={{display:"flex",gap:8,marginTop:16}}>
              <button className="add-btn" style={{flex:1,padding:"10px"}}>✏️ Edit</button>
              <button style={{flex:1,padding:"10px",background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.2)",borderRadius:10,color:"#f43f5e",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>🗑️ Remove</button>
            </div>
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

      {/* Navbar */}
      <header className="navbar">
        <div style={{display:"flex",alignItems:"center",gap:14}}>
          <button className="mob-burger" onClick={()=>setMobileOpen(true)} style={{display:"none",background:"none",border:"1px solid #1e2d47",borderRadius:7,padding:"6px 8px",cursor:"pointer",color:"#94a3b8",fontSize:16,fontFamily:"inherit"}}>☰</button>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>Tenants</div>
            <div style={{fontSize:11,color:"#4a6080"}}>Home → Tenants</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <div className="nav-search-wrap" style={{display:"flex",alignItems:"center",gap:8,background:"#111d33",border:"1px solid #1e2d47",borderRadius:8,padding:"7px 12px",width:220}}>
            <span style={{color:"#4a6080",fontSize:13}}>🔍</span>
            <input type="text" placeholder="Search tenants…" value={search} onChange={e=>setSearch(e.target.value)} style={{background:"none",border:"none",outline:"none",fontSize:13,color:"#e2e8f0",fontFamily:"inherit",width:"100%"}}/>
          </div>
          <Link href="/owner/complaints" className="nav-ico" style={{textDecoration:"none"}}>🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></Link>
          <Link href="/owner/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,cursor:"pointer",flexShrink:0,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none"}}>AK</Link>
        </div>
      </header>

      {/* Main */}
      <main className="page-main">

        {/* Header */}
        <div className="a1" style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:14,marginBottom:22}}>
          <div>
            <div style={{fontSize:"clamp(18px,2.5vw,24px)",fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em"}}>Tenants</div>
            <div style={{fontSize:13,color:"#94a3b8",marginTop:3}}>{TENANTS.length} total tenants across all properties</div>
          </div>
          <button className="add-btn" onClick={()=>setShowModal(true)}>+ Add Tenant</button>
        </div>

        {/* Summary stats */}
        <div className="a2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(130px,1fr))",gap:12,marginBottom:20}}>
          {[
            {icon:"👥",label:"Total",   value:TENANTS.length,                               color:"#06b6d4",bg:"rgba(6,182,212,0.1)"},
            {icon:"✅",label:"Paid",    value:TENANTS.filter(t=>t.status==="paid").length,   color:"#22c55e",bg:"rgba(34,197,94,0.1)"},
            {icon:"⏳",label:"Pending", value:TENANTS.filter(t=>t.status==="pending").length,color:"#f59e0b",bg:"rgba(245,158,11,0.1)"},
            {icon:"⚠️",label:"Overdue", value:TENANTS.filter(t=>t.status==="overdue").length,color:"#f43f5e",bg:"rgba(244,63,94,0.1)"},
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
          {(["all","paid","pending","overdue"] as const).map(f=>(
            <button key={f} className={`filter-btn${filter===f?" active":""}`} onClick={()=>setFilter(f)}>
              {f==="all"?"All":f==="paid"?"✅ Paid":f==="pending"?"⏳ Pending":"⚠️ Overdue"}
            </button>
          ))}
        </div>

        {/* Tenant list */}
        <div className="glass-card a4">
          <div className="tenant-row-header">
            <span>Tenant</span>
            <span>Property</span>
            <span className="hide-md">Rent</span>
            <span className="hide-md">Lease End</span>
            <span>Status</span>
            <span></span>
          </div>
          <div style={{display:"flex",flexDirection:"column",gap:0}}>
            {filtered.map(t=>(
              <div key={t.id} className="tenant-row" onClick={()=>setSelected(t)}>
                <div style={{display:"flex",alignItems:"center",gap:10}}>
                  <div style={{width:36,height:36,borderRadius:10,background:t.grad,display:"grid",placeItems:"center",color:"white",fontSize:13,fontWeight:700,flexShrink:0}}>{t.initials}</div>
                  <div>
                    <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0"}}>{t.name}</div>
                    <div style={{fontSize:11,color:"#4a6080"}}>{t.unit} · {t.id}</div>
                  </div>
                </div>
                <div style={{fontSize:12,color:"#94a3b8"}}>{t.property}</div>
                <div className="hide-md" style={{fontSize:13,fontWeight:700,color:"#e2e8f0"}}>{t.rent}</div>
                <div className="hide-md" style={{fontSize:12,color:"#4a6080"}}>{t.leaseEnd}</div>
                <span style={{display:"inline-flex",alignItems:"center",padding:"3px 9px",borderRadius:20,fontSize:11,fontWeight:600,background:PAY_MAP[t.status].bg,color:PAY_MAP[t.status].color,whiteSpace:"nowrap"}}>{PAY_MAP[t.status].label}</span>
                <button style={{padding:"6px 10px",background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:8,color:"#06b6d4",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit",flexShrink:0}}
                  onClick={e=>{e.stopPropagation();setSelected(t)}}>
                  View
                </button>
              </div>
            ))}
            {filtered.length===0&&(
              <div style={{textAlign:"center",padding:"40px 20px",color:"#4a6080"}}>
                <div style={{fontSize:32,marginBottom:8}}>👥</div>
                <div style={{fontSize:14,color:"#94a3b8"}}>No tenants found</div>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}