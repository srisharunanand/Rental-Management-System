"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { leaseAPI } from "@/app/services/api";

const NAV_ITEMS = [
  { icon:"⚡", label:"Dashboard",  href:"/tenant/dashboard",  active:false },
  { icon:"💳", label:"Payments",   href:"/tenant/payments",   active:false },
  { icon:"🔧", label:"Maintenance", href:"/tenant/complaints", active:false },
  { icon:"📋", label:"My Lease",   href:"/tenant/lease",      active:true  },
  { icon:"💬", label:"Messages",   href:"/tenant/messages",   active:false },
  { icon:"⚙️", label:"Settings",  href:"/tenant/settings",   active:false },
];

const TENANT = { name:"Rahul Krishnan", initials:"RK", unit:"Unit 4B", property:"Greenview Apartments", address:"12, Anna Nagar, Chennai – 600 040", floor:"2nd Floor", type:"2 BHK", since:"Jan 2024" };

const LEASE = {
  id:           "LSE-2024-042",
  unit:         "Unit 4B, 2nd Floor",
  property:     "Greenview Apartments, Anna Nagar, Chennai – 600 040",
  type:         "Residential Lease Agreement",
  startDate:    "January 1, 2024",
  endDate:      "December 31, 2026",
  monthsLeft:   9,
  totalMonths:  36,
  monthlyRent:  18000,
  deposit:      36000,
  owner:        "Arjun Kumar",
  ownerPhone:   "+91 98400 00001",
  ownerEmail:   "arjun@rentmanager.in",
  noticePeriod: "2 months",
  renewalClause:"Auto-renewal on mutual agreement",
  petPolicy:    "Not allowed",
  subletting:   "Not permitted",
  maintenance:  "Tenant responsible for minor repairs up to ₹500",
};

const CLAUSES = [
  { icon:"💰", title:"Rent Escalation",    desc:"Rent may increase by up to 5% annually on lease renewal with 30 days notice." },
  { icon:"🔧", title:"Maintenance",         desc:"Minor repairs up to ₹500 are tenant's responsibility. Major repairs are owner's." },
  { icon:"🐾", title:"Pet Policy",          desc:"No pets allowed on the premises without written consent from the owner." },
  { icon:"🚬", title:"No Smoking",          desc:"Smoking is strictly prohibited inside the unit and common areas." },
  { icon:"📢", title:"Noise Policy",        desc:"Quiet hours between 10 PM – 7 AM. Parties require prior approval." },
  { icon:"🔑", title:"Key Policy",          desc:"Tenant is responsible for all keys issued. Lost keys incur a ₹1,000 replacement charge." },
];

export default function TenantLeasePage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [lease, setLease] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string|null>(null);

  useEffect(() => {
    const fetchLease = async () => {
      try {
        setLoading(true);
        const response = await leaseAPI.getAll();
        const leaseData = response.data && response.data.length > 0 ? response.data[0] : null;
        setLease(leaseData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch lease');
        setLease(null);
      } finally {
        setLoading(false);
      }
    };
    fetchLease();
  }, []);

  const progressPct = lease ? Math.round((((lease.total_months || 36) - (lease.months_remaining || 0)) / (lease.total_months || 36)) * 100) : 50;
  const daysLeft    = lease ? (lease.months_remaining || 0) * 30 : 0;

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
        .a5{animation:fadeUp .4s ease both .25s}
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
        .nav-ico:hover{border-color:#06b6d4}
        .clause-card{background:#0d1526;border:1px solid #1e2d47;border-radius:11px;padding:14px;transition:border-color .15s}
        .clause-card:hover{border-color:rgba(6,182,212,0.3)}
        .main-grid{display:grid;grid-template-columns:1fr 300px;gap:18px}
        .clauses-grid{display:grid;grid-template-columns:1fr 1fr;gap:12px}
        @media(max-width:1100px){.main-grid{grid-template-columns:1fr}}
        @media(max-width:768px){
          .sidebar{transform:translateX(-100%)}.sidebar.open{transform:translateX(0)}
          .mob-overlay.open{display:block}
          .navbar{left:0;padding:0 16px}.page-main{margin-left:0;padding:16px}
          .mob-burger{display:grid !important}.nav-search-wrap{display:none}
          .clauses-grid{grid-template-columns:1fr}
        }
      `}</style>

      <div className={`mob-overlay${mobileOpen?" open":""}`} onClick={()=>setMobileOpen(false)}/>

      {/* Sidebar */}
      <aside className={`sidebar${mobileOpen?" open":""}`}>
        <div style={{height:62,display:"flex",alignItems:"center",gap:12,padding:"0 20px",borderBottom:"1px solid #1e2d47",flexShrink:0}}>
          <div style={{position:"relative",width:34,height:34,borderRadius:9,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",fontSize:16,flexShrink:0,boxShadow:"0 0 16px rgba(6,182,212,0.3)"}}>
            🏠<div style={{position:"absolute",inset:-3,borderRadius:12,border:"1.5px solid rgba(6,182,212,0.35)",animation:"pulse-ring 2s ease-out infinite",pointerEvents:"none"}}/>
          </div>
          <div>
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",letterSpacing:"-0.02em"}}>RentManager</div>
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
            </Link>
          ))}
        </nav>
        <div style={{padding:"13px 12px",borderTop:"1px solid #1e2d47",flexShrink:0}}>
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
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>My Lease</div>
            <div style={{fontSize:11,color:"#4a6080"}}>Home → Lease</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Link href="/owner/complaints" className="nav-ico" style={{textDecoration:"none"}}>🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></Link>
          <Link href="/tenant/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none",flexShrink:0}}>RK</Link>
        </div>
      </header>

      <main className="page-main">

        <div className="a1" style={{marginBottom:22}}>
          <div style={{fontSize:"clamp(18px,2.5vw,24px)",fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em"}}>My Lease Agreement</div>
          <div style={{fontSize:13,color:"#94a3b8",marginTop:3}}>{lease?.id || 'Loading...'} · {lease?.type || 'Residential Lease'}</div>
        </div>

        {/* Lease duration progress */}
        <div className="glass-card a2" style={{marginBottom:18}}>
          <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",flexWrap:"wrap",gap:12,marginBottom:20}}>
            <div>
              <div style={{fontSize:13,fontWeight:700,color:"#e2e8f0",marginBottom:2}}>Lease Duration</div>
              <div style={{fontSize:12,color:"#4a6080"}}>{LEASE.startDate} → {LEASE.endDate}</div>
            </div>
            <div style={{textAlign:"right"}}>
              <div style={{fontSize:28,fontWeight:800,color:"#06b6d4",letterSpacing:"-0.02em"}}>{LEASE.monthsLeft} mo</div>
              <div style={{fontSize:11,color:"#4a6080"}}>remaining · ~{daysLeft} days</div>
            </div>
          </div>
          <div style={{marginBottom:8}}>
            <div style={{display:"flex",justifyContent:"space-between",fontSize:11,color:"#4a6080",marginBottom:6}}>
              <span>Start</span><span>{progressPct}% completed</span><span>End</span>
            </div>
            <div style={{height:8,background:"#1e2d47",borderRadius:4,overflow:"hidden"}}>
              <div style={{height:"100%",width:`${progressPct}%`,background:"linear-gradient(90deg,#06b6d4,#8b5cf6)",borderRadius:4}}/>
            </div>
          </div>
          <div style={{display:"flex",gap:8,marginTop:16,flexWrap:"wrap"}}>
            {[
              {label:"Lease ID",      value:lease?.id || 'N/A',                         color:"#06b6d4"},
              {label:"Notice Period", value:LEASE.noticePeriod,               color:"#f59e0b"},
              {label:"Renewal",       value:LEASE.renewalClause.split(" ")[0]+" renewal", color:"#22c55e"},
            ].map(s=>(
              <div key={s.label} style={{flex:1,minWidth:120,background:"rgba(255,255,255,0.03)",border:"1px solid #1e2d47",borderRadius:10,padding:"10px 12px",textAlign:"center"}}>
                <div style={{fontSize:11,color:"#4a6080",marginBottom:3}}>{s.label}</div>
                <div style={{fontSize:12,fontWeight:700,color:s.color}}>{s.value}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="main-grid">
          {/* Left: lease details + clauses */}
          <div style={{display:"flex",flexDirection:"column",gap:18}}>

            {/* Lease details */}
            <div className="glass-card a3">
              <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:16}}>Lease Details</div>
              {[
                ["🏠 Unit",          `${LEASE.unit}`],
                ["📍 Property",      lease?.property_name || 'N/A'],
                ["👤 Owner",         LEASE.owner],
                ["📞 Owner Phone",   LEASE.ownerPhone],
                ["📧 Owner Email",   LEASE.ownerEmail],
                ["💰 Monthly Rent",  `₹${(lease?.monthly_rent || 0).toLocaleString()}`],
                ["🏦 Security Deposit",`₹${LEASE.deposit.toLocaleString()}`],
                ["🐾 Pet Policy",    LEASE.petPolicy],
                ["🔁 Subletting",    LEASE.subletting],
              ].map(([k,v])=>(
                <div key={k as string} style={{display:"flex",justifyContent:"space-between",padding:"10px 0",borderBottom:"1px solid rgba(30,45,71,0.6)",fontSize:13,gap:12}}>
                  <span style={{color:"#4a6080",flexShrink:0}}>{k}</span>
                  <span style={{color:"#e2e8f0",fontWeight:500,textAlign:"right"}}>{v}</span>
                </div>
              ))}
            </div>

            {/* Key clauses */}
            <div className="glass-card a4">
              <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:16}}>Key Clauses</div>
              <div className="clauses-grid">
                {CLAUSES.map((c,i)=>(
                  <div key={i} className="clause-card">
                    <div style={{fontSize:20,marginBottom:8}}>{c.icon}</div>
                    <div style={{fontSize:13,fontWeight:600,color:"#e2e8f0",marginBottom:5}}>{c.title}</div>
                    <div style={{fontSize:11,color:"#64748b",lineHeight:1.5}}>{c.desc}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right: actions + owner contact */}
          <div style={{display:"flex",flexDirection:"column",gap:16}}>

            {/* Actions */}
            <div className="glass-card a3">
              <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:14}}>Actions</div>
              <div style={{display:"flex",flexDirection:"column",gap:9}}>
                {[
                  {ico:"📄",label:"Download Lease PDF",    color:"#06b6d4",bg:"rgba(6,182,212,0.08)",  border:"rgba(6,182,212,0.2)"},
                  {ico:"✉️",label:"Request Renewal",       color:"#8b5cf6",bg:"rgba(139,92,246,0.08)", border:"rgba(139,92,246,0.2)"},
                  {ico:"📢",label:"Report an Issue",        color:"#f59e0b",bg:"rgba(245,158,11,0.08)", border:"rgba(245,158,11,0.2)"},
                  {ico:"🚪",label:"Notice to Vacate",       color:"#f43f5e",bg:"rgba(244,63,94,0.06)",  border:"rgba(244,63,94,0.2)"},
                ].map(a=>(
                  <button key={a.label} style={{display:"flex",alignItems:"center",gap:10,padding:"11px 14px",borderRadius:10,border:`1px solid ${a.border}`,background:a.bg,color:a.color,fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit",width:"100%",textAlign:"left",transition:"transform .15s"}}
                    onMouseEnter={e=>(e.currentTarget as HTMLButtonElement).style.transform="translateX(3px)"}
                    onMouseLeave={e=>(e.currentTarget as HTMLButtonElement).style.transform="translateX(0)"}>
                    <span style={{fontSize:16}}>{a.ico}</span>{a.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Owner contact */}
            <div className="glass-card a4">
              <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0",marginBottom:14}}>Owner Contact</div>
              <div style={{display:"flex",alignItems:"center",gap:12,marginBottom:14}}>
                <div style={{width:44,height:44,borderRadius:12,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:16,fontWeight:700,flexShrink:0}}>AK</div>
                <div>
                  <div style={{fontSize:14,fontWeight:700,color:"#e2e8f0"}}>{LEASE.owner}</div>
                  <div style={{fontSize:11,color:"#4a6080"}}>Property Owner</div>
                </div>
              </div>
              {[
                {ico:"📞",label:LEASE.ownerPhone},
                {ico:"📧",label:LEASE.ownerEmail},
              ].map(c=>(
                <div key={c.label} style={{display:"flex",alignItems:"center",gap:10,padding:"10px 12px",background:"rgba(255,255,255,0.03)",border:"1px solid #1e2d47",borderRadius:9,marginBottom:8,fontSize:13,color:"#94a3b8"}}>
                  <span>{c.ico}</span><span>{c.label}</span>
                </div>
              ))}
              <button style={{marginTop:4,width:"100%",padding:"10px",background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",border:"none",borderRadius:10,color:"white",fontSize:13,fontWeight:700,cursor:"pointer",fontFamily:"inherit"}}>
                💬 Message Owner
              </button>
            </div>

          </div>
        </div>
      </main>
    </>
  );
}