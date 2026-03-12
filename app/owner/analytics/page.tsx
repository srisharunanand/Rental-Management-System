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
    { icon:"📈", label:"Analytics", href:"/owner/analytics", active:true },
    { icon:"🧾", label:"Invoices",  href:"/owner/invoices",  active:false },
  ]},
  { label:"Tools", items:[
    { icon:"🔧", label:"Maintenance", href:"/owner/complaints", active:false, badge:"5" },
    { icon:"💬", label:"Messages",   href:"/owner/messages",   active:false },
    { icon:"⚙️", label:"Settings",  href:"/owner/settings",   active:false },
  ]},
];

const MONTHLY = [
  { month:"Sep", income:78500, target:82000, occupancy:85 },
  { month:"Oct", income:82000, target:82000, occupancy:88 },
  { month:"Nov", income:79500, target:85000, occupancy:86 },
  { month:"Dec", income:85000, target:85000, occupancy:91 },
  { month:"Jan", income:88500, target:90000, occupancy:93 },
  { month:"Feb", income:90000, target:90000, occupancy:94 },
  { month:"Mar", income:54000, target:92000, occupancy:72 },
];

const PROPERTIES = [
  { name:"Greenview Apt",  units:12, occupied:11, income:"₹2,18,000", color:"#06b6d4" },
  { name:"Sunrise Villas", units:8,  occupied:6,  income:"₹1,32,000", color:"#8b5cf6" },
  { name:"Palm Heights",   units:10, occupied:9,  income:"₹1,57,500", color:"#22c55e" },
  { name:"Royal Enclave",  units:20, occupied:15, income:"₹4,50,000", color:"#f59e0b" },
];

const EXPENSE_CATS = [
  { label:"Maintenance",  pct:38, color:"#f43f5e" },
  { label:"Utilities",    pct:22, color:"#f59e0b" },
  { label:"Taxes",        pct:20, color:"#8b5cf6" },
  { label:"Insurance",    pct:12, color:"#06b6d4" },
  { label:"Other",        pct:8,  color:"#4a6080" },
];

const maxIncome = Math.max(...MONTHLY.map(m=>m.target));

export default function AnalyticsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [period, setPeriod] = useState("7m");

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#1e2d47;border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.6);opacity:0}}
        @keyframes growBar{from{height:0}to{height:var(--h)}}
        .a1{animation:fadeUp .4s ease both .05s}.a2{animation:fadeUp .4s ease both .10s}
        .a3{animation:fadeUp .4s ease both .15s}.a4{animation:fadeUp .4s ease both .20s}.a5{animation:fadeUp .4s ease both .25s}
        .sb-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;font-size:13px;font-weight:500;color:#94a3b8;cursor:pointer;transition:all .15s;text-decoration:none;margin-bottom:2px;border:1px solid transparent}
        .sb-link:hover{background:rgba(255,255,255,0.04);color:#e2e8f0}
        .sb-link.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.15)}
        .sidebar{position:fixed;top:0;left:0;bottom:0;width:250px;background:#0d1526;border-right:1px solid #1e2d47;display:flex;flex-direction:column;z-index:300;transition:transform .3s ease}
        .navbar{position:fixed;top:0;left:250px;right:0;height:62px;background:#0d1526;border-bottom:1px solid #1e2d47;display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:200}
        .page-main{margin-left:250px;margin-top:62px;padding:26px;min-height:calc(100vh - 62px)}
        .glass-card{background:#111d33;border:1px solid #1e2d47;border-radius:14px;padding:20px;position:relative;overflow:hidden}
        .glass-card::after{content:'';position:absolute;bottom:0;left:20%;right:20%;height:1px;background:linear-gradient(90deg,transparent,rgba(6,182,212,0.25),transparent)}
        .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:250;backdrop-filter:blur(2px)}
        .nav-ico{width:36px;height:36px;border-radius:8px;background:#111d33;border:1px solid #1e2d47;display:grid;place-items:center;cursor:pointer;font-size:15px;position:relative;transition:border-color .2s;flex-shrink:0}
        .period-btn{padding:6px 13px;border-radius:7px;font-size:12px;font-weight:600;cursor:pointer;border:1px solid #1e2d47;background:transparent;color:#94a3b8;font-family:inherit;transition:all .15s}
        .period-btn.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.3)}
        .main-grid{display:grid;grid-template-columns:1fr 1fr;gap:18px}
        .full-grid{display:grid;grid-template-columns:2fr 1fr;gap:18px}
        .bar-group:hover .bar-fill{filter:brightness(1.3)}
        @media(max-width:1100px){.main-grid{grid-template-columns:1fr}.full-grid{grid-template-columns:1fr}}
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
          .mob-overlay.open{display:block}
          .navbar{left:0;padding:0 16px}.page-main{margin-left:0;padding:16px}
          .mob-burger{display:grid !important}
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
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>Analytics</div>
            <div style={{fontSize:11,color:"#4a6080"}}>Home → Analytics</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:8}}>
          {["3m","7m","1y"].map(p=>(
            <button key={p} className={`period-btn${period===p?" active":""}`} onClick={()=>setPeriod(p)}>{p}</button>
          ))}
         <Link href="/owner/complaints" className="nav-ico" style={{ textDecoration:"none" }}>
    🔔
    <div style={{ position:"absolute", top:5, right:5, width:7, height:7, borderRadius:"50%", background:"#f43f5e", border:"2px solid #0d1526" }} />
  </Link>
          <Link href="/owner/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none",flexShrink:0}}>AK</Link>
        </div>
      </header>

      <main className="page-main">

        <div className="a1" style={{marginBottom:22}}>
          <div style={{fontSize:"clamp(18px,2.5vw,24px)",fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em"}}>Analytics</div>
          <div style={{fontSize:13,color:"#94a3b8",marginTop:3}}>Financial & occupancy overview · Last 7 months</div>
        </div>

        {/* KPI row */}
        <div className="a2" style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(150px,1fr))",gap:12,marginBottom:20}}>
          {[
            {icon:"💰",label:"Total Revenue",    value:"₹5,57,500", sub:"+6.4% vs last mo", color:"#22c55e",bg:"rgba(34,197,94,0.1)"},
            {icon:"📊",label:"Avg Occupancy",    value:"87%",        sub:"+3% vs last mo",   color:"#06b6d4",bg:"rgba(6,182,212,0.1)"},
            {icon:"🏘️",label:"Active Properties",value:"5",          sub:"4 fully occupied",  color:"#8b5cf6",bg:"rgba(139,92,246,0.1)"},
            {icon:"👥",label:"Total Tenants",    value:"56",         sub:"3 expiring leases", color:"#f59e0b",bg:"rgba(245,158,11,0.1)"},
          ].map(s=>(
            <div key={s.label} style={{background:"#111d33",border:"1px solid #1e2d47",borderRadius:12,padding:"18px"}}>
              <div style={{width:36,height:36,borderRadius:9,background:s.bg,display:"grid",placeItems:"center",fontSize:16,marginBottom:10}}>{s.icon}</div>
              <div style={{fontSize:22,fontWeight:800,color:s.color,letterSpacing:"-0.02em"}}>{s.value}</div>
              <div style={{fontSize:11,color:"#4a6080",marginTop:2}}>{s.label}</div>
              <div style={{fontSize:10,color:s.color,marginTop:4}}>{s.sub}</div>
            </div>
          ))}
        </div>

        {/* Bar chart + donut */}
        <div className="full-grid a3" style={{marginBottom:18}}>

          {/* Income bar chart */}
          <div className="glass-card">
            <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:20}}>
              <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>Monthly Income</div>
              <div style={{display:"flex",gap:14,fontSize:11,color:"#4a6080"}}>
                <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:8,height:8,borderRadius:2,background:"#06b6d4",display:"inline-block"}}/>Actual</span>
                <span style={{display:"flex",alignItems:"center",gap:5}}><span style={{width:8,height:8,borderRadius:2,background:"#1e2d47",display:"inline-block"}}/>Target</span>
              </div>
            </div>
            <div style={{display:"flex",alignItems:"flex-end",gap:10,height:160,paddingBottom:0}}>
              {MONTHLY.map(m=>(
                <div key={m.month} className="bar-group" style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",gap:4,height:"100%",justifyContent:"flex-end"}}>
                  <div style={{width:"100%",display:"flex",gap:3,alignItems:"flex-end",height:"100%",justifyContent:"center"}}>
                    {/* Target bar */}
                    <div style={{flex:1,background:"#1e2d47",borderRadius:"4px 4px 0 0",height:`${(m.target/maxIncome)*100}%`,maxWidth:14}}/>
                    {/* Actual bar */}
                    <div className="bar-fill" style={{flex:1,background:"linear-gradient(180deg,#06b6d4,#0891b2)",borderRadius:"4px 4px 0 0",height:`${(m.income/maxIncome)*100}%`,maxWidth:14,transition:"filter .2s"}}/>
                  </div>
                  <div style={{fontSize:9,color:"#4a6080",paddingTop:6}}>{m.month}</div>
                </div>
              ))}
            </div>
            <div style={{display:"flex",gap:16,marginTop:16,paddingTop:14,borderTop:"1px solid #1e2d47"}}>
              {[
                {label:"Best Month",  value:"Feb — ₹90,000",  color:"#22c55e"},
                {label:"Current MTD", value:"Mar — ₹54,000",  color:"#f59e0b"},
                {label:"7m Total",    value:"₹5,57,500",       color:"#06b6d4"},
              ].map(s=>(
                <div key={s.label} style={{flex:1}}>
                  <div style={{fontSize:10,color:"#4a6080"}}>{s.label}</div>
                  <div style={{fontSize:12,fontWeight:700,color:s.color,marginTop:2}}>{s.value}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Occupancy donut */}
          <div className="glass-card" style={{display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center"}}>
            <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:20,alignSelf:"flex-start"}}>Overall Occupancy</div>
            <svg viewBox="0 0 120 120" width={130} height={130} style={{overflow:"visible",marginBottom:10}}>
              <circle cx={60} cy={60} r={50} fill="none" stroke="#1e2d47" strokeWidth={12}/>
              <circle cx={60} cy={60} r={50} fill="none" stroke="url(#occGrad)" strokeWidth={12}
                strokeDasharray={`${(87/100)*314} 314`} strokeLinecap="round"
                transform="rotate(-90 60 60)" style={{transition:"stroke-dasharray .6s ease"}}/>
              <defs>
                <linearGradient id="occGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#06b6d4"/>
                  <stop offset="100%" stopColor="#8b5cf6"/>
                </linearGradient>
              </defs>
              <text x={60} y={57} textAnchor="middle" fontSize={20} fontWeight={800} fill="#e2e8f0" fontFamily="Plus Jakarta Sans">87%</text>
              <text x={60} y={73} textAnchor="middle" fontSize={9} fill="#4a6080" fontFamily="Plus Jakarta Sans">occupied</text>
            </svg>
            <div style={{display:"flex",gap:16,marginTop:8}}>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:18,fontWeight:800,color:"#22c55e"}}>48</div>
                <div style={{fontSize:10,color:"#4a6080"}}>Occupied</div>
              </div>
              <div style={{width:1,background:"#1e2d47"}}/>
              <div style={{textAlign:"center"}}>
                <div style={{fontSize:18,fontWeight:800,color:"#f43f5e"}}>7</div>
                <div style={{fontSize:10,color:"#4a6080"}}>Vacant</div>
              </div>
            </div>
          </div>
        </div>

        {/* Property breakdown + expenses */}
        <div className="main-grid a4">
          {/* Per-property */}
          <div className="glass-card">
            <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:16}}>Income by Property</div>
            {PROPERTIES.map(p=>(
              <div key={p.name} style={{marginBottom:16}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:6}}>
                  <span style={{fontSize:13,color:"#94a3b8"}}>{p.name}</span>
                  <span style={{fontSize:13,fontWeight:700,color:p.color}}>{p.income}<span style={{fontSize:10,color:"#4a6080",fontWeight:400}}>/yr</span></span>
                </div>
                <div style={{height:6,background:"#1e2d47",borderRadius:3,overflow:"hidden",marginBottom:4}}>
                  <div style={{height:"100%",width:`${(p.occupied/p.units)*100}%`,background:p.color,borderRadius:3}}/>
                </div>
                <div style={{fontSize:11,color:"#4a6080"}}>{p.occupied}/{p.units} units · {Math.round((p.occupied/p.units)*100)}% occupancy</div>
              </div>
            ))}
          </div>

          {/* Expense breakdown */}
          <div className="glass-card">
            <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:16}}>Expense Breakdown</div>
            <div style={{fontSize:28,fontWeight:800,color:"#f43f5e",letterSpacing:"-0.02em",marginBottom:2}}>₹42,300</div>
            <div style={{fontSize:12,color:"#4a6080",marginBottom:18}}>Total expenses this month</div>
            {EXPENSE_CATS.map(e=>(
              <div key={e.label} style={{marginBottom:12}}>
                <div style={{display:"flex",justifyContent:"space-between",marginBottom:4}}>
                  <span style={{fontSize:12,color:"#94a3b8"}}>{e.label}</span>
                  <span style={{fontSize:12,fontWeight:700,color:e.color}}>{e.pct}%</span>
                </div>
                <div style={{height:5,background:"#1e2d47",borderRadius:3,overflow:"hidden"}}>
                  <div style={{height:"100%",width:`${e.pct}%`,background:e.color,borderRadius:3}}/>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Occupancy trend */}
        <div className="glass-card a5" style={{marginTop:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",marginBottom:16}}>
            <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>Occupancy Trend</div>
            <div style={{fontSize:12,color:"#4a6080"}}>Last 7 months</div>
          </div>
          <div style={{display:"flex",alignItems:"center",gap:0,height:80,position:"relative"}}>
            {/* Grid lines */}
            {[100,75,50,25].map(v=>(
              <div key={v} style={{position:"absolute",left:0,right:0,top:`${100-v}%`,borderTop:"1px dashed rgba(30,45,71,0.8)",display:"flex",alignItems:"center"}}>
                <span style={{fontSize:9,color:"#2d4060",position:"absolute",left:0,transform:"translateY(-50%)"}}>{v}%</span>
              </div>
            ))}
            <div style={{display:"flex",alignItems:"flex-end",width:"100%",height:"100%",paddingLeft:24,gap:0}}>
              {MONTHLY.map((m,i)=>(
                <div key={m.month} style={{flex:1,display:"flex",flexDirection:"column",alignItems:"center",height:"100%",justifyContent:"flex-end",position:"relative"}}>
                  {i>0&&(
                    <svg style={{position:"absolute",bottom:0,left:"-50%",width:"100%",height:"100%",overflow:"visible",pointerEvents:"none"}}>
                      <line
                        x1="50%" y1={`${100-MONTHLY[i-1].occupancy}%`}
                        x2="150%" y2={`${100-m.occupancy}%`}
                        stroke="#06b6d4" strokeWidth={2} strokeOpacity={0.6}
                      />
                    </svg>
                  )}
                  <div style={{width:8,height:8,borderRadius:"50%",background:"#06b6d4",border:"2px solid #0d1526",position:"absolute",bottom:`${m.occupancy}%`,transform:"translateY(50%)",zIndex:2}}/>
                </div>
              ))}
            </div>
          </div>
          <div style={{display:"flex",paddingLeft:24}}>
            {MONTHLY.map(m=>(
              <div key={m.month} style={{flex:1,textAlign:"center",fontSize:10,color:"#4a6080",paddingTop:8}}>{m.month}</div>
            ))}
          </div>
        </div>

      </main>
    </>
  );
}