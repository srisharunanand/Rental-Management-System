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
    { icon:"💬", label:"Messages",   href:"/owner/messages",   active:false },
    { icon:"⚙️", label:"Settings",  href:"/owner/settings",   active:true },
  ]},
];

const SETTINGS_TABS = ["Profile","Notifications","Security","Billing","Preferences"];

export default function SettingsPage() {
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [tab, setTab] = useState("Profile");
  const [toggles, setToggles] = useState({
    emailRent:true, emailMaintenance:true, emailLease:false,
    smsRent:false, smsMaintenance:true, smsLease:false,
    darkMode:true, compactSidebar:false, autoInvoice:true, twoFactor:false,
  });

  const flip = (key: keyof typeof toggles) => setToggles(p=>({...p,[key]:!p[key]}));

  const Toggle = ({k,label,sub}:{k:keyof typeof toggles;label:string;sub?:string})=>(
    <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",padding:"13px 0",borderBottom:"1px solid rgba(30,45,71,0.5)"}}>
      <div>
        <div style={{fontSize:13,fontWeight:500,color:"#e2e8f0"}}>{label}</div>
        {sub&&<div style={{fontSize:11,color:"#4a6080",marginTop:2}}>{sub}</div>}
      </div>
      <div onClick={()=>flip(k)} style={{width:42,height:24,borderRadius:12,background:toggles[k]?"#06b6d4":"#1e2d47",position:"relative",cursor:"pointer",transition:"background .2s",flexShrink:0}}>
        <div style={{position:"absolute",top:3,left:toggles[k]?20:3,width:18,height:18,borderRadius:"50%",background:"white",transition:"left .2s",boxShadow:"0 1px 4px rgba(0,0,0,0.3)"}}/>
      </div>
    </div>
  );

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
        html,body{height:100%;font-family:'Plus Jakarta Sans',sans-serif;background:#080e1a;color:#e2e8f0}
        ::-webkit-scrollbar{width:4px;height:4px}::-webkit-scrollbar-thumb{background:#1e2d47;border-radius:4px}
        @keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse-ring{0%{transform:scale(1);opacity:.5}100%{transform:scale(1.6);opacity:0}}
        .a1{animation:fadeUp .4s ease both .05s}.a2{animation:fadeUp .4s ease both .10s}.a3{animation:fadeUp .4s ease both .15s}
        .sb-link{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:8px;font-size:13px;font-weight:500;color:#94a3b8;cursor:pointer;transition:all .15s;text-decoration:none;margin-bottom:2px;border:1px solid transparent}
        .sb-link:hover{background:rgba(255,255,255,0.04);color:#e2e8f0}
        .sb-link.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.15)}
        .sidebar{position:fixed;top:0;left:0;bottom:0;width:250px;background:#0d1526;border-right:1px solid #1e2d47;display:flex;flex-direction:column;z-index:300;transition:transform .3s ease}
        .navbar{position:fixed;top:0;left:250px;right:0;height:62px;background:#0d1526;border-bottom:1px solid #1e2d47;display:flex;align-items:center;justify-content:space-between;padding:0 24px;z-index:200}
        .page-main{margin-left:250px;margin-top:62px;padding:26px;min-height:calc(100vh - 62px)}
        .glass-card{background:#111d33;border:1px solid #1e2d47;border-radius:14px;padding:24px}
        .mob-overlay{display:none;position:fixed;inset:0;background:rgba(0,0,0,0.6);z-index:250;backdrop-filter:blur(2px)}
        .nav-ico{width:36px;height:36px;border-radius:8px;background:#111d33;border:1px solid #1e2d47;display:grid;place-items:center;cursor:pointer;font-size:15px;position:relative;transition:border-color .2s;flex-shrink:0}
        .tab-btn{padding:9px 18px;border-radius:9px;font-size:13px;font-weight:600;cursor:pointer;border:1px solid transparent;background:transparent;color:#94a3b8;font-family:inherit;transition:all .15s;white-space:nowrap}
        .tab-btn.active{background:rgba(6,182,212,0.1);color:#06b6d4;border-color:rgba(6,182,212,0.2)}
        .tab-btn:hover{color:#e2e8f0}
        .inp{width:100%;padding:10px 14px;background:rgba(255,255,255,0.04);border:1px solid #1e2d47;border-radius:9px;color:#e2e8f0;font-size:13px;font-family:inherit;outline:none;transition:border-color .2s}
        .inp:focus{border-color:rgba(6,182,212,0.5)}
        .inp::placeholder{color:#334155}
        .save-btn{background:linear-gradient(135deg,#06b6d4,#8b5cf6);border:none;border-radius:10px;padding:10px 24px;font-size:13px;font-weight:700;color:white;cursor:pointer;font-family:inherit;transition:transform .15s}
        .save-btn:hover{transform:translateY(-1px);box-shadow:0 6px 20px rgba(6,182,212,0.3)}
        .settings-grid{display:grid;grid-template-columns:1fr 1fr;gap:20px}
        @media(max-width:900px){.settings-grid{grid-template-columns:1fr}}
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
            <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0"}}>Settings</div>
            <div style={{fontSize:11,color:"#4a6080"}}>Home → Settings</div>
          </div>
        </div>
        <div style={{display:"flex",alignItems:"center",gap:10}}>
          <Link href="/owner/complaints" className="nav-ico" style={{textDecoration:"none"}}>🔔<div style={{position:"absolute",top:5,right:5,width:7,height:7,borderRadius:"50%",background:"#f43f5e",border:"2px solid #0d1526"}}/></Link>
          <Link href="/owner/settings" style={{width:36,height:36,borderRadius:8,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:12,fontWeight:700,border:"1.5px solid rgba(6,182,212,0.3)",textDecoration:"none",flexShrink:0}}>AK</Link>
        </div>
      </header>

      <main className="page-main">
        <div className="a1" style={{marginBottom:22}}>
          <div style={{fontSize:"clamp(18px,2.5vw,24px)",fontWeight:800,color:"#e2e8f0",letterSpacing:"-0.02em"}}>Settings</div>
          <div style={{fontSize:13,color:"#94a3b8",marginTop:3}}>Manage your account and preferences</div>
        </div>

        {/* Tabs */}
        <div className="a2" style={{display:"flex",gap:6,flexWrap:"wrap",marginBottom:22,background:"#111d33",border:"1px solid #1e2d47",borderRadius:12,padding:6}}>
          {SETTINGS_TABS.map(t=>(
            <button key={t} className={`tab-btn${tab===t?" active":""}`} onClick={()=>setTab(t)}>{t}</button>
          ))}
        </div>

        {/* Profile tab */}
        {tab==="Profile"&&(
          <div className="a3 settings-grid">
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Personal Information</div>
              <div style={{display:"flex",alignItems:"center",gap:14,marginBottom:24}}>
                <div style={{width:64,height:64,borderRadius:16,background:"linear-gradient(135deg,#06b6d4,#8b5cf6)",display:"grid",placeItems:"center",color:"white",fontSize:24,fontWeight:700,flexShrink:0}}>AK</div>
                <div>
                  <div style={{fontSize:16,fontWeight:700,color:"#e2e8f0"}}>Arjun Kumar</div>
                  <div style={{fontSize:12,color:"#4a6080"}}>Property Owner · Admin</div>
                  <button style={{marginTop:6,padding:"4px 12px",background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:7,color:"#06b6d4",fontSize:11,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Change Photo</button>
                </div>
              </div>
              {[
                {label:"Full Name",    val:"Arjun Kumar",          ph:"Your full name"},
                {label:"Email",        val:"arjun@rentmanager.in", ph:"Email address"},
                {label:"Phone",        val:"+91 98400 00001",      ph:"Phone number"},
                {label:"Location",     val:"Chennai, Tamil Nadu",  ph:"City, State"},
              ].map(f=>(
                <div key={f.label} style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{f.label}</div>
                  <input className="inp" defaultValue={f.val} placeholder={f.ph}/>
                </div>
              ))}
              <button className="save-btn" style={{marginTop:8}}>Save Changes</button>
            </div>

            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Account Stats</div>
              {[
                {icon:"🏠",label:"Properties Managed",value:"5"},
                {icon:"👥",label:"Total Tenants",      value:"56"},
                {icon:"📋",label:"Active Leases",      value:"12"},
                {icon:"💰",label:"Monthly Revenue",    value:"₹90,000"},
                {icon:"📅",label:"Member Since",       value:"Jan 2022"},
              ].map(s=>(
                <div key={s.label} style={{display:"flex",justifyContent:"space-between",padding:"12px 0",borderBottom:"1px solid rgba(30,45,71,0.5)",fontSize:13}}>
                  <div style={{display:"flex",alignItems:"center",gap:10,color:"#94a3b8"}}>
                    <span>{s.icon}</span><span>{s.label}</span>
                  </div>
                  <span style={{fontWeight:700,color:"#e2e8f0"}}>{s.value}</span>
                </div>
              ))}
              <button style={{marginTop:18,width:"100%",padding:"10px",background:"rgba(244,63,94,0.07)",border:"1px solid rgba(244,63,94,0.2)",borderRadius:10,color:"#f43f5e",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                🗑️ Delete Account
              </button>
            </div>
          </div>
        )}

        {/* Notifications tab */}
        {tab==="Notifications"&&(
          <div className="a3 settings-grid">
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>Email Notifications</div>
              <div style={{fontSize:12,color:"#4a6080",marginBottom:16}}>Choose what you receive via email</div>
              <Toggle k="emailRent"        label="Rent due reminders"       sub="3 days before due date"/>
              <Toggle k="emailMaintenance" label="Maintenance updates"      sub="When status changes"/>
              <Toggle k="emailLease"       label="Lease expiry alerts"      sub="30 days before expiry"/>
            </div>
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>SMS Notifications</div>
              <div style={{fontSize:12,color:"#4a6080",marginBottom:16}}>Standard carrier rates may apply</div>
              <Toggle k="smsRent"        label="Rent payment confirmed"    sub="When tenant pays"/>
              <Toggle k="smsMaintenance" label="New maintenance requests"  sub="Instant SMS alert"/>
              <Toggle k="smsLease"       label="Lease renewals"            sub="Renewal reminders"/>
            </div>
          </div>
        )}

        {/* Security tab */}
        {tab==="Security"&&(
          <div className="a3 settings-grid">
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Password</div>
              {["Current Password","New Password","Confirm New Password"].map(f=>(
                <div key={f} style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{f}</div>
                  <input className="inp" type="password" placeholder="••••••••"/>
                </div>
              ))}
              <button className="save-btn">Update Password</button>
            </div>
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Security Options</div>
              <Toggle k="twoFactor" label="Two-Factor Authentication" sub="Adds an extra layer of security"/>
              <div style={{marginTop:18,padding:"14px",background:"rgba(245,158,11,0.07)",border:"1px solid rgba(245,158,11,0.2)",borderRadius:10}}>
                <div style={{fontSize:13,fontWeight:600,color:"#f59e0b",marginBottom:4}}>⚠️ Active Sessions</div>
                <div style={{fontSize:12,color:"#94a3b8",marginBottom:10}}>1 device currently logged in</div>
                <button style={{padding:"6px 14px",background:"rgba(244,63,94,0.08)",border:"1px solid rgba(244,63,94,0.2)",borderRadius:8,color:"#f43f5e",fontSize:12,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>Sign out all devices</button>
              </div>
            </div>
          </div>
        )}

        {/* Preferences tab */}
        {tab==="Preferences"&&(
          <div className="a3 settings-grid">
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:6}}>App Preferences</div>
              <div style={{fontSize:12,color:"#4a6080",marginBottom:16}}>Customize your experience</div>
              <Toggle k="darkMode"       label="Dark Mode"         sub="Always enabled for best experience"/>
              <Toggle k="compactSidebar" label="Compact Sidebar"   sub="Smaller sidebar icons"/>
              <Toggle k="autoInvoice"    label="Auto-Generate Invoices" sub="On 1st of every month"/>
            </div>
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Regional Settings</div>
              {[
                {label:"Currency",  val:"INR (₹)"},
                {label:"Date Format",val:"DD/MM/YYYY"},
                {label:"Time Zone", val:"IST (UTC+5:30)"},
                {label:"Language",  val:"English"},
              ].map(f=>(
                <div key={f.label} style={{marginBottom:14}}>
                  <div style={{fontSize:11,fontWeight:600,color:"#94a3b8",textTransform:"uppercase",letterSpacing:"0.08em",marginBottom:6}}>{f.label}</div>
                  <input className="inp" defaultValue={f.val}/>
                </div>
              ))}
              <button className="save-btn">Save Preferences</button>
            </div>
          </div>
        )}

        {/* Billing tab */}
        {tab==="Billing"&&(
          <div className="a3 settings-grid">
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Current Plan</div>
              <div style={{background:"linear-gradient(135deg,rgba(6,182,212,0.1),rgba(139,92,246,0.1))",border:"1px solid rgba(6,182,212,0.2)",borderRadius:12,padding:"18px",marginBottom:18}}>
                <div style={{fontSize:11,color:"#06b6d4",textTransform:"uppercase",letterSpacing:"0.1em",marginBottom:4}}>Active Plan</div>
                <div style={{fontSize:24,fontWeight:800,color:"#e2e8f0"}}>Pro Plan</div>
                <div style={{fontSize:13,color:"#94a3b8",marginTop:4}}>₹999/month · Billed monthly</div>
                <div style={{marginTop:12,display:"flex",gap:8,flexWrap:"wrap"}}>
                  {["Unlimited properties","All features","Priority support","Analytics"].map(f=>(
                    <span key={f} style={{fontSize:11,padding:"3px 9px",borderRadius:20,background:"rgba(34,197,94,0.1)",color:"#22c55e"}}>✓ {f}</span>
                  ))}
                </div>
              </div>
              <button style={{width:"100%",padding:"10px",background:"rgba(6,182,212,0.08)",border:"1px solid rgba(6,182,212,0.2)",borderRadius:10,color:"#06b6d4",fontSize:13,fontWeight:600,cursor:"pointer",fontFamily:"inherit"}}>
                Manage Subscription
              </button>
            </div>
            <div className="glass-card">
              <div style={{fontSize:15,fontWeight:700,color:"#e2e8f0",marginBottom:20}}>Billing History</div>
              {[
                {date:"Mar 1, 2026",amount:"₹999",status:"Paid"},
                {date:"Feb 1, 2026",amount:"₹999",status:"Paid"},
                {date:"Jan 1, 2026",amount:"₹999",status:"Paid"},
                {date:"Dec 1, 2025",amount:"₹999",status:"Paid"},
              ].map(b=>(
                <div key={b.date} style={{display:"flex",justifyContent:"space-between",padding:"11px 0",borderBottom:"1px solid rgba(30,45,71,0.5)",fontSize:13}}>
                  <span style={{color:"#94a3b8"}}>{b.date}</span>
                  <div style={{display:"flex",gap:12,alignItems:"center"}}>
                    <span style={{fontWeight:700,color:"#e2e8f0"}}>{b.amount}</span>
                    <span style={{fontSize:10,fontWeight:600,padding:"2px 8px",borderRadius:20,background:"rgba(34,197,94,0.1)",color:"#22c55e"}}>✓ {b.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </>
  );
}